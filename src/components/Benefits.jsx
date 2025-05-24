import { motion } from "framer-motion";
import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";

const Benefits = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <Section id="features" className="bg-n-8 overflow-hidden">
      <div className="container relative z-2 py-20">
        {/* Floating decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full filter blur-3xl -z-1" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full filter blur-3xl -z-1" />
        
        <Heading
          className="text-center mb-16"
          title={
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Why Choose <span className="text-white">Qarvo</span>?
            </motion.span>
          }
          text="Experience the difference with our cutting-edge solutions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="h-full bg-n-7/50 backdrop-blur-sm border border-n-1/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-n-1/30 p-8">
                {/* Icon with gradient border */}
                <div className="relative w-14 h-14 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-sm" />
                  <div className="relative w-full h-full bg-n-8 rounded-xl flex items-center justify-center">
                    <img 
                      src={benefit.iconUrl} 
                      alt={benefit.title} 
                      className="w-8 h-8 object-contain" 
                      loading="lazy"
                    />
                  </div>
                </div>
                
                <h3 className="h5 mb-4 text-white">{benefit.title}</h3>
                <p className="body-2 text-n-3 mb-6">{benefit.text}</p>
                
                {/* Interactive preview image */}
                {benefit.imageUrl && (
                  <div className="mt-auto overflow-hidden rounded-xl">
                    <motion.img
                      src={benefit.imageUrl}
                      alt={benefit.title}
                      className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      loading="lazy"
                    />
                  </div>
                )}
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 -translate-x-full group-hover:translate-x-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative bottom element */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-n-8 to-transparent -z-10" />
      </div>
    </Section>
  );
};

export default Benefits;
