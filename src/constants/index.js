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
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
  verificon,
} from "../assets";
import { links } from "../config";

export const navigation = [
  {
    id: "0",
    title: "Home",
    url: "#Hero",
  },
  {
    id: "1",
    title: "Pricing",
    url: "#pricing",
  },
  {
    id: "2",
    title: "How to use",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "#roadmap",
  },
  {
    id: "4",
    title: "Source Code",
    url: links.sourceCode,
    onlyMobile: true,
    external: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
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
    title: "Voice recognition",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Gamification",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Chatbot customization",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter.";

export const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
    premium: false,
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "125000",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
    premium: true,
  },
  {
    id: "1",
    title: "Rich",
    description: "Beta test access",
    price: "245000",
    features: [
      "Dapat mengakses fitur update lebih awal",
      "Mendapatkan Custom Avatar di tampilan GUI",
      "Priority support to solve issues quickly",
    ],
    premium: true,
  },
];

export const benefits = [
  {
    id: "0",
    title: "Advanced Capabilities",
    text: "Qarvo delivers cutting-edge tools engineered for peak performance. Each solution is built to enhance your efficiency, automate tasks, and give you a tactical advantage—no matter the environment.",
    backgroundUrl: "/src/assets/benefits/card-1.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Seamless Accessibility",
    text: "Access all Qarvo products instantly through our official website or Discord server. With support across multiple platforms, your toolkit is always within reach—anytime, anywhere.",
    backgroundUrl: "/src/assets/benefits/card-2.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Continuous Innovation",
    text: "While others rely on outdated or patched methods, Qarvo continuously evolves. Our tools receive frequent updates to adapt to the latest game versions, bypass systems, and user needs.",
    backgroundUrl: "/src/assets/benefits/card-3.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Effortless Configuration",
    text: "Designed for mobility and speed, Qarvo products include guided setup processes, modular features, and customization options to fit your workflow across all devices.",
    backgroundUrl: "/src/assets/benefits/card-4.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Connected Community",
    text: "Join a thriving network of developers, power users, and automation experts. Share configurations, collaborate on builds, and trade earned assets through our secure, community-driven platform.",
    backgroundUrl: "/src/assets/benefits/card-5.svg",
    iconUrl: verificon,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "24/7 Expert Support",
    text: "Our dedicated support team is available around the clock to assist with technical issues, script optimization, and advanced module configurations—ensuring you're always at peak performance.",
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
