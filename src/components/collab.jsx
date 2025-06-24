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
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Text */}
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            style={{ 
              color: colors.text,
              fontFamily: '"Conthrax", sans-serif',
              fontWeight: 800,
            }}
          >
            Powering creative minds.
          </h2>

          {/* Sub Text */}
          <p
            className="text-lg md:text-xl mb-16"
            style={{
              color: colors.subtext,
              fontFamily: '"Conthrax", sans-serif',
            }}
          >
            Built in-house. Shared with the world.
          </p>

          {/* Text Logo Grid */}
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* FloxenID - Tesla Font */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: '"TESLA", sans-serif',
                color: colors.light,
                letterSpacing: '-0.05em'
              }}
            >
              FloxenID
            </motion.div>

            {/* NierScript - Modern Font */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: '"Rajdhani", sans-serif',
                color: colors.medium,
                fontWeight: 600,
                letterSpacing: '0.1em'
              }}
            >
              NierScript
            </motion.div>

            {/* Sardonyx - Elegant Font */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: '"Playfair Display", serif',
                color: colors.dark,
                fontStyle: 'italic',
                fontWeight: 500
              }}
            >
              Sardonyx
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default AboutUs;
