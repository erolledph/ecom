'use client';

import { HeroWithMockup } from "@/components/blocks/hero-with-mockup";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <HeroWithMockup
      title="Build Your Affiliate Store, Effortlessly"
      description="Create and customize your own affiliate store to showcase products and earn commissions. No coding required."
      primaryCta={{
        text: "Get Started for Free",
        href: "/auth",
      }}
      secondaryCta={{
        text: "Learn More",
        href: "#pricing",
        icon: <ArrowRight className="mr-2 h-4 w-4" />,
      }}
      mockupImage={{
        alt: "Affiliate Store Dashboard",
        width: 1248,
        height: 765,
        src: "https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }}
    />
  );
}