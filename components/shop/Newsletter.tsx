"use client";

import Image from "next/image";

export default function NewsletterSection() {
  return (
    <section className="mt-20 md:mt-28">
      <div className="relative aspect-[393/659] w-full overflow-hidden rounded-[2px] md:aspect-[1527/402] md:min-h-[320px]">
        <Image
          src="/shop/sm-stayupdated_bg.png"
          alt="Roopshree newsletter"
          fill
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover md:hidden"
        />
        <Image
          src="/shop/stayupdated_bg.png"
          alt="Roopshree newsletter"
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="hidden object-cover object-center md:block"
        />

        <div className="relative z-10 flex h-full items-start px-4 pt-10 sm:px-6 md:items-center md:px-12 md:pt-0 lg:px-14">
          <div className="w-full max-w-[500px]">
            <h2 className="font-heading text-[2rem] leading-[1.05] text-[#111] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.4rem]">
              Stay Updated with
              <br />
              Roopshree
            </h2>

            <p className="mt-7 max-w-[260px] text-xs leading-4 text-[#111] md:mt-7 md:max-w-[430px] md:text-lg md:leading-6">
              Get exclusive offers, new arrivals & style tips straight to your
              inbox.
            </p>

            <form
              className="mt-5 flex max-w-[520px] gap-2 md:mt-8 md:gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your Email"
                required
                className="h-10 min-w-0 flex-1 rounded-[2px] border border-[#3F2617] bg-white/10 px-3 text-xs text-[#3F2617] outline-none placeholder:text-[#3F2617]/65 focus:border-[#C39150] md:h-[52px] md:px-4 md:text-base"
              />

              <button
                type="submit"
                className="h-10 w-[90px] shrink-0 rounded-[2px] bg-[#3F2617] text-xs font-semibold text-white transition-colors hover:bg-[#C39150] md:h-[52px] md:w-[146px] md:text-base"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
