import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  file02,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  plusSquare,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  sliders04,
  telegram,
  twitter,
  yourlogo,
  verificon,
} from "../assets";
import { links } from "../config";

// External game icons URLs
const gameIcons = {
  roblox: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Roblox_%282025%29_%28App_Icon%29.svg",
  minecraft: "https://upload.wikimedia.org/wikipedia/commons/6/64/Minecraft-creeper-face.svg",
  fortnite: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png",
  unity: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Unity_5_logo.svg",
  unreal: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Unreal_Engine_4_logo_and_wordmark.svg",
  gdevelop: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Godot_logo_reimagined_vertical.svg"
};

export const navigation = [
  {
    id: "0",
    title: "Home",
    url: "#hero",
  },
  {
    id: "2",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Pricing",
    url: "#pricing",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "#roadmap",
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Auto Farming",
  "Anti-Ban Protection",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Game Detection",
    text: "Automatically detect the game you're playing and suggest optimal scripts for your session.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Performance Mode",
    text: "New optimization system to reduce resource usage while running scripts in the background.",
    date: "June 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Script Marketplace",
    text: "Community-driven marketplace where users can share and sell their custom scripts.",
    date: "July 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Cross-Game Support",
    text: "Expand script compatibility to support more popular games and platforms.",
    date: "August 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With smart automation and undetectable scripts, our solutions give you the competitive edge in your favorite games.";

export const collabContent = [
  {
    id: "0",
    title: "Undetectable",
    text: collabText,
  },
  {
    id: "1",
    title: "Auto-Updating",
  },
  {
    id: "2",
    title: "24/7 Support",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Roblox",
    icon: gameIcons.roblox,
    width: 26,
    height: 26,
  },
  {
    id: "1",
    title: "Minecraft",
    icon: gameIcons.minecraft,
    width: 26,
    height: 26,
  },
  {
    id: "2",
    title: "Fortnite",
    icon: gameIcons.fortnite,
    width: 26,
    height: 26,
  },
  {
    id: "3",
    title: "Unity",
    icon: gameIcons.unity,
    width: 26,
    height: 26,
  },
  {
    id: "4",
    title: "Unreal",
    icon: gameIcons.unreal,
    width: 26,
    height: 26,
  },
  {
    id: "5",
    title: "GDevelop",
    icon: gameIcons.gdevelop,
    width: 26,
    height: 26,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "Essential scripts for beginners",
    price: "0",
    features: [
      "Access to basic scripts",
      "Community support",
      "Limited script execution time",
    ],
    premium: false,
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced scripts with auto-update",
    price: "125000",
    features: [
      "All basic features",
      "Premium scripts access",
      "Auto-update functionality",
      "Priority support",
    ],
    premium: true,
  },
  {
    id: "2",
    title: "Developer",
    description: "For script creators and power users",
    price: "245000",
    features: [
      "All premium features",
      "Early access to new scripts",
      "Script development tools",
      "Custom script requests",
    ],
    premium: true,
  },
];

export const benefits = [
  {
    id: "0",
    title: "Powerful Scripts",
    text: "Our scripts are engineered for maximum performance and minimal detection. Each script is optimized to give you the edge in your favorite games.",
    backgroundUrl: "/src/assets/benefits/card-1.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Easy Access",
    text: "Get instant access to all scripts through our website or Discord server. Compatible with multiple platforms and always up-to-date.",
    backgroundUrl: "/src/assets/benefits/card-2.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Regular Updates",
    text: "We continuously update our scripts to bypass the latest game patches and anti-cheat systems, ensuring uninterrupted performance.",
    backgroundUrl: "/src/assets/benefits/card-3.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Simple Setup",
    text: "Our scripts feature one-click installation and intuitive interfaces, making them accessible even for beginners.",
    backgroundUrl: "/src/assets/benefits/card-4.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Active Community",
    text: "Join thousands of users in our community to share configurations, get help, and stay updated on the latest developments.",
    backgroundUrl: "/src/assets/benefits/card-5.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "24/7 Support",
    text: "Our support team is available around the clock to help with any issues or questions you might have.",
    backgroundUrl: "/src/assets/benefits/card-6.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "https://dsc.gg/qarvo",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];
