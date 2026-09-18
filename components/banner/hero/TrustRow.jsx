"use client";

import Image from "next/image";
import { useGetPublishedClientsQuery } from "@/redux/features/cms/clientsApi";

const FALLBACK = ["A", "B", "C", "D"];

export default function TrustRow() {
  const { data: clients = [] } = useGetPublishedClientsQuery();
  const logos = clients.filter((item) => item.logo).slice(0, 4);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2" aria-hidden>
        {logos.length
          ? logos.map((client) => (
              <div
                key={client.id}
                className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-cream bg-pale"
              >
                <Image
                  src={client.logo}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                />
              </div>
            ))
          : FALLBACK.map((letter) => (
              <div
                key={letter}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-pale text-[10px] font-bold text-primary"
              >
                {letter}
              </div>
            ))}
      </div>
      <p className="text-sm text-ink-500">
        Trusted by{" "}
        <span className="font-semibold text-ink-800">50+ businesses</span>{" "}
        worldwide
      </p>
    </div>
  );
}
