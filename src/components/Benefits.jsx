import { motion } from "framer-motion";
import ClipPath from "../assets/svg/ClipPath";
import { benefits } from "../constants";
import { GradientLight } from "./design/Benefits";
import Heading from "./Heading";
import Section from "./Section";
import { curve } from "../assets";

const Benefits = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Section id="features" crosses>
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl text-center mx-auto"
          title={
            <>
              Why Choose{" "}
              <span className="inline-block relative font-semibold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
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
            </>
          }
          text="Discover the unparalleled advantages that set us apart in the industry"
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit) => (
            <motion.div
              className="relative group"
              key={benefit.id}
              variants={itemVariants}
              whileHover="hover"
            >
              <div
                className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"
              />
              
              <div
                className="relative h-full p-0.5 bg-no-repeat bg-[length:100%_100%] rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: `url(${benefit.backgroundUrl})`,
                }}
              >
                <motion.div 
                  className="relative z-2 flex flex-col min-h-[22rem] p-8 bg-n-8 rounded-xl"
                  variants={hoverVariants}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-n-7/50 backdrop-blur-sm">
                    <img
                      src={benefit.iconUrl}
                      width={32}
                      height={32}
                      alt={benefit.title}
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                  
                  <h5 className="h5 mb-4 text-gradient bg-gradient-to-r from-primary-100 to-accent-100 bg-clip-text text-transparent">
                    {benefit.title}
                  </h5>
                  <p className="body-2 mb-6 text-n-3/80">{benefit.text}</p>
                  
                  {benefit.imageUrl && (
                    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <img
                        src={benefit.imageUrl}
                        width={380}
                        height={362}
                        alt={benefit.title}
                        className="w-full h-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                </motion.div>

                {benefit.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8 rounded-xl"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default Benefits;
