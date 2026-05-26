const SectionDivider = () => {
  return (
    <div className="mx-auto flex w-56 items-center justify-center gap-2.5 text-[#c39150] sm:w-72">
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#c39150]" />
      <span className="size-2 rotate-45 bg-[#c39150]" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#c39150]" />
    </div>
  )
}

export default SectionDivider
