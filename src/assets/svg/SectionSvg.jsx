import PlusSvg from "./PlusSvg";

const SectionSvg = ({ crossesTop = "5rem" }) => {
  return (
    <>
      <PlusSvg
        className="hidden absolute left-[1.5625rem] pointer-events-none lg:block xl:left-[2.1875rem]"
        style={{ top: crossesTop, zIndex: 0 }}
      />

      <PlusSvg
        className="hidden absolute right-[1.5625rem] pointer-events-none lg:block xl:right-[2.1875rem]"
        style={{ top: crossesTop, zIndex: 0 }}
      />
    </>
  );
};

export default SectionSvg;
