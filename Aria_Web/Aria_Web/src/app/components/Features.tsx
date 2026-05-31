import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Mic, Lightbulb, Brain, Activity, Calendar, FileText, Code2, Users, EyeOff } from "lucide-react";

const features = [
  { icon: Lightbulb, title: "Real-Time Answer Suggestions", description: "Aria listens as questions are asked and instantly surfaces relevant, tailored answers right on your screen." },
  { icon: Mic, title: "Live Auto Transcription", description: "Captures both sides of the conversation in real time. Review the full transcript during or after your session." },
  { icon: Brain, title: "Question Prediction", description: "AI anticipates likely follow-up questions based on the conversation flow, keeping you one step ahead." },
  { icon: Activity, title: "Confidence Coach", description: "Real-time feedback on speaking pace, filler words, and vocal patterns to keep your delivery sharp." },
  { icon: Calendar, title: "Interview Scheduler", description: "Pre-configure your settings and JD for upcoming interviews and save them. Enter your next session in one click." },
  { icon: FileText, title: "Job Description Sync", description: "Upload the JD before your interview and Aria tailors every suggestion to match the role's requirements." },
  { icon: Code2, title: "Technical Interview Mode", description: "In-depth support for coding challenges, system design, and algorithm problems within your personal workspace." },
  { icon: Users, title: "Behavioral Interview Mode", description: "Structured story suggestions for competency-based questions using your own experience bank." },
  { icon: EyeOff, title: "Private Display Mode", description: "Displays AI guidance exclusively on your personal screen. Your video call and shared workspace remain completely unaffected." },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Everything You Need to Land the Offer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Aria works silently in the background, giving you the right words at the right moment across every format and industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-border transition-colors">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F05A28" }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
