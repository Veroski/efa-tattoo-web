const { put } = require("@vercel/blob");

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB decoded limit

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { base64, filename, contentType } = data;

    if (!base64 || !filename || !contentType) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    if (!ALLOWED_TYPES.includes(contentType.toLowerCase())) {
      return res.status(400).json({ ok: false, error: "File type not allowed" });
    }

    const buffer = Buffer.from(base64, "base64");

    if (buffer.byteLength > MAX_BYTES) {
      return res.status(400).json({ ok: false, error: "File too large" });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const pathname = `tattoo-refs/${Date.now()}-${safeName}`;

    try {
      const blob = await put(pathname, buffer, {
        access: "public",
        contentType,
      });
      return res.status(200).json({ ok: true, url: blob.url });
    } catch (blobError) {
      console.error("Blob error:", blobError.message);
      // Fallback: return a data URL so the booking endpoint can upload the
      // original image directly into GHL's File Upload custom field.
      const dataUrl = `data:${contentType};base64,${base64}`;
      return res.status(200).json({ ok: true, url: dataUrl, fallback: true });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ ok: false, error: "Upload failed" });
  }
};
