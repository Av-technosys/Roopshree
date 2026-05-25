"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react"

const filterGroups = [
  {
    title: "Category",
    items: [
      "Bandhej Dupattas",
      "Gotta Patti Dupattas",
      "Zardozi Work Dupattas",
      "Jaal Pattern Dupattas",
      "Brooch/Odana Style Dupattas",
      "Shrugs",
      "Plain Fabric Sarees",
      "Pure Gajji Silk Sarees",
    ],
    defaultSelected: ["Shrugs"],
  },
  {
    title: "Fabric",
    items: ["Silk", "Cotton", "Gaji Silk", "Chiffon", "Georgette"],
  },
  {
    title: "Size",
    items: ["Free Size", "5.5 Mtr", "6.0 Mtr", "6.5 Mtr", "Custom Stitch"],
  },
  {
    title: "Availability",
    items: ["In Stock", "Out Stock"],
  },
]

const colors = [
  "#ff1f17",
  "#f1a719",
  "#11a84a",
  "#132f7a",
  "#111111",
  "#5d26b7",
  "#f45c9c",
]

const pricePresets = [
  { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
  { label: "₹7,000 - ₹10,000", min: 7000, max: 10000 },
  { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
]

const minPrice = 1000
const maxPrice = 25000
const defaultPriceRange = { min: 2500, max: 5500 }

export default function ShopFilters() {
  const filterState = useShopFilterState()

  return (
    <aside className="hidden lg:block">
      <FilterPanel {...filterState} />
    </aside>
  )
}

export function ShopMobileFilters() {
  const filterState = useShopFilterState()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-[#111]"
      >
        <SlidersHorizontal className="size-4 text-[#111]" />
        Filters
      </button>

      {isOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/50">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <div className="relative h-full w-[min(320px,calc(100vw-56px))] bg-[#fff8ee] shadow-2xl shadow-black/25">
            <FilterPanel {...filterState} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function useShopFilterState() {
  const defaultSelected = useMemo(() => {
    return new Set(
      filterGroups.flatMap((group) => group.defaultSelected ?? [])
    )
  }, [])

  const [selectedFilters, setSelectedFilters] = useState(defaultSelected)
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set())
  const [priceRange, setPriceRange] = useState(defaultPriceRange)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  function toggleFilter(item: string) {
    setSelectedFilters((current) => {
      const next = new Set(current)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
    setApplied(false)
  }

  function toggleColor(color: string) {
    setSelectedColors((current) => {
      const next = new Set(current)
      if (next.has(color)) {
        next.delete(color)
      } else {
        next.add(color)
      }
      return next
    })
    setApplied(false)
  }

  function updateMin(value: number) {
    setSelectedPreset(null)
    setApplied(false)
    setPriceRange((current) => ({
      min: Math.min(value, current.max - 500),
      max: current.max,
    }))
  }

  function updateMax(value: number) {
    setSelectedPreset(null)
    setApplied(false)
    setPriceRange((current) => ({
      min: current.min,
      max: Math.max(value, current.min + 500),
    }))
  }

  function choosePreset(preset: (typeof pricePresets)[number]) {
    setPriceRange({ min: preset.min, max: preset.max })
    setSelectedPreset(preset.label)
    setApplied(false)
  }

  function clearAll() {
    setSelectedFilters(new Set())
    setSelectedColors(new Set())
    setPriceRange(defaultPriceRange)
    setSelectedPreset(null)
    setApplied(false)
  }

  return {
    selectedFilters,
    selectedColors,
    priceRange,
    selectedPreset,
    onToggleFilter: toggleFilter,
    onToggleColor: toggleColor,
    onUpdateMin: updateMin,
    onUpdateMax: updateMax,
    onChoosePreset: choosePreset,
    onClearAll: clearAll,
    applied,
    onApply: () => setApplied(true),
  }
}

function FilterPanel({
  selectedFilters,
  selectedColors,
  priceRange,
  selectedPreset,
  onToggleFilter,
  onToggleColor,
  onUpdateMin,
  onUpdateMax,
  onChoosePreset,
  onClearAll,
  applied,
  onApply,
  onClose,
}: {
  selectedFilters: Set<string>
  selectedColors: Set<string>
  priceRange: { min: number; max: number }
  selectedPreset: string | null
  onToggleFilter: (item: string) => void
  onToggleColor: (color: string) => void
  onUpdateMin: (value: number) => void
  onUpdateMax: (value: number) => void
  onChoosePreset: (preset: (typeof pricePresets)[number]) => void
  onClearAll: () => void
  applied: boolean
  onApply: () => void
  onClose?: () => void
}) {
  return (
    <div className="h-full overflow-y-auto border-r border-[#d8a15a] bg-[#fff8ee] p-4 text-[#3F2617] lg:h-auto lg:overflow-visible lg:border lg:border-[#d8a15a]">
      <div className="mb-4 flex items-center justify-between border-b border-[#ead0ad] pb-4">
        <h2 className="text-xl font-medium text-[#c39150]">Filters</h2>
        {onClose ? (
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="flex size-7 items-center justify-center text-[#c39150]"
          >
            <X className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[10px] text-[#c39150] underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filterGroups.slice(0, 1).map((group) => (
          <FilterGroup
            key={group.title}
            {...group}
            selectedFilters={selectedFilters}
            onToggleFilter={onToggleFilter}
          />
        ))}

        <div>
          <FilterHeading title="Colour" />
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = selectedColors.has(color)
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Filter by ${color}`}
                  onClick={() => onToggleColor(color)}
                  className={`flex size-5 items-center justify-center rounded-full border transition ${
                    selected
                      ? "border-[#3F2617] ring-2 ring-[#c39150]/40"
                      : "border-black/10"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selected ? <Check className="size-3 text-white" /> : null}
                </button>
              )
            })}
          </div>
          <button type="button" className="mt-2 text-[11px] text-[#c39150]">
            + More
          </button>
        </div>

        {filterGroups.slice(1).map((group) => (
          <FilterGroup
            key={group.title}
            {...group}
            selectedFilters={selectedFilters}
            onToggleFilter={onToggleFilter}
          />
        ))}

        <div>
          <FilterHeading title="Price Range" />
          <div className="mt-3">
            <RangeSlider
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onUpdateMin={onUpdateMin}
              onUpdateMax={onUpdateMax}
            />
            <div className="mt-3 flex justify-between text-[11px] text-[#3F2617]">
              <span>₹{priceRange.min.toLocaleString("en-IN")}</span>
              <span>₹{priceRange.max.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChoosePreset(preset)}
                className={`h-7 w-full border text-[11px] transition ${
                  selectedPreset === preset.label
                    ? "border-[#c39150] bg-[#c39150] text-white"
                    : "border-[#d8a15a] bg-white text-[#3F2617]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onApply}
          className="h-8 w-full rounded-[2px] bg-[#c39150] text-xs font-medium text-white transition hover:bg-[#3F2617]"
        >
          {applied ? "Filters Applied" : "Apply Filters"}
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="h-8 w-full rounded-[2px] border border-[#d8a15a] bg-white text-xs text-[#c39150]"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  items,
  selectedFilters,
  onToggleFilter,
}: {
  title: string
  items: string[]
  defaultSelected?: string[]
  selectedFilters: Set<string>
  onToggleFilter: (item: string) => void
}) {
  return (
    <div>
      <FilterHeading title={title} />
      <div className="mt-2 space-y-1.5">
        {items.map((item) => {
          const checked = selectedFilters.has(item)
          return (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 text-[11px] leading-4 text-[#3F2617]/75"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleFilter(item)}
                className="sr-only"
              />
              <span
                className={`flex size-3 shrink-0 items-center justify-center border border-[#d8a15a] ${
                  checked ? "bg-[#c39150]" : "bg-white"
                }`}
              >
                {checked ? <Check className="size-2.5 text-white" /> : null}
              </span>
              {item}
            </label>
          )
        })}
      </div>
      {items.length > 4 ? (
        <button type="button" className="mt-2 text-[11px] text-[#c39150]">
          + More
        </button>
      ) : null}
    </div>
  )
}

function RangeSlider({
  min,
  max,
  value,
  onUpdateMin,
  onUpdateMax,
}: {
  min: number
  max: number
  value: { min: number; max: number }
  onUpdateMin: (value: number) => void
  onUpdateMax: (value: number) => void
}) {
  const minPercent = ((value.min - min) / (max - min)) * 100
  const maxPercent = ((value.max - min) / (max - min)) * 100

  return (
    <div className="relative h-5">
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#ead0ad]" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#c39150]"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={100}
        value={value.min}
        onChange={(event) => onUpdateMin(Number(event.target.value))}
        className="range-thumb pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={100}
        value={value.max}
        onChange={(event) => onUpdateMax(Number(event.target.value))}
        className="range-thumb pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent"
      />
    </div>
  )
}

function FilterHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[11px] font-semibold uppercase text-[#c39150]">
        {title}
      </h3>
      <ChevronDown className="size-3 text-[#c39150]" />
    </div>
  )
}
