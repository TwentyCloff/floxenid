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
      className={`relative z-0 ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
      } ${className || ""}`}
    >
      {children}

      {/* Cross garis horizontal atas (jika crosses true) */}
      {crosses && (
        <>
          <div
            className={`hidden absolute left-7.5 right-7.5 h-0.25 bg-stroke-1 ${
              crossesOffset || "top-8"
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
