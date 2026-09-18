"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Rocket, X } from "lucide-react";

export default function ActiveDepartment({ department, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card relative mx-auto section-stack max-w-4xl overflow-hidden px-5 py-8 sm:px-10 sm:py-12"
    >
      <button
        type="button"
        onClick={onClose}
        className="icon-btn absolute right-4 top-4 h-10 w-10"
        aria-label="Close department details"
      >
        <X size={18} />
      </button>

      <div className="mb-10 pr-10 text-center sm:pr-0">
        <h3 className="text-2xl font-extrabold text-primary sm:text-3xl">
          {department.name}
        </h3>
        <p className="mt-2 text-base text-ink-500 sm:text-lg">
          {department.description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        <div className="flex flex-col items-center">
          {department.director?.photo ? (
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary/10 shadow-[var(--shadow-md)]">
              <Image
                src={department.director.photo}
                alt={department.director.name || department.name}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full border-4 border-primary/10 bg-surface-muted" />
          )}
          {department.director?.name ? (
            <>
              <h4 className="mt-4 text-xl font-bold text-ink-800">
                {department.director.name}
              </h4>
              <p className="text-sm text-ink-500">Director</p>
            </>
          ) : null}
        </div>

        <div className="grid w-full flex-1 grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h5 className="mb-3 text-lg font-bold text-primary">
              Department Roles
            </h5>
            <ul className="space-y-2 text-ink-700">
              {(department.roles || []).map((role) => (
                <li
                  key={role}
                  className="flex items-center gap-2 rounded-lg bg-primary/[0.06] px-3 py-2 text-sm"
                >
                  <Check size={16} className="shrink-0 text-primary" aria-hidden />
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-3 text-lg font-bold text-accent-deep">
              Key Productions
            </h5>
            <ul className="space-y-2 text-ink-700">
              {(department.productions || []).map((prod) => (
                <li
                  key={prod}
                  className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm"
                >
                  <Rocket size={16} className="shrink-0 text-accent-deep" aria-hidden />
                  {prod}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
