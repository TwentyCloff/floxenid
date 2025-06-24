import { motion } from 'framer-motion';
import Section from "./Section";

// Ivory Mint Color Theme
const colors = {
  dark: '#96C7B9',      // Soft teal
  medium: '#D1F0E0',    // Mint
  light: '#FFFFFF',      // Pure white
  accent: '#96C7B9',     // Soft teal accent
  text: '#FFFFFF',       // White text
  subtext: '#A0AEC0',    // Gray subtext
  background: '#000000'  // Black background
};

const AboutUs = () => {
  return (
    <Section 
      id="about"
      crosses
      className="pt-[6rem] -mt-[2.5rem]"
    >
      <div 
        className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          {/* Main Text */}
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            style={{ 
              color: colors.text,
              fontFamily: '"Conthrax", sans-serif',
              fontWeight: 800,
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Powering creative minds.
          </motion.h2>

          {/* Sub Text */}
          <motion.p
            className="text-lg md:text-xl mb-12"
            style={{
              color: colors.subtext,
              fontFamily: '"Conthrax", sans-serif',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Built in-house. Shared with the world.
          </motion.p>

          {/* Gradient Divider */}
          <motion.div 
            className="w-48 h-1 mx-auto mb-12 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${colors.light}, ${colors.medium}, ${colors.dark})`,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          ></motion.div>

          {/* Logo Grid */}
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Logo 1 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-24 h-24 md:w-32 md:h-32"
            >
              <img 
                src="src/assets/imgSale/nier.webp" 
                alt="Team Member 1" 
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>

            {/* Logo 2 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-24 h-24 md:w-32 md:h-32"
            >
              <img 
                src="src/assets/imgSale/nier.webp" 
                alt="Team Member 2" 
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>

            {/* Logo 3 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-24 h-24 md:w-32 md:h-32"
            >
              <img 
                src="src/assets/imgSale/nier.webp" 
                alt="Team Member 3" 
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutUs;
