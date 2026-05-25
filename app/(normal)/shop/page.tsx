import NewsletterSection from "@/components/shop/Newsletter";
import HeroSection from "@/components/shop/Hero";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopProducts from "@/components/shop/ShopProducts";
import React from "react";

const page = () => {
  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <section className="max-w-full overflow-x-hidden bg-white py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="mb-5 hidden gap-4 text-xs font-medium text-[#111] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <p>Home &nbsp;&gt;&nbsp; Shop</p>
            <p>All Categories</p>
          </div>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <ShopFilters />
            <ShopProducts />
          </div>
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
};

export default page;
