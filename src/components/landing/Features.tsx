"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

import { FolderLock, MessageSquare, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Secure Document Vault",
    description: "Upload and store legal documents with end-to-end encryption and role-based access.",
    icon: FolderLock,
  },
  {
    title: "Real-time Communication",
    description: "Direct chat between lawyers and clients with integrated file sharing and notifications.",
    icon: MessageSquare,
  },
  {
    title: "Case Timeline Tracking",
    description: "Visual status updates for every case, from initial filing to final resolution.",
    icon: Clock,
  },
  {
    title: "Role-Based Dashboards",
    description: "Custom interfaces for Clients, Lawyers, and Admins to manage their specific tasks.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-8">

        {/* SECTION TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage cases
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            LegalEase+ provides a comprehensive suite of tools designed to simplify 
            the complex world of legal management.
          </p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                
                <CardHeader>
                  {/* ICON */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>

                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>

              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}