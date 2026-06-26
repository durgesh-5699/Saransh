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
    paymentLink: process.env.NODE_ENV==='development' ? 'https://buy.stripe.com/test_fZu7sNbp14M28Lj1N4grS00':'',
    priceId: process.env.NODE_ENV==='development'?'price_1TlpTDRwcoe7RzdZ4RJ0jqCO':'',
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
    paymentLink: process.env.NODE_ENV==='development' ? 'https://buy.stripe.com/test_cNi28tfFhbaqf9H63kgrS01':'',
    priceId: process.env.NODE_ENV==='development' ? 'price_1TlpX4Rwcoe7RzdZr7esGJFw':'',
  },
];