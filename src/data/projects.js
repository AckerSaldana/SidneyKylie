/**
 * Centralized project data
 * Single source of truth for all project information
 */

export const projects = [
  {
    id: 1,
    number: "01",
    title: "Casa Terra 027",
    category: "Residencial",
    location: "Corregidora, Querétaro",
    year: "2024",
    size: "560 m²",
    image: "/projects/casa-1/photos/photo-6.png",
    description: "Residencia sustentable con diseño flexible y enfoque climático.",
    // Full detail data
    client: "Privado",
    status: "Construido",
    area: "560 m²",
    fullDescription: "Residencia unifamiliar diseñada para una familia multigeneracional, ubicada en Corregidora, Querétaro. El diseño responde a un terreno de forma irregular y a las condiciones normativas locales, integrando estrategias sustentables que consideran el clima cambiante de la región. La vivienda favorece la ventilación natural cruzada, el confort térmico y la iluminación pasiva a través de patios interiores, celosías y volúmenes abiertos que permiten una conexión fluida entre espacios.",
    concept: "El proyecto se concibe como una secuencia de espacios interconectados que integran elementos de la arquitectura vernácula y estrategias contemporáneas. Mediante el uso de tierra apisonada, concreto aparente y madera local, se crea una atmósfera cálida, flexible y funcional. Los volúmenes se disponen en torno a patios que ofrecen privacidad, regulación climática y conexión visual con el entorno natural, generando una experiencia doméstica sensible y adaptada a las necesidades de cada miembro de la familia.",
    mainImage: "/projects/casa-1/photos/photo-6.png",
    renders: [
      { url: "/projects/casa-1/renders/render-4.png", caption: "Fachada noreste" },
      { url: "/projects/casa-1/renders/render-1.png", caption: "Fachada suroeste" },
      { url: "/projects/casa-1/renders/render-3.png", caption: "Corte longitudinal B-B' 3D" },
      { url: "/projects/casa-1/renders/render-2.png", caption: "Corte longitudinal A-A' 3D" }
    ],
    photos: [
      { url: "/projects/casa-1/photos/photo-1.png", caption: "Cocina - Barra" },
      { url: "/projects/casa-1/photos/photo-2.png", caption: "Sala de estar" },
      { url: "/projects/casa-1/photos/photo-3.png", caption: "Recamara principal" },
      { url: "/projects/casa-1/photos/photo-4.png", caption: "Asador con barra exterior" },
      { url: "/projects/casa-1/photos/photo-5.png", caption: "Comedor" },
      { url: "/projects/casa-1/photos/photo-6.png", caption: "Area social" },
      { url: "/projects/casa-1/photos/photo-7.png", caption: "Fachada principal" },
      { url: "/projects/casa-1/photos/photo-8.png", caption: "Jardin interior" },
      { url: "/projects/casa-1/photos/photo-9.png", caption: "Vista a jardin interior" }
    ],
    plans: [
      { url: "/projects/casa-1/plans/plan-1.png", caption: "Planta de conjunto" },
      { url: "/projects/casa-1/plans/plan-2.png", caption: "Planta baja" },
      { url: "/projects/casa-1/plans/plan-3.png", caption: "Planta alta" }
    ],
    specs: [
      "Estructura de concreto armado y acero",
      "Muros de block con aplanado de mortero",
      "Cancelería de aluminio con doble acristalamiento",
      "Pisos de mármol y madera de ingeniería",
      "Sistema de climatización VRF",
      "Iluminación LED automatizada",
      "Paneles solares 10kW"
    ]
  },
  {
    id: 2,
    number: "02",
    title: "Torre Corporativa Sky",
    category: "Comercial",
    location: "Monterrey, Nuevo León",
    year: "2023",
    size: "2,400 m²",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "Espacio corporativo con diseño biofílico y certificación LEED.",
    // Full detail data
    client: "Grupo Inmobiliario Norte",
    status: "En construcción",
    area: "2,400 m²",
    fullDescription: "Torre de oficinas de 12 niveles que integra principios de diseño biofílico para crear ambientes de trabajo saludables y productivos. El edificio incorpora jardines verticales, iluminación natural optimizada y espacios de colaboración que fomentan el bienestar de los ocupantes mientras reducen el consumo energético.",
    concept: "La torre se diseña como un ecosistema vertical donde la naturaleza y la arquitectura coexisten. Cada piso cuenta con acceso a terrazas ajardinadas, y la fachada incorpora elementos de sombreado pasivo que responden a la orientación solar. El resultado es un edificio que respira, se adapta y promueve la conexión entre las personas y su entorno.",
    mainImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    renders: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", caption: "Vista aérea" },
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", caption: "Lobby principal" },
      { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", caption: "Área de trabajo" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", caption: "Terraza verde" }
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", caption: "Recepción" },
      { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", caption: "Oficinas" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", caption: "Sala de juntas" }
    ],
    plans: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta tipo" },
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta baja" }
    ],
    specs: [
      "Estructura de acero con núcleo de concreto",
      "Fachada de vidrio de alto rendimiento",
      "Sistema de aire acondicionado con recuperación de calor",
      "Certificación LEED Gold en proceso",
      "Estacionamiento con cargadores eléctricos",
      "Sistema de recolección de agua pluvial"
    ]
  },
  {
    id: 3,
    number: "03",
    title: "Loft Industrial Reforma",
    category: "Residencial",
    location: "Guadalajara, Jalisco",
    year: "2023",
    size: "180 m²",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    description: "Conversión de bodega industrial a vivienda contemporánea.",
    // Full detail data
    client: "Privado",
    status: "Construido",
    area: "180 m²",
    fullDescription: "Transformación de una antigua bodega textil en un espacio residencial que celebra su herencia industrial. El proyecto conserva elementos originales como vigas de acero, muros de ladrillo y pisos de concreto pulido, integrándolos con intervenciones contemporáneas que respetan la memoria del lugar.",
    concept: "El diseño abraza la estética industrial mientras crea un hogar cálido y funcional. Los espacios fluyen sin interrupciones, con el área social como corazón del proyecto. La materialidad honesta del edificio original se complementa con mobiliario contemporáneo y vegetación interior que suaviza la dureza de los materiales.",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    renders: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", caption: "Vista general" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", caption: "Sala de estar" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", caption: "Cocina" },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", caption: "Recámara" }
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", caption: "Área social" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", caption: "Detalle estructural" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", caption: "Iluminación natural" }
    ],
    plans: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta arquitectónica" }
    ],
    specs: [
      "Estructura original de acero restaurada",
      "Muros de ladrillo aparente recuperado",
      "Pisos de concreto pulido",
      "Iluminación tipo industrial LED",
      "Sistema de calefacción radiante",
      "Ventanas de acero con doble vidrio"
    ]
  },
  {
    id: 4,
    number: "04",
    title: "Hotel Boutique Nómada",
    category: "Hospitalidad",
    location: "Playa del Carmen, Quintana Roo",
    year: "2023",
    size: "1,200 m²",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description: "Hotel boutique con diseño sustentable y conexión con la naturaleza.",
    // Full detail data
    client: "Nómada Hospitality Group",
    status: "Construido",
    area: "1,200 m²",
    fullDescription: "Hotel boutique de 15 habitaciones que redefine la hospitalidad en la Riviera Maya. El proyecto se integra sutilmente en la selva circundante, minimizando su huella ambiental mientras ofrece experiencias únicas de conexión con la naturaleza. Cada habitación es un refugio privado con vistas al jardín tropical.",
    concept: "El hotel se concibe como una serie de pabellones dispersos en la vegetación, conectados por senderos que invitan a la exploración. La arquitectura vernácula se reinterpreta con técnicas contemporáneas, utilizando materiales locales como piedra maya, madera de la región y palapa tradicional. El resultado es un santuario que respeta y celebra su entorno.",
    mainImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    renders: [
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", caption: "Vista exterior" },
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", caption: "Suite principal" },
      { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80", caption: "Área de alberca" },
      { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", caption: "Spa" }
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", caption: "Recepción" },
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", caption: "Habitación" },
      { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80", caption: "Restaurante" }
    ],
    plans: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta de conjunto" },
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta tipo habitación" }
    ],
    specs: [
      "Construcción con piedra maya local",
      "Techos de palapa tradicional",
      "Sistema de captación de agua pluvial",
      "Paneles solares para áreas comunes",
      "Tratamiento de aguas grises",
      "Mobiliario de artesanos locales"
    ]
  },
  {
    id: 5,
    number: "05",
    title: "Centro Cultural Artesano",
    category: "Cultural",
    location: "San Miguel de Allende, Guanajuato",
    year: "2022",
    size: "450 m²",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    description: "Espacio multifuncional para artistas y artesanos locales.",
    // Full detail data
    client: "Fundación Arte Vivo",
    status: "Construido",
    area: "450 m²",
    fullDescription: "Centro cultural que alberga talleres de artesanías, galería de exposiciones y espacios de capacitación para artistas locales. El edificio rehabilita una antigua casona colonial, respetando sus elementos patrimoniales mientras introduce intervenciones contemporáneas que amplían sus posibilidades de uso.",
    concept: "El proyecto busca ser un catalizador para la comunidad artística de San Miguel. Los espacios se diseñan con flexibilidad para adaptarse a diferentes actividades: desde talleres de cerámica hasta exposiciones de arte contemporáneo. La luz natural es protagonista, filtrándose a través de patios y tragaluces que revelan la belleza de los materiales tradicionales.",
    mainImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    renders: [
      { url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80", caption: "Patio central" },
      { url: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80", caption: "Galería" },
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", caption: "Taller de artesanías" },
      { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80", caption: "Sala de exposiciones" }
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80", caption: "Entrada principal" },
      { url: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80", caption: "Exposición" },
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", caption: "Taller" }
    ],
    plans: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta baja" },
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta alta" }
    ],
    specs: [
      "Restauración de muros de adobe originales",
      "Techos de viguería de madera recuperada",
      "Pisos de barro artesanal",
      "Sistema de iluminación museográfica",
      "Climatización pasiva con ventilación cruzada",
      "Accesibilidad universal"
    ]
  },
  {
    id: 6,
    number: "06",
    title: "Café Origen",
    category: "Comercial",
    location: "Puebla, Puebla",
    year: "2022",
    size: "120 m²",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80",
    description: "Cafetería con diseño vernáculo contemporáneo y materiales locales.",
    // Full detail data
    client: "Café Origen S.A.",
    status: "Construido",
    area: "120 m²",
    fullDescription: "Cafetería de especialidad que celebra la tradición cafetalera mexicana a través de su arquitectura. El espacio transforma un local comercial ordinario en un refugio sensorial donde el aroma del café se complementa con la calidez de los materiales naturales y la atención al detalle en cada elemento del diseño.",
    concept: "El diseño parte de la idea de revelar el proceso del café: desde la planta hasta la taza. Los materiales naturales como el barro, la madera y el cobre crean una atmósfera que evoca los paisajes cafetaleros de Veracruz y Chiapas. La barra de servicio se convierte en un escenario donde los baristas ejecutan su arte.",
    mainImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80",
    renders: [
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", caption: "Vista interior" },
      { url: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", caption: "Área de servicio" },
      { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", caption: "Detalle de barra" },
      { url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80", caption: "Terraza" }
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", caption: "Ambiente" },
      { url: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", caption: "Mobiliario" },
      { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", caption: "Detalles" }
    ],
    plans: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", caption: "Planta arquitectónica" }
    ],
    specs: [
      "Mobiliario de madera de parota local",
      "Barra de cobre martillado",
      "Pisos de mosaico artesanal poblano",
      "Iluminación cálida con lámparas de barro",
      "Sistema de extracción de olores",
      "Acústica tratada con paneles de corcho"
    ]
  }
];

/**
 * Get a project by its ID
 * @param {number|string} id - Project ID
 * @returns {Object|undefined} Project data
 */
export const getProjectById = (id) => {
  return projects.find(p => p.id === Number(id));
};

/**
 * Get preview data for project list (lighter payload)
 * @returns {Array} Array of project previews
 */
export const getProjectPreviews = () => {
  return projects.map(({
    id,
    number,
    title,
    category,
    location,
    year,
    size,
    image,
    description
  }) => ({
    id,
    number,
    title,
    category,
    location,
    year,
    size,
    image,
    description
  }));
};

/**
 * Get all project IDs
 * @returns {Array<number>} Array of project IDs
 */
export const getProjectIds = () => {
  return projects.map(p => p.id);
};

export default projects;
