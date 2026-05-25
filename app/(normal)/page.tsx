import HeroSection from "@/components/home/HeroSection"
import CategorySection from "@/components/home/CategorySection"
import HomeShowcaseSection from "@/components/home/HomeShowcaseSection"
import Newarrival from "@/components/home/Newarrival"
import Trending from "@/components/home/Trending"
import Reviews from "@/components/home/Reviews"
import Heritage from "@/components/home/Heritage"
import StayConnected from "@/components/home/StayConnected"

const Page = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <HomeShowcaseSection />
      <CategorySection />
      <Newarrival />
      <Trending />
      <Reviews />
      <Heritage />
      <StayConnected />
    </main>
  )
}

export default Page
