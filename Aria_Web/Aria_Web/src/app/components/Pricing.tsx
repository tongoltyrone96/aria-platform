import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free", price: "$0", period: "forever",
    description: "Try Aria with no commitment",
    features: [
      "Multiple users can share one account simultaneously",
      "10 interview calls / month", "6 AI answers per call",
      "1 live coding session / month", "Premium WASAPI audio capture",
      "State-of-the-art AI models", "AI assistant overlay",
      "Multi-user simultaneous access",
    ],
    isPopular: false, cta: "Start Free Trial",
  },
  {
    id: "pro",
    name: "Pro", price: "$19.99", period: "per month",
    description: "Unlimited access for serious job seekers",
    features: [
      "Multiple users can share one account simultaneously",
      "70 interview calls / month", "Unlimited AI answers per call",
      "50 live coding sessions / month", "Premium WASAPI audio capture",
      "State-of-the-art AI models", "Advanced AI overlay",
      "Multi-user simultaneous access",
      "STAR-method coaching mode", "Priority support",
    ],
    isPopular: true, cta: "Get Pro Access",
  },
  {
    id: "elite",
    name: "Elite", price: "$29.99", period: "per month",
    description: "For power users & teams.",
    features: [
      "Multiple users can share one account simultaneously",
      "150 interview calls / month", "Unlimited AI answers per call",
      "100 live coding sessions / month", "Premium WASAPI audio capture",
      "State-of-the-art AI models", "Advanced AI overlay",
      "Multi-user simultaneous access",
      "STAR-method coaching mode", "Code-question deep analysis",
      "Early access to new features", "Dedicated support",
    ],
    isPopular: false, cta: "Get Elite Access",
  },
];

export function Pricing() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem("aria_authed") === "1");

  useEffect(() => {
    const syncAuth = () => setIsAuthed(localStorage.getItem("aria_authed") === "1");

    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const getPlanHref = (planId: string) => {
    if (!isAuthed) return `/signup?plan=${planId}`;
    return planId === "free" ? "/dashboard" : `/checkout?plan=${planId}`;
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Simple, Honest Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Start free, upgrade when you're ready. Paid plans continue through Stripe Checkout after signup.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.12 }}
            >
              <Card
                className={`relative h-full transition-all duration-300 ${
                  hoveredIndex === index
                    ? "border-primary shadow-lg scale-105"
                    : hoveredIndex !== null
                    ? "border-border/50 scale-95 opacity-70"
                    : plan.isPopular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border/50"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    <Zap className="w-3 h-3 mr-1" />Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-lg font-normal text-muted-foreground"> / {plan.period}</span>
                    </div>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, fi) => (
                      <div key={fi} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className={`w-full cursor-pointer transition-colors duration-200 ${
                      hoveredIndex === index
                        ? "bg-black hover:bg-black/80 text-white border-0"
                        : plan.isPopular && hoveredIndex === null
                        ? "bg-black hover:bg-black/80 text-white border-0"
                        : "hover:bg-black hover:text-white hover:border-black"
                    }`}
                    variant={plan.isPopular && hoveredIndex === null ? "default" : hoveredIndex === index ? "default" : "outline"}
                    size="lg"
                  >
                    <Link to={getPlanHref(plan.id)}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-muted-foreground">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {["Windows desktop app", "Offline support", "No account required for Free", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
