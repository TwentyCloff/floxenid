import { check, curve } from "../assets";
import { collabApps, collabContent, collabText } from "../constants";
import Button from "./Button";
import { LeftCurve, RightCurve } from "./design/Collaboration";
import Section from "./Section";

// Game icons (using external URLs)
const gameIcons = {
  roblox: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Roblox_2021_Logo.svg/1200px-Roblox_2021_Logo.svg.png",
  minecraft: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Minecraft_logo.svg/1200px-Minecraft_logo.svg.png",
  fortnite: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Fortnite_F_lettermark_logo.png/640px-Fortnite_F_lettermark_logo.png",
  unity: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1200px-Unity_Technologies_logo.svg.png",
  unreal: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Unreal_Engine_Logo.svg/1200px-Unreal_Engine_Logo.svg.png",
  gdevelop: "https://wiki.gdevelop.io/wp-content/uploads/2021/04/gdevelop-logo.png"
};

const Collaboration = () => {
  return (
    <Section crosses>
      <div className="container lg:flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Content - Text and Features */}
        <div className="lg:max-w-[30rem] text-center lg:text-left">
          <h2 className="h2 mb-6 md:mb-8 relative inline-block">
            <span className="relative z-10">
              Premium Scripts for Your{' '}
              <span className="text-gradient font-bold">Game Development</span>
            </span>
            <img
              src={curve}
              className="absolute -bottom-2 left-0 w-full xl:-mt-2 pointer-events-none select-none"
              width={624}
              height={28}
              alt="Curve"
            />
          </h2>

          <p className="body-2 mb-8 text-n-4 lg:pr-8">
            {collabText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {collabContent.map((item) => (
              <div 
                className="bg-n-7/50 p-4 rounded-xl border border-n-6 hover:bg-n-7 transition-colors"
                key={item.id}
              >
                <div className="flex items-start">
                  <img
                    src={check}
                    width={20}
                    alt="check"
                    height={20}
                    className="mt-1 flex-shrink-0 pointer-events-none select-none"
                  />
                  <div className="ml-3">
                    <h6 className="body-2 font-medium">{item.title}</h6>
                    {item.text && (
                      <p className="body-2 mt-1 text-n-3">{item.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="mx-auto lg:mx-0">Get Scripts Now</Button>
        </div>

        {/* Right Content - Game Icons Visualization */}
        <div className="relative w-full max-w-[32rem] lg:w-[40rem] aspect-square">
          {/* Central Roblox Icon with Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full bg-n-8 border-2 border-primary/30 flex items-center justify-center">
              <img
                src={gameIcons.roblox}
                width={80}
                height={80}
                alt="Roblox"
                className="rounded-full z-10"
              />
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Rotating Orbit with Game Icons */}
          <div className="absolute inset-0 animate-spin-slow">
            {collabApps.map((app, i) => {
              const angle = (i * 360) / collabApps.length;
              const radius = 10; // rem units
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = Math.cos((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={app.id}
                  className="absolute w-16 h-16 -mt-8 -ml-8"
                  style={{
                    left: `calc(50% + ${x}rem)`,
                    top: `calc(50% - ${y}rem)`,
                  }}
                >
                  <div className="relative w-full h-full bg-n-7 border-2 border-n-6 rounded-xl flex items-center justify-center p-2 hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-primary/20">
                    <img
                      src={gameIcons[app.icon]}
                      alt={app.title}
                      width={app.width}
                      height={app.height}
                      className="object-contain"
                    />
                    <div className="absolute -z-10 inset-0 rounded-xl bg-primary/10 blur-md"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-full border-2 border-n-6/50 opacity-30"></div>
          <div className="absolute inset-4 rounded-full border-2 border-n-6/30 opacity-20"></div>
          <div className="absolute inset-8 rounded-full border-2 border-n-6/10 opacity-10"></div>
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;
