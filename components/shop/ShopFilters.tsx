"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import type { getCatalogFilterOptions } from "@/services/product.service"

type FilterOptions = Awaited<ReturnType<typeof getCatalogFilterOptions>>
type FilterOption = { label: string; value: string }
type PriceRange = { min: number; max: number }

const defaultPriceBounds = { min: 0, max: 20000 }

export default function ShopFilters({ options }: { options: FilterOptions }) {
  const searchParams = useSearchParams()

  return (
    <aside className="hidden lg:block">
      <ShopFiltersPanel key={searchParams.toString()} options={options} />
    </aside>
  )
}

function ShopFiltersPanel({ options }: { options: FilterOptions }) {
  const filterState = useShopFilterState(options)

  return <FilterPanel {...filterState} options={options} />
}

export function ShopMobileFilters({ options }: { options: FilterOptions }) {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

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
            <ShopMobileFiltersPanel
              key={searchParams.toString()}
              options={options}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ShopMobileFiltersPanel({
  options,
  onClose,
}: {
  options: FilterOptions
  onClose: () => void
}) {
  const filterState = useShopFilterState(options)

  return <FilterPanel {...filterState} options={options} onClose={onClose} />
}

function getParamList(searchParams: URLSearchParams, key: string) {
  return (searchParams.get(key) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function getPriceRange(_options: FilterOptions): PriceRange {
  return defaultPriceBounds
}

function getInitialPriceRange(
  searchParams: URLSearchParams,
  bounds: PriceRange,
): PriceRange {
  const minParam = searchParams.get("minPrice")
  const maxParam = searchParams.get("maxPrice")
  const min = minParam === null ? Number.NaN : Number(minParam)
  const max = maxParam === null ? Number.NaN : Number(maxParam)

  return {
    min: Number.isFinite(min) ? Math.max(bounds.min, min) : bounds.min,
    max: Number.isFinite(max) ? Math.min(bounds.max, max) : bounds.max,
  }
}

function useShopFilterState(options: FilterOptions) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dbPriceRange = useMemo(() => getPriceRange(options), [options])
  const [selected, setSelected] = useState(() =>
    getSelectedFromSearchParams(searchParams, options),
  )
  const [priceRange, setPriceRange] = useState<PriceRange>(() =>
    getInitialPriceRange(searchParams, dbPriceRange),
  )

  function toggleSet(
    group: keyof Omit<typeof selected, "custom">,
    value: string,
  ) {
    setSelected((current) => {
      const nextGroup = new Set(current[group])
      if (nextGroup.has(value)) {
        nextGroup.delete(value)
      } else {
        nextGroup.add(value)
      }

      return { ...current, [group]: nextGroup }
    })
  }

  function toggleCustom(groupKey: string, value: string) {
    setSelected((current) => {
      const nextGroup = new Set(current.custom[groupKey] ?? [])
      if (nextGroup.has(value)) {
        nextGroup.delete(value)
      } else {
        nextGroup.add(value)
      }

      return {
        ...current,
        custom: { ...current.custom, [groupKey]: nextGroup },
      }
    })
  }

  function updatePriceRange(nextRange: PriceRange) {
    const requestedMin = Number.isFinite(nextRange.min)
      ? nextRange.min
      : dbPriceRange.min
    const requestedMax = Number.isFinite(nextRange.max)
      ? nextRange.max
      : dbPriceRange.max
    const nextMin = Math.max(
      dbPriceRange.min,
      Math.min(requestedMin, requestedMax),
    )
    const nextMax = Math.min(
      dbPriceRange.max,
      Math.max(requestedMax, requestedMin),
    )

    setPriceRange({
      min: nextMin,
      max: nextMax,
    })
  }

  function applyFilters(onApplied?: () => void) {
    const params = new URLSearchParams(searchParams.toString())

    setListParam(params, "category", selected.category)
    setListParam(params, "color", selected.color)
    setListParam(params, "fabric", selected.fabric)
    setListParam(params, "size", selected.size)
    setListParam(params, "availability", selected.availability)

    options.customGroups.forEach((group) => {
      setListParam(params, `filter_${group.paramKey}`, selected.custom[group.paramKey])
    })

    setPriceParam(params, "minPrice", priceRange.min, dbPriceRange.min)
    setPriceParam(params, "maxPrice", priceRange.max, dbPriceRange.max)
    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
    onApplied?.()
  }

  function clearAll(onCleared?: () => void) {
    const params = new URLSearchParams(searchParams.toString())

    ;[
      "category",
      "color",
      "fabric",
      "size",
      "availability",
      "minPrice",
      "maxPrice",
      "page",
    ].forEach((key) => params.delete(key))
    options.customGroups.forEach((group) => params.delete(`filter_${group.paramKey}`))

    setSelected({
      category: new Set(),
      color: new Set(),
      fabric: new Set(),
      size: new Set(),
      availability: new Set(),
      custom: Object.fromEntries(
        options.customGroups.map((group) => [group.paramKey, new Set<string>()]),
      ) as Record<string, Set<string>>,
    })
    setPriceRange(dbPriceRange)

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
    onCleared?.()
  }

  return {
    selected,
    priceRange,
    dbPriceRange,
    onToggle: toggleSet,
    onToggleCustom: toggleCustom,
    onUpdatePriceRange: updatePriceRange,
    onApply: applyFilters,
    onClearAll: clearAll,
  }
}

function getSelectedFromSearchParams(
  searchParams: URLSearchParams,
  options: FilterOptions,
) {
  return {
    category: new Set(getParamList(searchParams, "category")),
    color: new Set(getParamList(searchParams, "color")),
    fabric: new Set(getParamList(searchParams, "fabric")),
    size: new Set(getParamList(searchParams, "size")),
    availability: new Set(getParamList(searchParams, "availability")),
    custom: Object.fromEntries(
      options.customGroups.map((group) => [
        group.paramKey,
        new Set(getParamList(searchParams, `filter_${group.paramKey}`)),
      ]),
    ) as Record<string, Set<string>>,
  }
}

function setListParam(
  params: URLSearchParams,
  key: string,
  values: Set<string> | undefined,
) {
  const list = Array.from(values ?? [])

  if (list.length > 0) {
    params.set(key, list.join(","))
  } else {
    params.delete(key)
  }
}

function setPriceParam(
  params: URLSearchParams,
  key: string,
  value: number,
  defaultValue: number,
) {
  if (value !== defaultValue) {
    params.set(key, String(value))
  } else {
    params.delete(key)
  }
}

function FilterPanel({
  options,
  selected,
  priceRange,
  dbPriceRange,
  onToggle,
  onToggleCustom,
  onUpdatePriceRange,
  onApply,
  onClearAll,
  onClose,
}: {
  options: FilterOptions
  selected: {
    category: Set<string>
    color: Set<string>
    fabric: Set<string>
    size: Set<string>
    availability: Set<string>
    custom: Record<string, Set<string>>
  }
  priceRange: PriceRange
  dbPriceRange: PriceRange
  onToggle: (
    group: "category" | "color" | "fabric" | "size" | "availability",
    value: string,
  ) => void
  onToggleCustom: (groupKey: string, value: string) => void
  onUpdatePriceRange: (range: PriceRange) => void
  onApply: (onApplied?: () => void) => void
  onClearAll: (onCleared?: () => void) => void
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
            onClick={() => onClearAll()}
            className="text-[10px] text-[#c39150] underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        <FilterGroup
          title="Category"
          items={options.categories}
          selectedValues={selected.category}
          onToggle={(value) => onToggle("category", value)}
        />
        <ColorFilter
          items={options.colors}
          selectedValues={selected.color}
          onToggle={(value) => onToggle("color", value)}
        />
        <FilterGroup
          title="Fabric"
          items={options.fabrics}
          selectedValues={selected.fabric}
          onToggle={(value) => onToggle("fabric", value)}
        />
        <FilterGroup
          title="Size"
          items={options.sizes}
          selectedValues={selected.size}
          onToggle={(value) => onToggle("size", value)}
        />
        <FilterGroup
          title="Availability"
          items={options.availability}
          selectedValues={selected.availability}
          onToggle={(value) => onToggle("availability", value)}
        />
        {options.customGroups.map((group) => (
          <FilterGroup
            key={group.paramKey}
            title={group.title}
            items={group.items}
            selectedValues={selected.custom[group.paramKey] ?? new Set()}
            onToggle={(value) => onToggleCustom(group.paramKey, value)}
          />
        ))}

        <PriceFilter
          range={priceRange}
          bounds={dbPriceRange}
          onUpdate={onUpdatePriceRange}
        />

        <button
          type="button"
          onClick={() => onApply(onClose)}
          className="h-8 w-full rounded-[2px] bg-[#C39150] text-xs font-medium text-white transition hover:bg-[#3F2617]"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={() => onClearAll(onClose)}
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
  selectedValues,
  onToggle,
}: {
  title: string
  items: FilterOption[]
  selectedValues: Set<string>
  onToggle: (value: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div>
      <FilterHeading title={title} />
      <div className="mt-2 space-y-1.5">
        {items.map((item) => {
          const checked = selectedValues.has(item.value)

          return (
            <label
              key={item.value}
              className="flex cursor-pointer items-center gap-2 text-[11px] leading-4 text-[#3F2617]/75"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.value)}
                className="sr-only"
              />
              <span
                className={`flex size-3 shrink-0 items-center justify-center border border-[#d8a15a] ${
                  checked ? "bg-[#C39150]" : "bg-white"
                }`}
              >
                {checked ? <Check className="size-2.5 text-white" /> : null}
              </span>
              {item.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function ColorFilter({
  items,
  selectedValues,
  onToggle,
}: {
  items: FilterOption[]
  selectedValues: Set<string>
  onToggle: (value: string) => void
}) {
  if (items.length === 0) return null

  // Map custom color names to specific hex codes
  const COLOR_MAP: Record<string, string> = {
    red: "#E53935",
    rani: "#E71C80",
    "red orange": "#FF5349",
    green: "#4CAF50",
    purple: "#9C27B0",
    pink: "#FF69B4",
    maroon: "#800000",
    "yellow red": "#FF8C00",
  }

  // Only show colors that are defined in our map
  const validItems = items.filter((item) => item.value.toLowerCase() in COLOR_MAP)

  if (validItems.length === 0) return null

  return (
    <div>
      <FilterHeading title="Colour" />
      <div className="mt-2 flex flex-wrap gap-2">
        {validItems.map((item) => {
          const selected = selectedValues.has(item.value)
          
          const backgroundColor = COLOR_MAP[item.value.toLowerCase()]

          return (
            <button
              key={item.value}
              type="button"
              aria-label={`Filter by ${item.label}`}
              title={item.label}
              onClick={() => onToggle(item.value)}
              className={`flex size-5 items-center justify-center rounded-full border transition ${
                selected
                  ? "border-[#3F2617] ring-2 ring-[#c39150]/40"
                  : "border-black/10"
              }`}
              style={{ backgroundColor }}
            >
              {selected ? <Check className="size-3 text-white" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PriceFilter({
  range,
  bounds,
  onUpdate,
}: {
  range: PriceRange
  bounds: PriceRange
  onUpdate: (range: PriceRange) => void
}) {
  return (
    <div>
      <FilterHeading title="Price Range" />
      <div className="mt-3">
        <RangeSlider
          min={bounds.min}
          max={bounds.max}
          value={range}
          onUpdateMin={(min) => onUpdate({ ...range, min })}
          onUpdateMax={(max) => onUpdate({ ...range, max })}
        />
        <div className="mt-3 flex justify-between text-[11px] text-[#3F2617]">
          <span>₹{range.min.toLocaleString("en-IN")}</span>
          <span>₹{range.max.toLocaleString("en-IN")}</span>
        </div>
      </div>
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
  value: PriceRange
  onUpdateMin: (value: number) => void
  onUpdateMax: (value: number) => void
}) {
  const safeMax = Math.max(max, min + 100)
  const minPercent = ((value.min - min) / (safeMax - min)) * 100
  const maxPercent = ((value.max - min) / (safeMax - min)) * 100

  const thumbClasses = "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#C39150] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#C39150] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-20"

  return (
    <div className="relative h-5">
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#ead0ad]" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#C39150]"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={safeMax}
        step={100}
        value={value.min}
        onChange={(event) => onUpdateMin(Number(event.target.value))}
        className={`absolute inset-0 h-5 w-full appearance-none bg-transparent pointer-events-none ${thumbClasses}`}
      />
      <input
        type="range"
        min={min}
        max={safeMax}
        step={100}
        value={value.max}
        onChange={(event) => onUpdateMax(Number(event.target.value))}
        className={`absolute inset-0 h-5 w-full appearance-none bg-transparent pointer-events-none ${thumbClasses}`}
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
