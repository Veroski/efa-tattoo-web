function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: ".", lastName: "." };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "." };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
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

    const experienceMap = {
      menos_6_meses: "Menos de 6 meses",
      "6_12_meses": "6–12 meses",
      mas_1_año: "+1 año",
    };

    const difficultyMap = {
      trazo_limpio: "Trazo limpio",
      curacion_durabilidad: "Curación / durabilidad",
      seguridad_confianza: "Seguridad y confianza",
      conseguir_clientes: "Conseguir clientes",
    };

    const weekendMap = {
      si: "Sí",
      no: "No",
    };

    const budgetMap = {
      menos_1000: "Menos de 1.000€",
      "1000_1500": "Entre 1.000€ y 1.500€",
      mas_1500: "Más de 1.500€",
    };

    const budgetFieldKey =
      process.env.GHL_CONTACT_E_MONEY_GROUP_FIELD_KEY || "e_money_group";

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
        source: "Landing Seminario EFA",
        tags: ["lead seminario landing"],
        customFields: [
          {
            key: "tattoo_experience",
            value: experienceMap[data.tattoo_experience] || data.tattoo_experience,
          },
          {
            key: "main_difficulty",
            value: difficultyMap[data.main_difficulty] || data.main_difficulty,
          },
          {
            key: "main_goal",
            value: data.main_goal,
          },
          {
            key: "can_attend_weekend",
            value: weekendMap[data.can_attend_weekend] || data.can_attend_weekend,
          },
          {
            key: budgetFieldKey,
            value: budgetMap[data.budget_range] || data.budget_range,
          },
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
