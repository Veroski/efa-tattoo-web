export interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  count: number;
  images: string[];
}

function generateImages(
  folder: string,
  prefix: string,
  max: number,
  missing: number[],
): string[] {
  const skip = new Set(missing);
  const images: string[] = [];
  for (let i = 1; i <= max; i++) {
    if (!skip.has(i)) {
      images.push(`/img/${encodeURIComponent(folder)}/${prefix}_${i}.webp`);
    }
  }
  return images;
}

export const categories: GalleryCategory[] = [
  {
    id: "linea-fina",
    title: "Línea Fina",
    description:
      "Trazos delicados y precisos que capturan la esencia del diseño minimalista",
    count: 165,
    images: generateImages("Linea Fina", "linea_fina", 166, [5]),
  },
  {
    id: "microrealismo",
    title: "Microrealismo",
    description:
      "Detalles hiperrealistas en escala reducida, donde cada poro respira vida",
    count: 107,
    images: generateImages("Microrealismo", "microrealismo", 113, [
      4, 62, 67, 70, 101, 112,
    ]),
  },
  {
    id: "proyectos-grandes",
    title: "Proyectos Grandes",
    description:
      "Composiciones de gran formato que transforman el cuerpo en lienzo",
    count: 103,
    images: generateImages("Proyectos grandes", "proyectos_grandes", 106, [
      15, 53, 70,
    ]),
  },
  {
    id: "retratos-animales",
    title: "Retratos Animales",
    description:
      "Microrealismo aplicado a la fauna, capturando la mirada y el alma animal",
    count: 25,
    images: generateImages(
      "Retratos animales microrealismo",
      "retratos_animales_microrealismo",
      25,
      [],
    ),
  },
];
