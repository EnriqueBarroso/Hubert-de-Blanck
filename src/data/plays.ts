export interface Play {
  id: string;
  title: string;
  author: string;
  year?: number;
  description: string;
  image: string;
  category: "teatro" | "musical" | "contemporaneo";
  status?: "cartelera" | "repertorio";
  date?: string;
  time?: string;
  venue?: string;
  availability?: "disponible" | "pocas-entradas" | "agotado";
}

export const plays: Play[] = [
  {
    id: "romeo-julieta",
    title: "Romeo y Julieta",
    author: "William Shakespeare",
    description: "Una adaptación contemporánea del clásico de William Shakespeare que explora el amor imposible en tiempos modernos.",
    image: "/assets/plays/romeo.jpg",
    category: "teatro",
    status: "cartelera",
    date: "Sábado 20 de Septiembre",
    time: "20:00",
    venue: "Teatro Principal",
    availability: "disponible"
  },
  {
    id: "gallo-electronico",
    title: "El Gallo Electrónico",
    author: "Juan Carlos",
    year: 2017,
    description: "Una obra innovadora que fusiona la tradición teatral con la tecnología moderna, explorando temas de identidad y transformación.",
    image: "/assets/plays/gallo.jpg",
    category: "contemporaneo",
    status: "cartelera",
    date: "Domingo 21 de Septiembre",
    time: "19:00",
    venue: "Sala Experimental",
    availability: "pocas-entradas"
  },
  {
    id: "fuenteovejuna",
    title: "Fuenteovejuna",
    author: "Lope de Vega",
    description: "La obra maestra de Lope de Vega sobre la rebelión popular y la justicia social, presentada con una puesta en escena minimalista que resalta la fuerza del texto.",
    image: "/assets/plays/fuenteovejuna.jpg",
    category: "teatro",
    status: "cartelera",
    date: "Domingo 21 de Diciembre",
    time: "19:00",
    venue: "Sala Experimental",
    availability: "pocas-entradas"
  },
  {
    id: "don-juan-tenorio",
    title: "Don Juan Tenorio",
    author: "José Zorrilla",
    year: 2010,
    description: "Una adaptación contemporánea del clásico de Zorrilla que mantiene la esencia del personaje mientras lo sitúa en contextos actuales.",
    image: "/assets/plays/donjuan.jpg",
    category: "teatro",
    status: "repertorio"
  },
  {
    id: "la-ronda",
    title: "La Ronda",
    author: "Federico García Lorca",
    year: 2015,
    description: "La poesía de Lorca cobra vida en esta versión escénica que explora los ritmos y símbolos de su obra más lírica.",
    image: "/assets/plays/laronda.jpg",
    category: "teatro",
    status: "repertorio"
  },
  {
    id: "cartero-neruda",
    title: "El Cartero de Neruda",
    author: "Antonio Skármeta",
    year: 2013,
    description: "Una reinterpretación contemporánea que narra la amistad entre el poeta Pablo Neruda y un cartero, explorando el poder transformador de la poesía.",
    image: "/assets/plays/cartero.jpg",
    category: "teatro",
    status: "repertorio"
  },
  {
    id: "quien-compra-pueblo",
    title: "¿Quién quiere Comprar un Pueblo?",
    author: "Juan Rubio",
    year: 2017,
    description: "Comedia contemporánea que reflexiona sobre la identidad rural y los cambios sociales en la España actual.",
    image: "/assets/plays/pueblo.jpg",
    category: "contemporaneo",
    status: "repertorio"
  },
  {
    id: "arizona",
    title: "Arizona",
    author: "Juan Carlos Rubio",
    year: 2010,
    description: "Drama contemporáneo que explora las relaciones humanas en contextos extremos, con una puesta en escena intimista.",
    image: "/assets/plays/arizona.jpg",
    category: "contemporaneo",
    status: "repertorio"
  }
];
