"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function isEditorPath(pathname) {
  return /^\/admin\/[^/]+\/(new|\d+)/.test(pathname || "");
}

function isListPath(pathname) {
  return /^\/admin\/[a-z]+$/.test(pathname || "");
}

function sameSection(from, to) {
  const a = (from || "").split("/")[2];
  const b = (to || "").split("/")[2];
  return Boolean(a && a === b);
}

export default function AdminFeedback() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    if (isEditorPath(from) && isListPath(pathname) && sameSection(from, pathname)) {
      setMessage("Changes saved.");
    }
  }, [pathname]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="border-b border-primary/15 bg-primary-light px-4 py-2 text-sm font-semibold text-primary sm:px-6 lg:px-8"
    >
      {message}
    </div>
  );
}
