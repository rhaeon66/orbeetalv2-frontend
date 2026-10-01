"use client";

import Image from "next/image";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";

export default function TrustRow() {
  const { data } = useGetPublishedHomepageQuery();
  const logos = data?.trust_logos || [];

  return (
    <div className="flex items-center gap-1.5">
      {logos.length > 0 ? (
        <div className="flex items-center gap-1">
          {logos.map((client) => (
            <div
              key={client.id}
              className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-ink-800 bg-pale"
              title={client.name}
            >
              <Image
                src={client.logo}
                alt=""
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            </div>
          ))}
        </div>
      ) : null}
      <p className="text-sm text-ink-500">
        Trusted by{" "}
        <span className="font-semibold text-ink-800">50+ businesses</span>{" "}
        worldwide
      </p>
    </div>
  );
}
