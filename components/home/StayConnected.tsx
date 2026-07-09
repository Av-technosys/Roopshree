import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const socialImages = [
  {
    src: "/home/shrug.png",
    alt: "Red Bandhej fabric with embroidered motif",
  },
  {
    src: "/home/brouch.png",
    alt: "Bandhej styling detail with decorative brooch",
  },
  {
    src: "/home/zardozi.png",
    alt: "Bandhej border and handwork detail",
  },
  {
    src: "/home/new-arrival-model.png",
    alt: "Roopshree Bandhej outfit",
  },
]

const InstagramMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
  </svg>
)

const MailMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <rect x="2.5" y="5" width="19" height="14" rx="2.3" />
    <path
      d="M4.6 7.2 12 12.6l7.4-5.4"
      fill="none"
      stroke="#efe0cf"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const StayConnected = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#efe0cf] py-10 sm:py-14 lg:py-16">
      <Image
        src="/home/connected_bg.png"
        alt=""
        fill
        sizes="100vw"
        className="scale-[1.3] object-cover object-[22%_center] sm:object-center"
      />

      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <Image
          src="/about/timelesselegance.png"
          alt=""
          width={83}
          height={67}
          className="mx-auto h-8 w-10 object-contain sm:h-11 sm:w-14"
        />
        <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#3f2617] sm:text-sm">
          Stay Connected
        </p>
        <h2 className="mt-3 font-semibold text-[2.2rem] leading-none text-[#3f2617] sm:text-5xl lg:text-6xl">
          Follow Roopshree
        </h2>

        <div className="mx-auto mt-4 flex w-52 items-center justify-center gap-3 text-[#c39150]">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#c39150]" />
          <span className="size-2.5 rotate-45 bg-[#C39150]" />
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#c39150]" />
        </div>

        <p className="mx-auto mt-4 max-w-[19rem] text-[0.82rem] font-medium leading-[1.65] text-[#6b625d] sm:max-w-3xl sm:text-lg">
          get inspired by our latest collections, styling ideas, and behind the
          scenes moments. Follow us on social media and be part of the Roopshree
          family.
        </p>

       
        <div className="scrollbar-hidden mx-auto mt-9 flex max-w-5xl snap-x gap-2 overflow-x-auto px-[calc(50%-9.5rem)] sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {socialImages.map((item) => (
            <div
              key={item.src}
              className="relative aspect-[3/4] w-[19rem] shrink-0 snap-center border-[5px] border-[#F1E1CD] bg-[#eadac6] shadow-sm sm:w-auto"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 25vw, 304px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Button
          asChild
          className="mt-9 h-12 rounded-[3px] bg-[#C39150] px-9 text-sm font-semibold text-white shadow-none hover:bg-[#3F2617] sm:h-14 sm:min-w-[21rem] sm:px-12 sm:text-xl"
        >
          <Link href="https://www.instagram.com/" target="_blank">
            <InstagramMark className="size-5 sm:size-7" />
            Follow us on Instagram
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default StayConnected
