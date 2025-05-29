import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiLocationArrow } from "react-icons/ti";
import { FiUser, FiCompass, FiLink, FiYoutube } from "react-icons/fi";
import Section from "./Section";

// Improved Tooltip component with responsive behavior
const Tooltip = ({ content, children, delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const handleClick = () => {
    if (!isMobile) return;
    setIsVisible(!isVisible);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${
              isMobile ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' : 'top-full mt-2'
            } bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap`}
          >
            {content}
            <div 
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                isMobile ? 'top-full -translate-y-1/2 left-1/2 -translate-x-1/2' : 'bottom-full left-1/2 -translate-x-1/2 -mb-1'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// StepCard component with independent expansion
const StepCard = ({ 
  number, 
  title, 
  description, 
  videoId, 
  poster, 
  icon: Icon,
  duration = "2 min",
  tips = [],
  isYouTube = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      layout // Add layout prop for smooth animation
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Tooltip content={`Step ${number}`}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
              {Icon ? <Icon className="text-white text-lg" /> : (
                <span className="text-white font-bold">{number}</span>
              )}
            </div>
          </Tooltip>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <Tooltip content={isExpanded ? 'Collapse details' : 'Expand for more'}>
                <button 
                  onClick={toggleExpand}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <span>Less</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </Tooltip>
            </div>
            <p className="text-gray-300 mb-4">{description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <Tooltip content="Estimated time to complete">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {duration}
                </span>
              </Tooltip>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  layout // Add layout prop for smooth animation
                >
                  <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      PRO TIPS & TRICKS
                    </h4>
                    <ul className="space-y-3">
                      {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Tooltip content="Pro tip">
                            <div className="bg-blue-500/20 rounded-full p-1 mt-0.5">
                              <TiLocationArrow className="text-blue-400 text-xs" />
                            </div>
                          </Tooltip>
                          <span className="text-gray-300 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Tooltip content="Watch full tutorial video">
                        <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                          <FiYoutube />
                          Tutorial
                        </button>
                      </Tooltip>
                      <Tooltip content="Try this feature now">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                          Try Now
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Getting Started Page
export const GettingStarted = () => {
  const steps = [
    {
      id: 1,
      title: "Initial Setup",
      description: "Learn how to install and configure the basic requirements.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/step-1-poster.jpg",
      icon: FiUser,
      duration: "3 min",
      tips: [
        "Make sure you have Node.js installed",
        "Check your system meets minimum requirements",
        "Run installation as administrator if needed"
      ]
    },
    {
      id: 2,
      title: "Configuration",
      description: "How to set up your configuration files properly.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/step-2-poster.jpg",
      icon: FiCompass,
      duration: "5 min",
      tips: [
        "Backup your config files before modifying",
        "Use the sample config as a template",
        "Validate your config with the built-in validator"
      ]
    },
    {
      id: 3,
      title: "First Run",
      description: "Execute the script for the first time and verify it works.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/step-3-poster.jpg",
      icon: FiLink,
      duration: "4 min",
      tips: [
        "Run in a test environment first",
        "Check console for error messages",
        "Verify output files are created correctly"
      ]
    },
    {
      id: 4,
      title: "Troubleshooting",
      description: "Common issues and how to resolve them.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/step-4-poster.jpg",
      duration: "6 min",
      tips: [
        "Check the log files for detailed errors",
        "Verify all dependencies are installed",
        "Search the knowledge base for similar issues"
      ]
    }
  ];

  return (
    <Section id="getting-started">
      <div className="bg-black pb-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center py-12 md:py-20">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Getting Started
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Follow these steps to set up and run the exploit script
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <StepCard
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                videoId={step.videoId}
                poster={step.poster}
                icon={step.icon}
                duration={step.duration}
                tips={step.tips}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

// First Execution Page
export const FirstExecution = () => {
  const steps = [
    {
      id: 1,
      title: "Initial Launch",
      description: "How to properly launch the script for the first time.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/execution-1-poster.jpg",
      icon: FiUser,
      duration: "4 min",
      tips: [
        "Run from an elevated command prompt",
        "Check system resources before starting",
        "Monitor initial output for warnings"
      ]
    },
    {
      id: 2,
      title: "Parameter Usage",
      description: "Understanding and using command line parameters.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/execution-2-poster.jpg",
      icon: FiCompass,
      duration: "6 min",
      tips: [
        "Use --help to see all available options",
        "Combine parameters for specific use cases",
        "Test parameters in a safe environment first"
      ]
    },
    {
      id: 3,
      title: "Output Analysis",
      description: "How to interpret the script's output.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/execution-3-poster.jpg",
      icon: FiLink,
      duration: "5 min",
      tips: [
        "Look for success indicators in the output",
        "Save logs for future reference",
        "Understand warning vs error messages"
      ]
    },
    {
      id: 4,
      title: "Post-Execution Steps",
      description: "What to do after the script completes.",
      videoId: "dQw4w9WgXcQ",
      poster: "/images/execution-4-poster.jpg",
      duration: "3 min",
      tips: [
        "Verify all expected files were created",
        "Clean up temporary files if needed",
        "Review performance metrics for optimization"
      ]
    }
  ];

  return (
    <Section id="first-execution">
      <div className="bg-black pb-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center py-12 md:py-20">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              First Execution
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Learn how to properly execute the script for the first time
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <StepCard
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                videoId={step.videoId}
                poster={step.poster}
                icon={step.icon}
                duration={step.duration}
                tips={step.tips}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

// Main HowToUse component that can render different pages
const HowToUse = ({ page = "getting-started" }) => {
  switch (page) {
    case "getting-started":
      return <GettingStarted />;
    case "first-execution":
      return <FirstExecution />;
    default:
      return <GettingStarted />;
  }
};

export default HowToUse;
