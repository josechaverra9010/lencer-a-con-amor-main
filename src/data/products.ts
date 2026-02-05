import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Conjunto Encaje Noir",
    description: "Elegante conjunto de encaje francés con detalles bordados a mano. Perfecto para ocasiones especiales, combina sofisticación y sensualidad.",
    price: 89.99,
    originalPrice: 129.99,
    images: [product1, product2, product3, product4],
    category: "Conjuntos",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#1a1a1a" },
      { name: "Rosa", value: "#d4a5a5" },
      { name: "Vino", value: "#722f37" },
    ],
    isNew: true,
    isSale: true,
    features: [
      "Encaje francés premium",
      "Bordado artesanal",
      "Copa con varilla",
      "Braguita con cierre lateral",
    ],
  },
  {
    id: 2,
    name: "Bralette Satén Rose",
    description: "Bralette de satén con tirantes ajustables y escote profundo. Comodidad y elegancia para el día a día.",
    price: 45.99,
    images: [product2, product1, product3, product4],
    category: "Bralettes",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Rosa", value: "#d4a5a5" },
      { name: "Champagne", value: "#f7e7ce" },
      { name: "Negro", value: "#1a1a1a" },
    ],
    isNew: true,
    features: [
      "Satén de alta calidad",
      "Tirantes ajustables",
      "Sin varilla para mayor comodidad",
      "Cierre trasero",
    ],
  },
  {
    id: 3,
    name: "Body Midnight Velvet",
    description: "Body de terciopelo con espalda descubierta y detalles de encaje. Una pieza statement para noches especiales.",
    price: 79.99,
    originalPrice: 99.99,
    images: [product3, product1, product2, product4],
    category: "Bodies",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#1a1a1a" },
      { name: "Burdeos", value: "#800020" },
    ],
    isSale: true,
    features: [
      "Terciopelo italiano",
      "Espalda descubierta",
      "Cierre snap",
      "Tirantes removibles",
    ],
  },
  {
    id: 4,
    name: "Kimono Seda Blush",
    description: "Kimono de seda natural con estampado floral exclusivo. La pieza perfecta para completar tu look de boudoir.",
    price: 120.00,
    images: [product4, product1, product2, product3],
    category: "Kimonos",
    sizes: ["S/M", "L/XL"],
    colors: [
      { name: "Blush", value: "#f5e1da" },
      { name: "Ivory", value: "#fffff0" },
    ],
    features: [
      "100% seda natural",
      "Estampado exclusivo",
      "Cinturón a juego",
      "Largo midi",
    ],
  },
  {
    id: 5,
    name: "Sujetador Push-Up Luna",
    description: "Sujetador push-up con relleno extraíble y cierre frontal. Realza tu figura con elegancia.",
    price: 55.99,
    images: [product1, product3, product2, product4],
    category: "Brasiers",
    sizes: ["32B", "34B", "34C", "36B", "36C", "38C"],
    colors: [
      { name: "Nude", value: "#e3c9a8" },
      { name: "Negro", value: "#1a1a1a" },
      { name: "Rosa", value: "#d4a5a5" },
    ],
    features: [
      "Relleno extraíble",
      "Cierre frontal",
      "Tirantes acolchados",
      "Espalda en U",
    ],
  },
  {
    id: 6,
    name: "Tanga Encaje Parisienne",
    description: "Tanga de encaje con cintura alta y diseño cómodo para uso diario sin marcar.",
    price: 25.99,
    images: [product2, product4, product1, product3],
    category: "Panties",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#1a1a1a" },
      { name: "Blanco", value: "#ffffff" },
      { name: "Rosa", value: "#d4a5a5" },
      { name: "Rojo", value: "#c41e3a" },
    ],
    isNew: true,
    features: [
      "Encaje elástico",
      "Cintura alta",
      "Sin costuras visibles",
      "Algodón en entrepierna",
    ],
  },
  {
    id: 7,
    name: "Babydoll Romántico",
    description: "Babydoll de tul con aplicaciones de encaje y lazo de satén. Romántico y femenino.",
    price: 65.99,
    originalPrice: 85.99,
    images: [product3, product2, product4, product1],
    category: "Babydolls",
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Rosa", value: "#ffb6c1" },
      { name: "Negro", value: "#1a1a1a" },
      { name: "Lavanda", value: "#e6e6fa" },
    ],
    isSale: true,
    features: [
      "Tul suave",
      "Encaje en busto",
      "Incluye tanga a juego",
      "Lazo decorativo",
    ],
  },
  {
    id: 8,
    name: "Corsé Vintage Glamour",
    description: "Corsé con ballenas flexibles y cierre de corchetes. Esculpe tu silueta con estilo retro.",
    price: 95.99,
    images: [product4, product3, product1, product2],
    category: "Corsets",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Negro", value: "#1a1a1a" },
      { name: "Rojo", value: "#8b0000" },
    ],
    features: [
      "Ballenas flexibles",
      "Cierre de corchetes",
      "Copas con varilla",
      "Detalle de encaje superior",
    ],
  },
];

export const categories = [
  "Todos",
  "Conjuntos",
  "Bralettes",
  "Bodies",
  "Kimonos",
  "Brasiers",
  "Panties",
  "Babydolls",
  "Corsets",
];

export const colorFilters = [
  { name: "Negro", value: "#1a1a1a" },
  { name: "Rosa", value: "#d4a5a5" },
  { name: "Rojo", value: "#c41e3a" },
  { name: "Blanco", value: "#ffffff" },
  { name: "Nude", value: "#e3c9a8" },
];
