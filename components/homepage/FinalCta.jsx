"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/components/ui/motion";
import SectionShell from "@/components/layouts/SectionShell";

export default function FinalCta({ surface = "bg-sage" }) {
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <h2 className="section-title text-[clamp(1.8rem,1.2rem+2.3vw,2.85rem)] font-extrabold leading-[1.12] tracking-tight">
            Ready to build something great?
          </h2>
          <p className="mt-4 text-lg font-semibold text-accent sm:text-xl">
            Let’s Turn Your Ideas Into Impact
          </p>
          <Link href="/contact" className="btn btn-primary mt-8">
            Get Started
            <ArrowRight size={16} className="btn-icon" />
          </Link>
        </motion.div>
      </SectionShell>
    </section>
  );
}
