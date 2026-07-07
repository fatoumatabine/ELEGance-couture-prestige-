export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  gender?: string | null
  collection?: string | null
  subcategory?: string | null
  images: string[]
  sizes?: string[]
  colors?: string[]
  rating?: number | null
  reviewCount?: number | null
  inStock: boolean
}

export type ProductSellingMode = "clothing" | "shoe" | "fabric" | "fragrance" | "accessory"

type ProductModeSource = Partial<Pick<Product, "name" | "category" | "gender" | "collection" | "subcategory">>

const normalizeProductSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

const hasProductKeyword = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword))

export function getProductSellingMode(product: ProductModeSource): ProductSellingMode {
  const searchable = normalizeProductSearch(
    [product.name, product.category, product.gender, product.collection, product.subcategory]
      .filter(Boolean)
      .join(" "),
  )

  if (hasProductKeyword(searchable, ["chauss", "shoe", "sneaker", "basket", "sandale", "mule", "babouche"])) {
    return "shoe"
  }

  if (hasProductKeyword(searchable, ["tissu", "pagne", "wax", "bazin", "metre", "meter", "dentelle", "brode", "soie", "voile"])) {
    return "fabric"
  }

  if (hasProductKeyword(searchable, ["parfum", "fragrance", "oud", "musc", "ambre"])) {
    return "fragrance"
  }

  if (hasProductKeyword(searchable, ["accessoire", "accessory", "sac", "bijou", "montre", "ceinture"])) {
    return "accessory"
  }

  return "clothing"
}

export function getProductOptionLabels(product: ProductModeSource) {
  const mode = getProductSellingMode(product)

  if (mode === "shoe") {
    return {
      mode,
      optionLabel: "Pointure",
      quantityLabel: "Quantité",
      priceSuffix: "",
      showSizeGuide: false,
    }
  }

  if (mode === "fabric") {
    return {
      mode,
      optionLabel: "Longueur",
      quantityLabel: "Mètres",
      priceSuffix: "/ m",
      showSizeGuide: false,
    }
  }

  if (mode === "fragrance") {
    return {
      mode,
      optionLabel: "Contenance",
      quantityLabel: "Quantité",
      priceSuffix: "",
      showSizeGuide: false,
    }
  }

  if (mode === "accessory") {
    return {
      mode,
      optionLabel: "Option",
      quantityLabel: "Quantité",
      priceSuffix: "",
      showSizeGuide: false,
    }
  }

  return {
    mode,
    optionLabel: "Taille",
    quantityLabel: "Quantité",
    priceSuffix: "",
    showSizeGuide: true,
  }
}

// Note: This file is kept for type definitions but data is now managed by Prisma
export const products: Product[] = []

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}
