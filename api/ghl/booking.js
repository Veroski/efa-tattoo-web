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

    const ghlResponse = await fetch("https://services.leadconnectorhq.com/contacts/upsert/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHL_PRIVATE_KEY}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
          ...(data.tattoo_img_url
            ? [{ key: "tattoo_img", value: data.tattoo_img_url }]
            : []),
        ],
      }),
    });

    const responseText = await ghlResponse.text();

    if (!ghlResponse.ok) {
      console.error("GHL Error:", ghlResponse.status, responseText);
      return res.status(ghlResponse.status).json({ ok: false, details: responseText });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ ok: false });
  }
};
