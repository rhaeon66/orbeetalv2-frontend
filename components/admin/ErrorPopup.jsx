"use client";

import { X } from "lucide-react";

export default function ErrorPopup({ messages, onClose }) {
  if (!messages?.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-40 px-4 sm:px-6 lg:left-64 lg:px-8">
      <div
        className="alert-error pointer-events-auto mx-auto flex max-w-3xl items-start gap-3 shadow-lg"
        role="alert"
      >
        <div className="min-w-0 flex-1 space-y-1">
          {messages.map((message, index) => (
            <p key={`${message}-${index}`}>{message}</p>
          ))}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 hover:bg-black/5"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
