"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  onFilterChange?: (filters: unknown) => void
}

const colorSwatches: Record<string, string> = {
  Noir: "#1a1a1a",
  Blanc: "#f5f0e8",
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
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 text-left group"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-foreground group-hover:text-[#C9A96E] transition-colors">
            {label}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && <div className="pb-5">{children}</div>}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#C9A96E]" />
          <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground">Filtres</span>
        </div>
        {hasFilters && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-[#C9A96E] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Effacer
          </button>
        )}
      </div>

      <FilterSection id="sort" label="Trier par">
        <Select defaultValue="featured">
          <SelectTrigger className="border-border text-[11px] tracking-wide h-9 rounded-none">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="featured">En vedette</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="newest">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection id="prix" label="Budget">
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="border-border text-[11px] tracking-wide h-9 rounded-none">
            <SelectValue placeholder="Tous les prix" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
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
              className={`w-9 h-9 text-[11px] font-medium tracking-wide border transition-all duration-200 ${
                selectedSizes.includes(size)
                  ? "border-[#C9A96E] bg-[#C9A96E] text-white"
                  : "border-border text-foreground hover:border-[#C9A96E] hover:text-[#C9A96E]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection id="couleur" label="Couleur">
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              title={color}
              className={`relative w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                selectedColors.includes(color)
                  ? "border-[#C9A96E] scale-110 shadow-sm"
                  : "border-transparent hover:border-[#C9A96E]/50 hover:scale-105"
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
