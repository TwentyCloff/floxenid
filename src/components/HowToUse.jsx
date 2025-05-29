fix bug, dan bagian atas atau bagian awalnya itu jangan tampilkan video youtube, ubah jadi text tengah How To Use, jangan lupa fix bug bagian get started, first quest dan yang lainnya, disini hilangkan icon centang dan hilangkan scroll bar di kanannya, karena 3 icon ini bisa di scroll, dan bug, dan ketika klik misalnya first quest, tampilkan yang lain, jangan yang sama, dan hilangkan beginner persen,dll, gak penting, fokus dengan how to use, cara menggunakan script exploitasi saya, beri full kode dengan improvement 200x ya ! : import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiLocationArrow } from "react-icons/ti";
import { FiUser, FiCompass, FiAward, FiLink, FiYoutube } from "react-icons/fi";
import Section from "./Section";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";

const YouTubeEmbed = ({ videoId, poster }) => {
  return (
    <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-xl">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="YouTube video player"
      />
      {poster && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
    </div>
  );
};

const StepCard = ({ 
  number, 
  title, 
  description, 
  videoId, 
  poster, 
  icon: Icon,
  duration = "2 min",
  progress,
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
              {progress && (
                <Tooltip content={`Skill level: ${progress.label}`}>
                  <ProgressBar 
                    value={progress.value} 
                    max={progress.max} 
                    label={progress.label} 
                  />
                </Tooltip>
              )}
            </div>
            
            <div className="relative rounded-xl overflow-hidden mb-4">
              {isYouTube ? (
                <YouTubeEmbed videoId={videoId} poster={poster} />
              ) : (
                <div className="h-48 bg-gradient-to-r from-purple-900 to-blue-800 flex items-center justify-center">
                  <FiYoutube className="text-white text-4xl" />
                </div>
              )}
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
  
  // Different content for different page types
  const pageConfigs = {
    basic: {
      title: "Master Radiant Basics",
      subtitle: "Comprehensive guide to get started with Radiant",
      heroVideoId: "dQw4w9WgXcQ", // Example YouTube ID
      ctaTitle: "Ready to Master Radiant Basics?",
      steps: [
        {
          id: 1,
          title: "Getting Started",
          description: "Learn how to navigate the Radiant interface and basic controls.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-1-poster.jpg",
          icon: FiUser,
          duration: "3 min",
          tips: [
            "Pin frequently used features to your dashboard",
            "Customize your profile for better visibility",
            "Set up notifications to stay updated"
          ],
          progress: { value: 1, max: 3, label: "Beginner" }
        },
        {
          id: 2,
          title: "First Quest",
          description: "Complete your first quest and earn rewards in Radiant.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-2-poster.jpg",
          icon: FiCompass,
          duration: "5 min",
          tips: [
            "Check quest requirements before starting",
            "Prioritize time-limited quests first",
            "Use the quest tracker to monitor progress"
          ],
          progress: { value: 2, max: 3, label: "Beginner" }
        },
        {
          id: 3,
          title: "Social Features",
          description: "Connect with friends and join communities in Radiant.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/step-3-poster.jpg",
          icon: FiLink,
          duration: "7 min",
          tips: [
            "Join active communities for better rewards",
            "Participate in group quests for bonus XP",
            "Share your achievements to grow your network"
          ],
          progress: { value: 3, max: 3, label: "Intermediate" }
        }
      ],
      advancedTutorials: [
        {
          title: "Daily Routine Optimization",
          description: "Maximize your daily rewards with efficient routines",
          videoId: "dQw4w9WgXcQ",
          duration: "15 min"
        },
        {
          title: "Profile Customization",
          description: "Make your profile stand out with advanced customization",
          videoId: "dQw4w9WgXcQ",
          duration: "12 min"
        },
        {
          title: "Basic NFT Management",
          description: "Introduction to NFTs in Radiant",
          videoId: "dQw4w9WgXcQ",
          duration: "18 min"
        }
      ]
    },
    advanced: {
      title: "Advanced Radiant Techniques",
      subtitle: "Take your skills to the next level with pro strategies",
      heroVideoId: "dQw4w9WgXcQ",
      ctaTitle: "Ready to Become a Radiant Expert?",
      steps: [
        {
          id: 1,
          title: "Quest Optimization",
          description: "Advanced techniques to complete quests 50% faster.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/advanced-1-poster.jpg",
          icon: FiAward,
          duration: "10 min",
          tips: [
            "Chain quests for maximum efficiency",
            "Optimal pathing strategies for time-based quests",
            "Pre-completion preparation techniques"
          ],
          progress: { value: 1, max: 5, label: "Advanced" }
        },
        {
          id: 2,
          title: "Marketplace Strategies",
          description: "Buy low, sell high - master the Radiant marketplace.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/advanced-2-poster.jpg",
          icon: FiCompass,
          duration: "15 min",
          tips: [
            "Identifying undervalued assets",
            "Timing the market for maximum profit",
            "Bulk trading techniques"
          ],
          progress: { value: 2, max: 5, label: "Advanced" }
        },
        {
          id: 3,
          title: "Guild Leadership",
          description: "Build and manage a top-tier Radiant guild.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/advanced-3-poster.jpg",
          icon: FiUser,
          duration: "20 min",
          tips: [
            "Recruitment strategies for quality members",
            "Guild event scheduling for maximum participation",
            "Reward distribution systems"
          ],
          progress: { value: 3, max: 5, label: "Expert" }
        },
        {
          id: 4,
          title: "NFT Portfolio Management",
          description: "Build and optimize your NFT collection in Radiant.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/advanced-4-poster.jpg",
          icon: FiLink,
          duration: "25 min",
          tips: [
            "Diversification strategies",
            "Long-term vs short-term holdings",
            "Rarity evaluation techniques"
          ],
          progress: { value: 4, max: 5, label: "Expert" }
        }
      ],
      advancedTutorials: [
        {
          title: "Advanced Marketplace Arbitrage",
          description: "Find and exploit market inefficiencies",
          videoId: "dQw4w9WgXcQ",
          duration: "22 min"
        },
        {
          title: "Guild War Strategies",
          description: "Dominate guild wars with these tactics",
          videoId: "dQw4w9WgXcQ",
          duration: "30 min"
        },
        {
          title: "NFT Flipping Masterclass",
          description: "Buy low, sell high consistently",
          videoId: "dQw4w9WgXcQ",
          duration: "35 min"
        }
      ]
    },
    developer: {
      title: "Radiant Developer Guide",
      subtitle: "Build on the Radiant platform with our developer tools",
      heroVideoId: "dQw4w9WgXcQ",
      ctaTitle: "Ready to Build on Radiant?",
      steps: [
        {
          id: 1,
          title: "API Integration",
          description: "Connect your application with Radiant's powerful API.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/dev-1-poster.jpg",
          icon: FiLink,
          duration: "15 min",
          tips: [
            "Setting up authentication tokens",
            "Rate limit management strategies",
            "Webhook configuration best practices"
          ],
          progress: { value: 1, max: 4, label: "Intermediate" }
        },
        {
          id: 2,
          title: "Smart Contract Development",
          description: "Create and deploy smart contracts for Radiant.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/dev-2-poster.jpg",
          icon: FiCompass,
          duration: "25 min",
          tips: [
            "Gas optimization techniques",
            "Security audit checklist",
            "Testing methodologies"
          ],
          progress: { value: 2, max: 4, label: "Advanced" }
        },
        {
          id: 3,
          title: "UI Customization",
          description: "Build custom interfaces for Radiant applications.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/dev-3-poster.jpg",
          icon: FiUser,
          duration: "20 min",
          tips: [
            "Theme system deep dive",
            "Performance optimization",
            "Responsive design patterns"
          ],
          progress: { value: 3, max: 4, label: "Advanced" }
        },
        {
          id: 4,
          title: "Analytics Integration",
          description: "Track and analyze user behavior in your Radiant apps.",
          videoId: "dQw4w9WgXcQ",
          poster: "/images/dev-4-poster.jpg",
          icon: FiAward,
          duration: "18 min",
          tips: [
            "Key metrics to track",
            "Custom event implementation",
            "Data visualization techniques"
          ],
          progress: { value: 4, max: 4, label: "Expert" }
        }
      ],
      advancedTutorials: [
        {
          title: "Advanced Smart Contract Patterns",
          description: "Implement complex logic securely",
          videoId: "dQw4w9WgXcQ",
          duration: "40 min"
        },
        {
          title: "Cross-chain Integration",
          description: "Connect Radiant with other blockchains",
          videoId: "dQw4w9WgXcQ",
          duration: "35 min"
        },
        {
          title: "Scalability Solutions",
          description: "Handle high transaction volumes",
          videoId: "dQw4w9WgXcQ",
          duration: "45 min"
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
      <div className="bg-black pb-20 md:pb-32 circular-font">
        <div className="container mx-auto px-4 md:px-10">
          {/* Hero Section */}
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl md:h-[55vh] md:rounded-3xl md:mb-10">
            <div className="relative w-full h-full">
              <YouTubeEmbed videoId={config.heroVideoId} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 md:p-8">
                <div>
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {config.title}
                  </motion.h1>
                  <motion.p 
                    className="mt-3 text-sm md:text-lg text-gray-300 max-w-[200px] md:max-w-[280px] leading-snug md:leading-normal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {config.subtitle}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${(completedSteps.length / config.steps.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-300">
                      {completedSteps.length}/{config.steps.length} completed
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {config.steps.map((step) => (
                <Tooltip key={step.id} content={`${step.title} - ${step.duration}`}>
                  <button
                    onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeStep === step.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : completedSteps.includes(step.id)
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {step.icon ? (
                      <step.icon className="text-sm" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                    <span>{step.title}</span>
                    {completedSteps.includes(step.id) && (
                      <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
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
                progress={step.progress}
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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Advanced Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.advancedTutorials.map((tutorial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-40">
                    <YouTubeEmbed videoId={tutorial.videoId} />
                  </div>
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
              {config.ctaTitle}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Join thousands of users mastering Radiant every day. Start your journey now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Tooltip content="Get started with Radiant">
                <motion.button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Get Started
                </motion.button>
              </Tooltip>
              <Tooltip content="Join our community of experts">
                <motion.button 
                  className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors border border-gray-600 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                  </svg>
                  Join Community
                </motion.button>
              </Tooltip>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Tooltip content="Available on iOS 14+">
                <motion.div 
                  className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </motion.div>
              </Tooltip>
              
              <Tooltip content="Available on Android 10+">
                <motion.div 
                  className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-2.7v5.74c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"/>
                  </svg>
                  <span>Google Play</span>
                </motion.div>
              </Tooltip>
              
              <Tooltip content="Web3 Wallet Connect">
                <motion.div 
                  className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12l-7-7v4C9 9 4 14 4 20v1h2c0-5 5-9 9-9v4l7-7z"/>
                  </svg>
                  <span>Web3 Login</span>
                </motion.div>
              </Tooltip>
              
              <Tooltip content="Developer Documentation">
                <motion.div 
                  className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>API Docs</span>
                </motion.div>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
