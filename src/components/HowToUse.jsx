import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiLocationArrow } from "react-icons/ti";
import { FiUser, FiCompass, FiLink, FiYoutube } from "react-icons/fi";
import Section from "./Section";
import Tooltip from "./Tooltip";

const StepCard = ({ 
  number, 
  title, 
  description, 
  videoId, 
  poster, 
  icon: Icon,
  duration = "2 min",
  tips = [],
  expanded = false,
  onExpand,
  isYouTube = true
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(!isExpanded);
  };

  return (
    <motion.div 
      className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
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

const HowToUse = ({ pageType = "basic" }) => {
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const pageConfigs = {
    basic: {
      title: "How To Use",
      subtitle: "Step-by-step guide to using the exploit script",
      steps: [
        {
          id: 1,
          title: "Getting Started",
          description: "Learn how to set up and run the exploit script properly.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-1-poster.jpg",
          icon: FiUser,
          duration: "3 min",
          tips: [
            "Make sure you have all dependencies installed",
            "Run the script with admin privileges for best results",
            "Check system requirements before starting"
          ]
        },
        {
          id: 2,
          title: "First Execution",
          description: "How to execute the script for the first time and verify it works.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-2-poster.jpg",
          icon: FiCompass,
          duration: "5 min",
          tips: [
            "Run in test environment first",
            "Check console for error messages",
            "Verify output files are created"
          ]
        },
        {
          id: 3,
          title: "Advanced Features",
          description: "Learn about advanced options and customization.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-3-poster.jpg",
          icon: FiLink,
          duration: "7 min",
          tips: [
            "Use command line arguments for customization",
            "Modify config files for specific use cases",
            "Combine with other tools for enhanced functionality"
          ]
        }
      ],
      advancedTutorials: [
        {
          title: "Script Optimization",
          description: "Make the script run faster and more efficiently",
          videoId: "dQw4w9WgXcQ",
          duration: "15 min"
        },
        {
          title: "Error Handling",
          description: "Learn how to troubleshoot common issues",
          videoId: "dQw4w9WgXcQ",
          duration: "12 min"
        },
        {
          title: "Custom Modifications",
          description: "How to modify the script for your specific needs",
          videoId: "dQw4w9WgXcQ",
          duration: "18 min"
        }
      ]
    }
  };

  const config = pageConfigs[pageType] || pageConfigs.basic;
  
  const handleStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  return (
    <Section id="how-to-use">
      <div className="bg-black pb-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-10">
          {/* Hero Section - Simplified */}
          <div className="text-center py-12 md:py-20">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {config.title}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {config.subtitle}
            </motion.p>
          </div>

          {/* Step Navigation - Simplified */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {config.steps.map((step) => (
                <Tooltip key={step.id} content={`${step.title} - ${step.duration}`}>
                  <button
                    onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeStep === step.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {step.icon ? (
                      <step.icon className="text-sm" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                    <span>{step.title}</span>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.steps.map((step) => (
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
                expanded={activeStep === step.id}
                onExpand={(expanded) => {
                  if (expanded) {
                    setActiveStep(step.id);
                    handleStepComplete(step.id);
                  } else if (activeStep === step.id) {
                    setActiveStep(null);
                  }
                }}
              />
            ))}
          </div>

          {/* Advanced Tutorials Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Advanced Techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.advancedTutorials.map((tutorial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{tutorial.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {tutorial.duration}
                      </span>
                      <Tooltip content="Watch full tutorial">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                          <FiYoutube />
                          Watch
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Follow the steps above to properly use the exploit script. For best results, read all instructions carefully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Tooltip content="Download the script">
                <motion.button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Script
                </motion.button>
              </Tooltip>
              <Tooltip content="View documentation">
                <motion.button 
                  className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors border border-gray-600 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Documentation
                </motion.button>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
