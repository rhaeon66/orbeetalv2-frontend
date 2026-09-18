"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DepartmentCard({ dept, onClick }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      className="card card-hover group flex cursor-pointer flex-col items-center p-6 text-center"
      onClick={onClick}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/[0.07] transition-colors group-hover:bg-primary/[0.12]">
        {dept.icon ? (
          <Image
            src={dept.icon}
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        ) : null}
      </div>
      <h3 className="text-lg font-bold text-ink-800 transition-colors group-hover:text-primary">
        {dept.name}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
        {dept.description}
      </p>
    </motion.button>
  );
}
