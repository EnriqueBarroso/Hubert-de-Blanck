export interface Actor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const actors: Actor[] = [
  {
    id: "laura-delgado",
    name: "Laura Delgado",
    role: "Actriz Principal",
    bio: "Protagonista en múltiples producciones clásicas y contemporáneas. Con una carrera de más de 15 años en el teatro, Laura se ha destacado por su versatilidad y profundidad interpretativa en roles complejos.",
    image: "/assets/actors/laura-delgado.jpg"
  },
  {
    id: "daniel-oliver",
    name: "Daniel Oliver",
    role: "Actor Principal",
    bio: "Veterano intérprete conocido por sus roles en obras de Shakespeare y Lorca. Su presencia escénica y dominio técnico lo han convertido en uno de los pilares fundamentales de la compañía.",
    image: "/assets/actors/daniel-oliver.jpg"
  },
  {
    id: "orietta-medina",
    name: "Orietta Medina",
    role: "Actriz y Directora Artística",
    bio: "Destacada por su versatilidad en géneros dramáticos y su pasión por el teatro de vanguardia. Como directora artística, ha liderado la renovación del repertorio manteniendo la excelencia interpretativa.",
    image: "/assets/actors/orietta-medina.jpg"
  },
  {
    id: "faustino-perez",
    name: "Faustino Perez",
    role: "Actor de Carácter",
    bio: "Maestro de la interpretación, conocido por dar vida a los personajes más complejos del repertorio clásico. Su capacidad para transformarse completamente en cada papel lo ha convertido en una leyenda viva del teatro.",
    image: "/assets/actors/faustino-perez.jpg"
  },
  {
    id: "enrique-barroso",
    name: "Enrique Barroso",
    role: "Actor Versátil",
    bio: "Intérprete polivalente con formación en teatro, danza y canto, especializado en musicales. Su energía y carisma en escena han conquistado al público en producciones de diversos géneros.",
    image: "/assets/actors/enrique-barroso.jpg"
  }
];
