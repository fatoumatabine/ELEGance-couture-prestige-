"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, ChevronDown, SlidersHorizontal } from "lucide-react"

interface ProductFiltersProps {
  onFilterChange?: (filters: unknown) => void
}

const colorSwatches: Record<string, string> = {
  Noir: "#1a1a1a",
  Blanc: "#fff8ed",
  Rouge: "#dc2626",
  Rose: "#ec4899",
  Bleu: "#2563eb",
  Nude: "#d4a98a",
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState("all")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [openSection, setOpenSection] = useState<string[]>(["sort", "prix", "taille", "couleur"])

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = Object.keys(colorSwatches)

  const toggleSection = (section: string) =>
    setOpenSection((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )

  const toggleColor = (color: string) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )

  const hasFilters = priceRange !== "all" || selectedSizes.length > 0 || selectedColors.length > 0

  const resetAll = () => {
    setPriceRange("all")
    setSelectedSizes([])
    setSelectedColors([])
  }

  const FilterSection = ({
    id,
    label,
    children,
  }: {
    id: string
    label: string
    children: React.ReactNode
  }) => {
    const isOpen = openSection.includes(id)
    return (
      <div className="border-b border-[#ead3aa]/70 last:border-b-0 dark:border-[#3b2717]">
        <button
          onClick={() => toggleSection(id)}
          className="group flex w-full items-center justify-between py-3 text-left"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#241609] transition-colors group-hover:text-[#B6771D] dark:text-[#fff8ed] dark:group-hover:text-[#FFCF71]">
            {label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#B6771D] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && <div className="pb-4">{children}</div>}
      </div>
    )
  }

  return (
    <div className="rounded-[8px] border border-[#ead3aa] bg-white/80 p-4 shadow-[0_18px_45px_rgba(123,84,47,0.08)] backdrop-blur-sm dark:border-[#3b2717] dark:bg-[#180f08]/80">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#fff1d4] text-[#B6771D] dark:bg-[#2b190d] dark:text-[#FFCF71]">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-foreground">Filtres</span>
            <span className="text-[10px] text-muted-foreground">Affiner la sélection</span>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={resetAll}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#ead3aa] text-[#B6771D] transition-colors hover:border-[#FF9D00] hover:bg-[#fff6e6] dark:border-[#3b2717] dark:hover:bg-[#2b190d]"
            aria-label="Effacer les filtres"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      <FilterSection id="sort" label="Trier par">
        <Select defaultValue="featured">
          <SelectTrigger className="h-9 rounded-[6px] border-[#ead3aa] bg-white text-[11px] tracking-wide dark:border-[#3b2717] dark:bg-[#211207]">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent className="rounded-[6px]">
            <SelectItem value="featured">En vedette</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="newest">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection id="prix" label="Budget">
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="h-9 rounded-[6px] border-[#ead3aa] bg-white text-[11px] tracking-wide dark:border-[#3b2717] dark:bg-[#211207]">
            <SelectValue placeholder="Tous les prix" />
          </SelectTrigger>
          <SelectContent className="rounded-[6px]">
            <SelectItem value="all">Tous les prix</SelectItem>
            <SelectItem value="0-15000">Moins de 15 000 FCFA</SelectItem>
            <SelectItem value="15000-30000">15 000 – 30 000 FCFA</SelectItem>
            <SelectItem value="30000-50000">30 000 – 50 000 FCFA</SelectItem>
            <SelectItem value="50000+">Plus de 50 000 FCFA</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection id="taille" label="Taille">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-8 min-w-8 rounded-[6px] border px-2 text-[10px] font-bold tracking-wide transition-all duration-200 ${
                selectedSizes.includes(size)
                  ? "border-[#FF9D00] bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] text-[#180f08]"
                  : "border-[#ead3aa] bg-white text-foreground hover:border-[#FF9D00] hover:text-[#B6771D] dark:border-[#3b2717] dark:bg-[#211207] dark:hover:text-[#FFCF71]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection id="couleur" label="Couleur">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              title={color}
              className={`relative h-7 w-7 rounded-full border-2 transition-all duration-200 ${
                selectedColors.includes(color)
                  ? "scale-110 border-[#FF9D00] shadow-sm"
                  : "border-[#fff8ed] hover:border-[#FF9D00]/60 hover:scale-105 dark:border-[#211207]"
              }`}
              style={{ backgroundColor: colorSwatches[color] }}
            >
              {selectedColors.includes(color) && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
