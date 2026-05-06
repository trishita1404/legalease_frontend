"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Secure & Encrypted Legal Management</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-black leading-tight"
          >
            Manage Your Cases with <br />
            <span className="text-gray-600">
              Absolute Precision
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            The all-in-one platform for Lawyers and Clients. Streamline case
            filing, secure document sharing, and real-time communication in one
            professional dashboard.
          </motion.p>

        </div>
      </div>
    </section>
  );
}