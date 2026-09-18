"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Mail, Briefcase, Award, Building2, Users, Sparkles } from "lucide-react";
import { useEffect } from "react";

// Backdrop animation
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

// Modal animation
const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 50,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: { duration: 0.2 }
    },
};

// Content item animation
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

export default function TeamMemberModal({ member, isOpen, onClose }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!member) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-sage/75 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.25rem] bg-cream shadow-[var(--shadow-lg)]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient background */}
                        <div className="relative h-32 overflow-hidden rounded-t-[1.25rem] bg-gradient-to-br from-primary-soft via-primary to-primary-deep sm:h-40">
                            {/* Decorative elements */}
                            <div className="absolute inset-0 opacity-25">
                                <div className="absolute top-4 left-4 w-20 h-20 bg-accent rounded-full blur-2xl" />
                                <div className="absolute bottom-4 right-4 w-32 h-32 bg-accent/60 rounded-full blur-3xl" />
                            </div>

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="icon-btn icon-btn-light absolute right-4 top-4 h-10 w-10"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Department badge */}
                            {member.department && (
                                <motion.div
                                    variants={itemVariants}
                                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full"
                                >
                                    <Building2 className="w-4 h-4 text-white" />
                                    <span className="text-sm font-medium text-white">{member.department.name}</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Profile image - overlapping header */}
                        <div className="relative -mt-16 sm:-mt-20 px-6">
                            <motion.div
                                variants={itemVariants}
                                className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full ring-4 ring-white shadow-xl overflow-hidden"
                            >
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    quality={95}
                                />
                            ) : null}
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-8 pt-4">
                            {/* Name and role */}
                            <motion.div variants={itemVariants} className="text-center mb-6">
                                <h2 className="mb-1 text-2xl font-bold text-ink-900 sm:text-3xl">
                                    {member.name}
                                </h2>
                                <p className="text-primary font-semibold text-lg">{member.role}</p>
                            </motion.div>

                            {/* Bio */}
                            {member.bio && (
                                <motion.div variants={itemVariants} className="mb-6">
                                    <p className="text-center leading-relaxed text-ink-500">
                                        {member.bio}
                                    </p>
                                </motion.div>
                            )}

                            {/* Stats row */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-6 grid grid-cols-3 gap-4 rounded-[1.25rem] bg-surface-muted p-4"
                            >
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{member.experience}+</p>
                                    <p className="mt-1 text-xs text-ink-500">Years Exp.</p>
                                </div>
                                <div className="border-x border-line text-center">
                                    <p className="text-2xl font-bold text-primary">{member.projects}+</p>
                                    <p className="mt-1 text-xs text-ink-500">Projects</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{member.expertise?.length || 0}</p>
                                    <p className="mt-1 text-xs text-ink-500">Expertise</p>
                                </div>
                            </motion.div>

                            {/* Expertise */}
                            {member.expertise && member.expertise.length > 0 && (
                                <motion.div variants={itemVariants} className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold text-ink-900">Expertise</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {member.expertise.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-primary/5 text-primary text-sm font-medium rounded-full border border-primary/10"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Department Info */}
                            {member.department && (
                                <motion.div
                                    variants={itemVariants}
                                    className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold text-ink-900">Department Role</h3>
                                    </div>

                                    <p className="mb-4 text-sm text-ink-500">
                                        {member.department.description}
                                    </p>

                                    {/* Roles in department */}
                                    {member.department.roles && (
                                        <div className="mb-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                                                Key Responsibilities
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {member.department.roles.map((role, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-lg bg-pale px-2.5 py-1 text-xs font-medium text-ink-700 shadow-sm"
                                                    >
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Productions */}
                                    {member.department.productions && (
                                        <div>
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                                                Notable Contributions
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {member.department.productions.map((prod, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg"
                                                    >
                                                        {prod}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {member.email && (
                            <motion.div variants={itemVariants} className="mt-6 flex justify-center">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="btn btn-primary"
                                >
                                    <Mail className="w-5 h-5" />
                                    Get in Touch
                                </a>
                            </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
