import Link from "next/link";
import NewsletterSection from "@/components/shop/Newsletter";
import HeroSection from "@/components/shop/Hero";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopProducts from "@/components/shop/ShopProducts";
import {
  getCatalogCategories,
  getCatalogFilterOptions,
  getCatalogProductPage,
} from "@/services/product.service";

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getParamList(value?: string | string[]) {
  const raw = Array.isArray(value) ? value.join(",") : value;

  return raw
    ? raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function getPriceInPaise(value?: string | string[]) {
  const price = Number(getParamValue(value));

  return Number.isFinite(price) && price > 0 ? Math.round(price * 100) : undefined;
}

const page = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const filterOptions = await getCatalogFilterOptions();
  const currentPage = Number(getParamValue(params?.page) ?? 1);
  const pageSize = 12;
  const customFilters = filterOptions.customGroups.reduce<Record<string, string[]>>(
    (filters, group) => {
      const values = getParamList(params?.[`filter_${group.paramKey}`]);

      if (values.length > 0) {
        filters[group.title] = values;
      }

      return filters;
    },
    {},
  );
  const [{ items, total }, categories] = await Promise.all([
    getCatalogProductPage({
      limit: pageSize,
      offset: (Math.max(currentPage, 1) - 1) * pageSize,
      categorySlugs: getParamList(params?.category),
      colors: getParamList(params?.color),
      fabrics: getParamList(params?.fabric),
      sizes: getParamList(params?.size),
      availability: getParamList(params?.availability).filter(
        (item): item is "in-stock" | "out-of-stock" =>
          item === "in-stock" || item === "out-of-stock",
      ),
      minPriceInPaise: getPriceInPaise(params?.minPrice),
      maxPriceInPaise: getPriceInPaise(params?.maxPrice),
      filters: customFilters,
      sortBy:
        getParamValue(params?.sort) === "newest" ||
        getParamValue(params?.sort) === "price-low" ||
        getParamValue(params?.sort) === "price-high"
          ? (getParamValue(params?.sort) as "newest" | "price-low" | "price-high")
          : "featured",
    }),
    getCatalogCategories(8),
  ]);

  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <section className="max-w-full overflow-x-hidden bg-white py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="mb-5 hidden gap-4 text-xs font-medium text-[#111] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <p>
              <Link href="/" className="hover:text-[#C39150]">Home</Link> &nbsp;&gt;&nbsp;{" "}
              <Link href="/shop" className="hover:text-[#C39150]">Shop</Link>
            </p>
            <p>All Categories</p>
          </div>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <ShopFilters options={filterOptions} />
            <ShopProducts
              products={items}
              categories={categories}
              filterOptions={filterOptions}
              total={total}
              currentPage={Math.max(currentPage, 1)}
            />
          </div>
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
};

export default page;
