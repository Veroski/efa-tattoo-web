function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return { firstName: ".", lastName: "." };
  if (parts.length === 1) return { firstName: parts[0], lastName: "." };

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

const cityMap = {
  barcelona: "Barcelona",
  zurich: "Zurich",
};

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const DEFAULT_VERSION = "2021-07-28";
const DEFAULT_IMAGE_FIELD_KEY = "tattoo_img";
const DEFAULT_IMAGE_FILENAME = "tattoo-reference";

function ghlHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${process.env.GHL_PRIVATE_KEY}`,
    Version: DEFAULT_VERSION,
    ...extra,
  };
}

function parseJsonSafely(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sanitizeFilename(filename, contentType) {
  const fallbackExtension = contentType?.split("/")[1]?.toLowerCase() || "png";
  const safeBase = String(filename || DEFAULT_IMAGE_FILENAME)
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBase || DEFAULT_IMAGE_FILENAME}.${fallbackExtension}`;
}

async function fetchImageFromUrl(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Image fetch failed with status ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const pathname = new URL(imageUrl).pathname;
  const rawFilename = pathname.split("/").filter(Boolean).pop() || DEFAULT_IMAGE_FILENAME;

  return {
    buffer,
    contentType: response.headers.get("content-type") || "image/png",
    filename: rawFilename,
  };
}

function imageFromDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(String(dataUrl || ""));
  if (!match) return null;

  return {
    buffer: Buffer.from(match[2], "base64"),
    contentType: match[1],
    filename: `${DEFAULT_IMAGE_FILENAME}.${match[1].split("/")[1] || "png"}`,
  };
}

async function resolveImageAsset(data) {
  if (data?.tattoo_image?.base64 && data?.tattoo_image?.contentType) {
    return {
      buffer: Buffer.from(data.tattoo_image.base64, "base64"),
      contentType: data.tattoo_image.contentType,
      filename: data.tattoo_image.filename || DEFAULT_IMAGE_FILENAME,
    };
  }

  if (!data?.tattoo_img_url) return null;

  if (String(data.tattoo_img_url).startsWith("data:")) {
    return imageFromDataUrl(data.tattoo_img_url);
  }

  if (/^https?:\/\//i.test(String(data.tattoo_img_url))) {
    return fetchImageFromUrl(data.tattoo_img_url);
  }

  return null;
}

function extractContactId(payload) {
  return (
    payload?.contact?.id ||
    payload?.contact?._id ||
    payload?.id ||
    payload?.contactId ||
    payload?._id ||
    null
  );
}

async function uploadImageToGhlStorage({ contactId, locationId, image }) {
  const formData = new FormData();
  const filename = sanitizeFilename(image.filename, image.contentType);
  const blob = new Blob([image.buffer], { type: image.contentType });

  formData.append("id", contactId);
  formData.append("maxFiles", "1");
  formData.append("file", blob, filename);

  const response = await fetch(`${GHL_BASE_URL}/locations/${locationId}/customFields/upload`, {
    method: "POST",
    headers: ghlHeaders({ Accept: "application/json" }),
    body: formData,
  });

  const responseText = await response.text();

  if (!response.ok) {
    if (response.status === 401 && responseText.includes("not authorized for this scope")) {
      throw new Error(
        "The current GHL token is missing the `locations/customFields.write` scope required by `/locations/:locationId/customFields/upload`.",
      );
    }

    throw new Error(`Image storage upload failed with status ${response.status}: ${responseText}`);
  }

  const payload = parseJsonSafely(responseText);
  const uploadedUrl = payload?.meta?.[0]?.url || Object.values(payload?.uploadedFiles || {})[0];

  if (!uploadedUrl) {
    throw new Error("GHL storage upload succeeded but no file URL was returned.");
  }

  return uploadedUrl;
}

async function attachImageUrlToContact({ contactId, imageUrl }) {
  const fieldKey = process.env.GHL_TATTOO_IMG_FIELD_KEY || DEFAULT_IMAGE_FIELD_KEY;
  const response = await fetch(`${GHL_BASE_URL}/contacts/${contactId}`, {
    method: "PUT",
    headers: ghlHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({
      customFields: [{ key: fieldKey, value: imageUrl }],
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Contact image field update failed with status ${response.status}: ${responseText}`);
  }

  return parseJsonSafely(responseText);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    if (!process.env.GHL_PRIVATE_KEY || !process.env.GHL_LOCATION_ID) {
      console.error("Faltan credenciales de GHL en el entorno");
      return res.status(500).json({ ok: false, error: "Configuration error" });
    }

    const { firstName, lastName } = splitName(data.full_name);

    const payload = {
      locationId: process.env.GHL_LOCATION_ID,
      phone: data.phone,
      email: data.email,
      firstName,
      lastName,
      name: data.full_name,
      source: "Landing Citas EFA",
      tags: ["lead cita landing"],
      customFields: [
        {
          key: "ciudad_tatuaje",
          value: cityMap[data.city] || data.city || "",
        },
        {
          key: "idea_tatuaje",
          value: data.tattoo_idea || "",
        },
        {
          key: "zona_cuerpo",
          value: data.body_zone || "",
        },
        {
          key: "disponibilidad",
          value: data.availability || "",
        },
        {
          key: "informacion_adicional",
          value: data.additional_info || "",
        },
      ],
    };

    console.log("GHL Payload being sent:", JSON.stringify(payload, null, 2));

    const ghlResponse = await fetch(`${GHL_BASE_URL}/contacts/upsert/`, {
      method: "POST",
      headers: ghlHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(payload),
    });

    const responseText = await ghlResponse.text();
    console.log("GHL Response status:", ghlResponse.status);
    console.log("GHL Response body:", responseText);

    if (!ghlResponse.ok) {
      console.error("GHL Error:", ghlResponse.status, responseText);
      return res.status(ghlResponse.status).json({ ok: false, details: responseText });
    }

    const parsedResponse = parseJsonSafely(responseText);
    const contactId = extractContactId(parsedResponse);
    const imageAsset = await resolveImageAsset(data);
    let imageUploaded = false;
    let warning = null;

    if (imageAsset) {
      if (!contactId) {
        warning = "Contact created but image could not be attached because no contact id was returned by GHL.";
        console.warn(warning);
      } else {
        try {
          const imageUrl = await uploadImageToGhlStorage({
            contactId,
            locationId: process.env.GHL_LOCATION_ID,
            image: imageAsset,
          });
          await attachImageUrlToContact({ contactId, imageUrl });
          imageUploaded = true;
        } catch (uploadError) {
          warning = `Contact created but image upload failed: ${uploadError.message}`;
          console.error(warning);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      message: "Contact created/updated successfully",
      imageUploaded,
      warning,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ ok: false });
  }
};
