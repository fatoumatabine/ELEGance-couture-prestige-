export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  sizes?: string[]
  colors?: string[]
  inStock: boolean
}

// Note: This file is kept for type definitions but data is now managed by Prisma
export const products: Product[] = []

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}
