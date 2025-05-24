import { motion } from "framer-motion";
import ClipPath from "../assets/svg/ClipPath";
import { benefits } from "../constants";
import { GradientLight } from "./design/Benefits";
import Heading from "./Heading";
import Section from "./Section";
import { curve } from "../assets";

const Benefits = () => {
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <Section id="features" className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-1 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500 rounded-full filter blur-3xl" />
      </div>

      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title={
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose{" "}
              <span className="inline-block relative font-semibold">
                Qarvo?
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                  width={624}
                  height={28}
                  alt="Curve"
                  loading="lazy"
                />
              </span>
            </motion.span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Original background styling */}
              <div
                className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] h-full"
                style={{
                  backgroundImage: `url(${benefit.backgroundUrl})`,
                }}
              >
                <div className="relative z-2 flex flex-col min-h-[22rem] p-8 pointer-events-none">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-n-7/50 backdrop-blur-sm flex items-center justify-center mr-4">
                      <img
                        src={benefit.iconUrl}
                        width={24}
                        height={24}
                        alt={benefit.title}
                        loading="lazy"
                        className="object-contain"
                      />
                    </div>
                    <h5 className="h5 text-gradient bg-gradient-to-r from-primary-100 to-accent-100 bg-clip-text text-transparent">
                      {benefit.title}
                    </h5>
                  </div>
                  <p className="body-2 mb-6 text-n-3 flex-grow">{benefit.text}</p>
                  
                  {benefit.imageUrl && (
                    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <img
                        src={benefit.imageUrl}
                        width={380}
                        height={362}
                        alt={benefit.title}
                        className="w-full h-40 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {benefit.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    {benefit.imageUrl && (
                      <img
                        src={benefit.imageUrl}
                        width={380}
                        height={362}
                        alt={benefit.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                <ClipPath />
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-xl blur-md" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
