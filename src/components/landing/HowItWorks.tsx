"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    role: "For Clients",
    title: "Submit Your Case",
    description: "Fill out a simple form detailing your legal needs and upload relevant documents securely.",
  },
  {
    role: "For Lawyers",
    title: "Review & Accept",
    description: "Qualified lawyers review the case details and accept the request to begin consultation.",
  },
  {
    role: "Collaborate",
    title: "Manage & Resolve",
    description: "Communicate via secure chat, track milestones, and manage documents until resolution.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Streamlined Legal Workflow
          </h2>
          <p className="mt-4 text-muted-foreground">
            From first contact to final resolution, we make the process transparent.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">

          {/* Animated vertical line */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute left-4 md:left-1/2 w-0.5 bg-border -translate-x-1/2 hidden md:block"
          />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* DOT */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 hidden md:block"
                  />

                  {/* CARD */}
                  <div className="w-full md:w-1/2 p-6">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`p-8 rounded-2xl border bg-card shadow-sm hover:shadow-lg hover:border-primary/50 transition-all ${
                        isLeft ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                        {step.role}
                      </span>

                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2 justify-start md:justify-normal">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {step.title}
                      </h3>

                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  <div className="md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}