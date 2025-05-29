import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiLocationArrow } from "react-icons/ti";
import { FiDownload, FiUser, FiCompass, FiAward, FiLink } from "react-icons/fi";
import Section from "./Section";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";

const VideoPlayer = ({ src, poster, withOverlay = false, retryLimit = 5 }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const retryRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            retryRef.current = 0;
          })
          .catch(error => {
            console.log("Playback failed, retrying...", error);
            if (retryRef.current < retryLimit) {
              retryRef.current += 1;
              setTimeout(() => {
                video.muted = true;
                video.play()
                  .then(() => setIsPlaying(true))
                  .catch(e => console.log("Retry failed:", e));
              }, 500 * retryRef.current);
            }
          });
      }
    };

    const handleError = () => {
      console.error("Video error:", video.error);
    };

    // Video optimization settings
    video.preload = "auto";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('muted', 'true');
    video.setAttribute('autoplay', 'true');

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('error', handleError);
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play();
    });

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.load();
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
      observer.unobserve(video);
    };
  }, [src, retryLimit]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        webkit-playsinline="true"
        autoPlay
        className="absolute left-0 top-0 w-full h-full object-cover"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease, transform 0.3s ease'
        }}
      />
      {withOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-r-2 border-white rotate-45 translate-x-[1px]" />
          </div>
        </div>
      )}
    </div>
  );
};

