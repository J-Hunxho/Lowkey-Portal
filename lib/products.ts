export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: string
  image?: string
}

export const PRODUCTS: Product[] = [
  {
    id: "vip-concierge-annual",
    name: "VIP Concierge Annual",
    description: "Full-year access to dedicated concierge services for luxury experiences",
    priceInCents: 999900, // $9,999
    category: "Services",
    image: "/images/products/vip-concierge-annual.jpg",
  },
  {
    id: "private-jet-charter",
    name: "Private Jet Charter",
    description: "One-time charter for up to 8 passengers on a luxury private jet",
    priceInCents: 4999900, // $49,999
    category: "Travel",
    image: "/images/products/private-jet-charter.jpg",
  },
  {
    id: "exclusive-wine-collection",
    name: "Exclusive Wine Collection",
    description: "Curated selection of rare vintage wines from exclusive vineyards",
    priceInCents: 24999, // $249.99
    category: "Luxury Goods",
    image: "/images/products/exclusive-wine-collection.jpg",
  },
  {
    id: "spa-wellness-retreat",
    name: "Spa & Wellness Retreat",
    description: "5-day luxury spa and wellness retreat at an exclusive resort",
    priceInCents: 1999900, // $19,999
    category: "Wellness",
    image: "/images/products/spa-wellness-retreat.jpg",
  },
  {
    id: "fine-art-collection",
    name: "Fine Art Collection",
    description: "Limited edition contemporary art pieces from renowned artists",
    priceInCents: 2499900, // $24,999
    category: "Art",
    image: "/images/products/fine-art-collection.jpg",
  },
  {
    id: "luxury-timepiece",
    name: "Luxury Timepiece",
    description: "Exclusive handcrafted luxury watch with Swiss movement",
    priceInCents: 4999900, // $49,999
    category: "Jewelry",
    image: "/images/products/luxury-timepiece.jpg",
  },
]
