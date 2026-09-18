import ContactChannels from "./ContactChannels";
import { Clock, PhoneCall, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";

export default function ContactLeft() {
  return (
    <div className="max-w-2xl">
      <span className="eyebrow">Get In Touch</span>

      <h2 className="section-title mt-4">
        Any question? Feel free
        <br /> to <span className="text-gradient">contact us</span>
      </h2>

      <div>
        <span className="brand-divider" />
      </div>

      <p className="mt-6 leading-relaxed text-ink-500">
        We&apos;re based in Dhaka, Bangladesh and serve clients across the globe.
        Get in touch via any channel below, or send a project inquiry and we&apos;ll
        reply within 24 hours.
      </p>

      <ContactChannels />

      <div className="mt-8 grid gap-6 sm:flex sm:items-center sm:gap-12">
        <div className="flex items-center gap-3 text-ink-800">
          <span className="icon-well">
            <ArrowRight className="h-5 w-5" />
          </span>
          <span className="font-semibold">Reply within 24 hours</span>
        </div>

        <div className="flex items-center gap-3 text-ink-800">
          <span className="icon-well">
            <Clock className="h-5 w-5" />
          </span>
          <span className="font-semibold">24 hrs telephone support</span>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary text-white shadow-[var(--shadow-brand)]">
          <PhoneCall className="h-8 w-8" />
        </div>
        <div>
          <p className="font-semibold text-ink-700">Call to ask any question</p>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="mt-1 block text-lg font-extrabold text-ink-900 sm:text-xl"
          >
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
