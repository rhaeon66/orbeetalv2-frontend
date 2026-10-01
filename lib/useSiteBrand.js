"use client";

import { SITE } from "@/lib/site";
import { useGetSiteQuery } from "@/redux/features/cms/siteApi";

function telHref(phone) {
  const compact = String(phone || "").replace(/[^\d+]/g, "");
  return compact || SITE.phoneTel;
}

function whatsappHref(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : SITE.whatsapp;
}

export function useSiteBrand() {
  const { data } = useGetSiteQuery();
  const email = data?.email || SITE.email;
  const phone = data?.phone || SITE.phoneDisplay;
  const website = data?.website || "www.orbeetal.com";
  return {
    logo: data?.logo || "",
    email,
    phone,
    website,
    phoneTel: telHref(phone),
    whatsapp: whatsappHref(phone),
  };
}
