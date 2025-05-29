import { useRef, useEffect, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Section from "./Section";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
            retryRef.current = 0;
          })
          .catch(error => {
            console.log("Playback failed, retrying...", error);
            if (retryRef.current < 3) {
              retryRef.current += 1;
              setTimeout(() => {
                video.muted = true;
                video.play().catch(e => console.log("Retry failed:", e));
              }, 500 * retryRef.current);
            }
          });
      }
    };

    const handleError = () => {
      console.error("Video error:", video.error);
    };

    // Mobile optimization settings
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

    // Force load on mobile
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      webkit-playsinline="true"
      autoPlay
      className="absolute left-0 top-0 w-full h-full object-cover"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
    />
  );
};

const HowToUse = () => {
  return (
    <Section id="how-to-use">
      <div className="bg-black pb-20 md:pb-32 circular-font">
        <div className="container mx-auto px-4 md:px-10">
          {/* Hero Section */}
          <div className="border-hsla relative mb-6 h-64 w-full overflow-hidden rounded-2xl md:h-[55vh] md:rounded-3xl md:mb-10">
            <div className="relative w-full h-full">
              <VideoPlayer src="/videos/how-to-use-1.mp4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 md:p-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                    How to Use <b className="font-semibold">Radiant</b>
                  </h1>
                  <p className="mt-3 text-sm md:text-lg text-gray-300 max-w-[200px] md:max-w-[280px] leading-snug md:leading-normal">
                    A step-by-step guide to getting started
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Download & Install</h3>
                  <p className="text-gray-300 mb-4">
                    Get Radiant from the App Store or Google Play Store.
                  </p>
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <VideoPlayer src="/videos/step-1.mp4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Create Account</h3>
                  <p className="text-gray-300 mb-4">
                    Sign up with email or connect your Web3 wallet.
                  </p>
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <VideoPlayer src="/videos/step-2.mp4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Explore Features</h3>
                  <p className="text-gray-300 mb-4">
                    Discover Quests, Leaderboards, and Marketplace.
                  </p>
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <VideoPlayer src="/videos/step-3.mp4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Complete Quests</h3>
                  <p className="text-gray-300 mb-4">
                    Earn rewards through daily and weekly activities.
                  </p>
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <VideoPlayer src="/videos/step-4.mp4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-gray-900 rounded-2xl p-6 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Connect Zigma & Nexus</h3>
                  <p className="text-gray-300 mb-4">
                    Enhance your experience with NFTs and social features.
                  </p>
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <VideoPlayer src="/videos/step-5.mp4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <h4 className="text-white text-lg font-semibold">Pro Tip:</h4>
                      <p className="text-gray-300">
                        More engagement = more rewards!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Join thousands earning rewards through everyday activities.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
              Download Now
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
