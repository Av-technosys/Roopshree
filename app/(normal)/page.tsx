import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import HomeShowcaseSection from "@/components/home/HomeShowcaseSection";
import Newarrival from "@/components/home/Newarrival";
import Trending from "@/components/home/Trending";
import Reviews from "@/components/home/Reviews";
import Heritage from "@/components/home/Heritage";
import StayConnected from "@/components/home/StayConnected";
import {
  getCatalogCategories,
  getFeaturedProducts,
  getRecommendedProducts,
} from "@/services/product.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentic Bandhej Sarees & Dupattas from Rajasthan | Roopshree",
  description:
    "Shop handcrafted Bandhej sarees & dupattas from Roopshree. Authentic heritage from Rajasthan with trusted quality. Explore the latest collection and shop online.",
  alternates: {
    canonical: "https://roopshreebandhej.com",
  },
  keywords: [
    "bandhani dupattas",
    "bandhej sarees",
    "leheriya sarees",
    "pure georgette bandhani dupatta",
    "ethnic wear online",
  ],
};

const Page = async () => {
  const [categories, newArrivals, trendingProducts, featuredProducts] =
    await Promise.all([
      getCatalogCategories(5),
      getRecommendedProducts(5),
      getFeaturedProducts(5),
      getFeaturedProducts(8),
    ]);

  return (
    <main className="flex-1">
      <HeroSection />
      <HomeShowcaseSection products={featuredProducts} />
      <CategorySection categories={categories} />
      <Newarrival products={newArrivals} />
      <Trending products={trendingProducts} />
      <Reviews />
      <Heritage />
      <StayConnected />
    </main>
  );
};

export default Page;
