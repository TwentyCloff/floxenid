export const pricing = [
  {
    id: "premium_project_1",  // Must match Firebase document ID
    title: "Premium Plan",
    description: "Full access to all premium features and priority support",
    price: 99,
    premium: true,
    features: [
      "All free features included",
      "Priority customer support",
      "Advanced analytics dashboard",
      "Custom branding options",
      "API access",
      "Early access to new features"
    ]
  },
  {
    id: "free_project_1", 
    title: "Free Plan",
    description: "Great for getting started with basic features",
    price: 0,
    premium: false,
    features: [
      "Basic feature set",
      "Community support",
      "Up to 3 projects",
      "Standard templates",
      "Email notifications"
    ]
  },
  {
    id: "coming_soon_1",
    title: "Enterprise Plan",
    description: "Custom solutions for large organizations",
    price: null,  // null price shows "Contact us" button
    features: [
      "Everything in Premium",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "On-premise deployment",
      "Training sessions"
    ]
  }
];

// Additional constants you might use
export const categories = [
  { id: "all", name: "All" },
  { id: "free", name: "Free" },
  { id: "premium", name: "Premium" },
  { id: "coming_soon", name: "Coming Soon" }
];

export const pricingFaq = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade at any time."
  },
  {
    question: "Is there a free trial?",
    answer: "Our free plan is always available with no trial period needed."
  },
  {
    question: "How is billing handled?",
    answer: "We accept all major credit cards and invoice billing for annual plans."
  }
];

export const featureComparison = {
  headers: ["Feature", "Free", "Premium", "Enterprise"],
  rows: [
    ["Projects", "3", "Unlimited", "Unlimited"],
    ["Support", "Community", "Priority", "Dedicated"],
    ["Storage", "5GB", "50GB", "Custom"],
    ["API Access", "Limited", "Full", "Full + Custom"]
  ]
};
