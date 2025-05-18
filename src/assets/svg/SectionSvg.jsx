import PlusSvg from "./PlusSvg";

const SectionSvg = ({ crossesOffset }) => {
  // crossesOffset contoh: "lg:translate-y-[5.25rem]"
  // Kita akan ubah cara pakainya supaya mengubah posisi top

  return (
    <>
      <PlusSvg
        className={`hidden absolute left-[1.5625rem] pointer-events-none lg:block xl:left-[2.1875rem] ${
          crossesOffset ? crossesOffset.replace("translate-y", "top") : "top-[1.25rem]"
        }`}
        style={{
          // fallback kalau crossesOffset ga dikasih, default top sekitar 1.25rem
          top: crossesOffset ? undefined : "1.25rem",
        }}
      />

      <PlusSvg
        className={`hidden absolute right-[1.5625rem] pointer-events-none lg:block xl:right-[2.1875rem] ${
          crossesOffset ? crossesOffset.replace("translate-y", "top") : "top-[1.25rem]"
        }`}
        style={{
          top: crossesOffset ? undefined : "1.25rem",
        }}
      />
    </>
  );
};

export default SectionSvg;
