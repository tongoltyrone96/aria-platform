import { motion } from "motion/react";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Candidates using Aria land offers 40 to 60% more often",
  "The right answer appears on your screen the instant a question is asked",
  "Undetectable across Zoom, Google Meet, Teams, and every major platform",
  "Covers technical, behavioral, case, and competency interviews in full",
  "Answers tailored to your résumé and the exact job description you uploaded",
  "Post-session breakdown shows exactly where to improve and how",
];

const useCases = [
  {
    title: "Active Job Seekers",
    description: "Whether you're targeting FAANG engineering roles or fast-growing startups, Aria adapts to any format and delivers the precise answers that move you to the offer stage.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "Career Changers",
    description: "Stepping into a new industry means facing questions you have never rehearsed. Aria reframes your existing experience into compelling, role-relevant answers that land.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "New Graduates",
    description: "Turn limited experience into a winning story. Aria coaches you through live interviews and practice sessions so you walk into your first big opportunity fully prepared.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text + checklist */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-normal">Land the Job You Deserve</h2>
              <p className="text-lg text-muted-foreground">
                Every interview is a high-stakes moment. Aria makes sure you show up prepared, sharp, and ready to close.
              </p>
            </div>
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.07 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: use case cards */}
          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 shrink-0 self-stretch relative min-h-[12rem]">
                      <ImageWithFallback src={useCase.image} alt={useCase.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <h3 className="text-xl mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
