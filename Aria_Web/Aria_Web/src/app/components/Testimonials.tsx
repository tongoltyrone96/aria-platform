import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Kevin Park", role: "Software Engineer", company: "Hired at Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "I had failed three FAANG rounds before I found Aria. What I love about it is how it listens in real time and surfaces exactly what you need right when you need it. On my fourth attempt I walked out of the system design round knowing I had nailed it. The offer came two days later.",
    rating: 5,
  },
  {
    name: "Mia Thornton", role: "Product Manager", company: "Career change from Teaching",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "Aria is brilliant at taking what you already know and turning it into something an interviewer wants to hear. It reframed my five years in teaching into PM-ready stories I never would have thought of on my own. I went from feeling like an outsider to landing a role I genuinely love.",
    rating: 5,
  },
  {
    name: "Daniel Cruz", role: "Data Analyst", company: "Hired at Stripe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "The behavioral mode genuinely surprised me. It pulled real stories from my experience bank and structured them so well that I sounded more polished than I ever had in practice. I did not blank once. Every answer landed and I got the Stripe offer I had been chasing for a year.",
    rating: 5,
  },
  {
    name: "Aisha Rahman", role: "Frontend Developer", company: "New grad, hired at Shopify",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "Aria made me sound like I had been working for years. As a fresh grad I always froze the moment a tough question came up, but Aria was right there giving me exactly what to say. The confidence I felt in that interview was something I had never experienced before. I got my dream job.",
    rating: 5,
  },
  {
    name: "James Okafor", role: "Solutions Architect", company: "Hired at AWS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "What impressed me most was how well Aria handled deep technical questions. It did not just give generic answers, it gave precise, contextual responses that matched the level of the interview. I felt supported throughout without ever feeling like I was cheating. AWS made the call the next morning.",
    rating: 5,
  },
  {
    name: "Sophie Leblanc", role: "UX Designer", company: "Career change from Finance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "The post-session feedback alone is worth it. After every practice run Aria showed me exactly where I hesitated, where I overexplained, and what to fix. I could see myself improving week by week. Six weeks after I started using it seriously I had three offers on the table.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Real People. Real Offers.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            See how candidates are using Aria to walk into interviews prepared and walk out with offers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.1 }}
            >
              <Card className="h-full border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role} · {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
