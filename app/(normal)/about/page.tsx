import AboutCta from "@/components/about/AboutCta"
import AboutHero from "@/components/about/AboutHero"
import GallerySection from "@/components/about/GallerySection"
import HeritageSection from "@/components/about/HeritageSection"
import MissionSection from "@/components/about/MissionSection"
import QualityHighlights from "@/components/about/QualityHighlights"
import StorySection from "@/components/about/StorySection"

const AboutPage = () => {
  return (
    <main className="flex-1">
      <AboutHero />
      <HeritageSection />
      <StorySection />
      <MissionSection />
     
      <GallerySection />
      <AboutCta />
    </main>
  )
}

export default AboutPage
