import { Variants } from "motion/react";

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    paymentLink:'https://buy.stripe.com/test_fZu7sNbp14M28Lj1N4grS00',
    priceId:'price_1TlpTDRwcoe7RzdZ4RJ0jqCO',
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
    ],
    paymentLink: 'https://buy.stripe.com/test_cNi28tfFhbaqf9H63kgrS01',
    priceId: 'price_1TlpX4Rwcoe7RzdZr7esGJFw',
  },
];

export const containerVariants: Variants = {
  hidden:{opacity:0},
  visible : {
    opacity :1,
    transition:{
      staggerChildren:0.2,
      delayChildren:0.1,
    }
  }
}

export const itemVariants: Variants = {
  hidden:{opacity:0 , y:20},
  visible : {
    opacity :1,
    transition:{
      type:'spring',
      damping:15,
      stiffness:50,
      duration:0.8,
    }
  }
}

export const buttonVariants= {
  scale:1.05,
    transition:{
      type:'spring' as const,
      damping:10,
      stiffness:300,
    }
}

export const listVariants: Variants ={
  hidden:{opacity:0,x:-20},
  visible:{
    opacity:1,
    x:0,
    transition:{
      type:'spring',
      damping:20,
      stiffness:100,
    }
  }
}

export const Dummy_Summary = {
  title: "Key Highlights",
  subtitle: "Important points from this document",
  points: [
    "Extracted the most relevant information",
    "Time-saving AI processing",
    "Accurate and concise summary",
    "Easy to understand and read",
  ],
};