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
      <div className="container lg:flex">
        <div className="max-w-[25rem]">
          <h2 className="h2 mb-4 md:mb-8">
            Premium Scripts for Your
            <span className="inline-block relative font-semibold">
              Game Development
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h2>

          <ul className="max-w-[22rem] mb-10 md:mb-14">
            {collabContent.map((item) => (
              <li className="mb-3 py-3" key={item.id}>
                <div className="flex items-center">
                  <img
                    src={check}
                    width={24}
                    alt="check"
                    height={24}
                    className="pointer-events-none select-none"
                  />
                  <h6 className="body-2 ml-5">{item.title}</h6>
                </div>

                {item.text && (
                  <p className="body-2 mt-3 text-n-4">{item.text}</p>
                )}
              </li>
            ))}
          </ul>

          <Button>Get Scripts Now</Button>
        </div>

        <div className="lg:ml-auto xl:w-[38rem] mt-4">
          <p className="body-2 mb-4 text-n-4 md:mb-16 lg:mb-32 lg:w-[32rem] lg:mx-auto">
            {collabText}
          </p>

          <div className="relative left-1/2 flex w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale-75 md:scale-100">
            <div className="flex w-60 aspect-square m-auto border border-n-6 rounded-full">
              <div className="w-[6rem] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                  <img
                    src={gameIcons.roblox}
                    width={48}
                    height={48}
                    alt="Roblox"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <ul>
              {collabApps.map((app, i) => (
                <li
                  key={app.id}
                  className={`absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom rotate-${
                    i * 45
                  }`}
                >
                  <div
                    className={`relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-n-1/15 rounded-xl -rotate-${
                      i * 45
                    } animate-pulse`}
                  >
                    <img
                      src={gameIcons[app.icon]}
                      alt={app.title}
                      width={app.height}
                      height={app.height}
                      className="m-auto object-contain p-1"
                    />
                  </div>
                </li>
              ))}
            </ul>

            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;
