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
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <img 
              src="src/assets/imgSale/elv.ico" 
              alt="Logo" 
              className="w-32 h-32 mx-auto"
            />
          </motion.div>

          {/* Main Text */}
          <motion.h2 
            className="text-5xl font-bold mb-4 tracking-tight"
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
            className="text-xl"
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
            className="w-64 h-1 mx-auto mt-8 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${colors.light}, ${colors.medium}, ${colors.dark})`,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          ></motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutUs;
