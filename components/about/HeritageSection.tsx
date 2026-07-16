import Image from "next/image"

import { heritageItems } from "./about-data"

const HeritageSection = () => {
  return (
    <section className="bg-white py-10 text-[#17110d] sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl leading-tight sm:text-4xl">
          Our Heritage
        </h2>
        <p className="mx-auto mt-2 max-w-[35rem] text-[0.62rem] font-medium leading-4 text-[#17110d]/80 sm:text-xs">
          Rooted in an ancient art form known for its intricate tie-dye patterns
          and vibrant hues. Passed down through
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-3 gap-y-8 md:mt-16 lg:grid-cols-4 lg:gap-y-0">
          {heritageItems.map((item, index) => (
            <article
              key={item.title}
              className="relative px-5 text-center text-[#3f2617]"
            >
              <div className="mx-auto flex h-14 w-16 items-center justify-center sm:h-16">
                <Image
                  src={item.image}
                  alt=""
                  width={96}
                  height={96}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <h3 className="mt-5 font-heading text-base leading-tight text-[#c39150] sm:text-lg min-h-[2.75rem] flex items-center justify-center lg:min-h-0">
                {item.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[10.5rem] text-[0.68rem] font-medium leading-[1.35] text-[#3f2617]/75 sm:text-xs min-h-[4rem] flex items-start justify-center lg:min-h-0">
                {item.text}
              </p>

              {index < heritageItems.length - 1 ? (
                <span className="absolute right-0 top-4 hidden h-36 w-px bg-[#d6b083]/55 lg:block" />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeritageSection
