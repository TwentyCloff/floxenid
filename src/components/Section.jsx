import { motion } from "framer-motion";
import SectionSvg from "../assets/svg/SectionSvg";

const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      id={id}
      className={`relative ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
      } ${className || ""}`}
    >
      {children}

      {/* Hapus garis kiri dan kanan vertikal */}
      {/* Tidak ada tambahan garis abu kiri/kanan */}

      {/* Cross garis horizontal atas (jika crosses true) */}
      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 ${
              crossesOffset || ""
            } pointer-events-none lg:block xl:left-10 xl:right-10`}
            aria-hidden
          />
          <SectionSvg crossesOffset={crossesOffset || ""} />
        </>
      )}
    </motion.section>
  );
};

export default Section;