const StepCard = ({ 
  number, 
  title, 
  description, 
  videoSrc, 
  poster, 
  icon: Icon,
  duration = "2 min",
  progress,
  tips = [],
  expanded = false,
  onExpand
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(!isExpanded);
  };

  return (
    <motion.div 
      className="bg-gray-900 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            {Icon ? <Icon className="text-white text-lg" /> : (
              <span className="text-white font-bold">{number}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <button 
                onClick={toggleExpand}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
            <p className="text-gray-300 mb-4">{description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{duration}</span>
              {progress && (
                <ProgressBar 
                  value={progress.value} 
                  max={progress.max} 
                  label={progress.label} 
                />
              )}
            </div>
            
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <VideoPlayer src={videoSrc} poster={poster} />
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
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">TIPS & TRICKS</h4>
                    <ul className="space-y-3">
                      {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-blue-500/20 rounded-full p-1 mt-0.5">
                            <TiLocationArrow className="text-blue-400 text-xs" />
                          </div>
                          <span className="text-gray-300 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                        Watch Tutorial
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                        Try Now
                      </button>
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

const HowToUse = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const steps = [
    {
      id: 1,
      title: "Download & Install",
      description: "Get Radiant from the App Store or Google Play Store and install it on your device.",
      videoSrc: "/videos/step-1.mp4",
      poster: "/images/step-1-poster.jpg",
      icon: FiDownload,
      duration: "1 min",
      tips: [
        "Ensure your device meets the minimum requirements",
        "Check available storage space before downloading",
        "Enable automatic updates for best experience"
      ],
      progress: { value: 1, max: 3, label: "Beginner" }
    },
    {
      id: 2,
      title: "Create Account",
      description: "Sign up with email or connect your Web3 wallet to get started.",
      videoSrc: "/videos/step-2.mp4",
      poster: "/images/step-2-poster.jpg",
      icon: FiUser,
      duration: "3 min",
      tips: [
        "Use a strong password for email registration",
        "Backup your wallet recovery phrase securely",
        "Enable two-factor authentication for security"
      ],
      progress: { value: 2, max: 3, label: "Beginner" }
    },
    {
      id: 3,
      title: "Explore Features",
      description: "Discover Quests, Leaderboards, and Marketplace functionalities.",
      videoSrc: "/videos/step-3.mp4",
      poster: "/images/step-3-poster.jpg",
      icon: FiCompass,
      duration: "5 min",
      tips: [
        "Bookmark favorite features for quick access",
        "Customize your dashboard layout",
        "Set up notifications for important updates"
      ],
      progress: { value: 3, max: 3, label: "Intermediate" }
    },
    {
      id: 4,
      title: "Complete Quests",
      description: "Earn rewards through daily and weekly activities and challenges.",
      videoSrc: "/videos/step-4.mp4",
      poster: "/images/step-4-poster.jpg",
      icon: FiAward,
      duration: "8 min",
      tips: [
        "Check quest requirements before starting",
        "Prioritize time-limited quests first",
        "Join a guild for collaborative quests"
      ],
      progress: { value: 1, max: 5, label: "Advanced" }
    },
    {
      id: 5,
      title: "Connect Zigma & Nexus",
      description: "Enhance your experience with NFTs and social features integration.",
      videoSrc: "/videos/step-5.mp4",
      poster: "/images/step-5-poster.jpg",
      icon: FiLink,
      duration: "10 min",
      tips: [
        "Verify compatible wallet addresses",
        "Review transaction fees before confirming",
        "Explore advanced NFT management options",
        "Connect with friends for social rewards"
      ],
      progress: { value: 2, max: 5, label: "Expert" }
    }
  ];

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
          <div className="border-hsla relative mb-6 h-64 w-full overflow-hidden rounded-2xl md:h-[55vh] md:rounded-3xl md:mb-10">
            <div className="relative w-full h-full">
              <VideoPlayer 
                src="/videos/how-to-use-1.mp4" 
                poster="/images/how-to-use-poster.jpg"
                withOverlay
              />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 md:p-8">
                <div>
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Master <b className="font-semibold">Radiant</b>
                  </motion.h1>
                  <motion.p 
                    className="mt-3 text-sm md:text-lg text-gray-300 max-w-[200px] md:max-w-[280px] leading-snug md:leading-normal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Comprehensive guide to maximize your experience
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
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-300">
                      {completedSteps.length}/{steps.length} completed
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeStep === step.id 
                      ? 'bg-blue-500 text-white' 
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
                    <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <StepCard
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                videoSrc={step.videoSrc}
                poster={step.poster}
                icon={step.icon}
                duration={step.duration}
                progress={step.progress}
                tips={step.tips}
                expanded={activeStep === step.id}
                onExpand={(expanded) => {
                  if (expanded) {
                    setActiveStep(step.id);
                  } else if (activeStep === step.id) {
                    setActiveStep(null);
                  }
                }}
              />
            ))}
          </div>

          {/* Advanced Tutorials Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Advanced Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-gray-900 rounded-2xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-40">
                  <VideoPlayer src="/videos/advanced-1.mp4" poster="/images/advanced-1-poster.jpg" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">NFT Strategies</h3>
                  <p className="text-gray-300 text-sm mb-4">Maximize your NFT portfolio with advanced techniques</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">25 min</span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Watch Now
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900 rounded-2xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-40">
                  <VideoPlayer src="/videos/advanced-2.mp4" poster="/images/advanced-2-poster.jpg" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Quest Optimization</h3>
                  <p className="text-gray-300 text-sm mb-4">Complete quests 50% faster with these strategies</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">18 min</span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Watch Now
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900 rounded-2xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-40">
                  <VideoPlayer src="/videos/advanced-3.mp4" poster="/images/advanced-3-poster.jpg" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Social Features</h3>
                  <p className="text-gray-300 text-sm mb-4">Build your community and earn together</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">32 min</span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Watch Now
                    </button>
                  </div>
                </div>
              </motion.div>
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
              Ready to Master Radiant?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Join our community of power users and unlock the full potential of the platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload />
                Download Now
              </motion.button>
              <motion.button 
                className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors border border-gray-600 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Community
              </motion.button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Tooltip content="Available on iOS 14+">
                <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </div>
              </Tooltip>
              
              <Tooltip content="Available on Android 10+">
                <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-2.7v5.74c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"/>
                  </svg>
                  <span>Google Play</span>
                </div>
              </Tooltip>
              
              <Tooltip content="Web3 Wallet Connect">
                <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12l-7-7v4C9 9 4 14 4 20v1h2c0-5 5-9 9-9v4l7-7z"/>
                  </svg>
                  <span>Web3 Login</span>
                </div>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
