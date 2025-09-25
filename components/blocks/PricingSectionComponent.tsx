'use client';

import { Sparkles, Zap, ChartBar as BarChart3, Users, Code, ShieldCheck, Upload, Download } from "lucide-react";
import { PricingSection } from "@/components/blocks/pricing-section";

const defaultTiers = [
  {
    name: "Starter",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Perfect for new stores and basic affiliate needs",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-500/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-gray-500 dark:text-gray-400" />
      </div>
    ),
    features: [
      {
        name: "Basic Store Customization",
        description: "Essential branding and layout options",
        included: true,
      },
      {
        name: "Product Management",
        description: "Add and manage affiliate products",
        included: true,
      },
      {
        name: "Promotional Slides",
        description: "Create basic slides for your homepage",
        included: true,
      },
      {
        name: "Email Subscriptions",
        description: "Collect subscriber emails from visitors",
        included: true,
      },
      {
        name: "Advanced Analytics",
        description: "Detailed user interactions and insights",
        included: false,
      },
      {
        name: "CSV Import/Export",
        description: "Bulk product management and data export",
        included: false,
      },
      {
        name: "Custom HTML Support",
        description: "Inject custom HTML for unique elements",
        included: false,
      },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 39,
      yearly: 399,
    },
    description: "Ideal for growing businesses and advanced features",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <Sparkles className="w-7 h-7 relative z-10 text-yellow-500 dark:text-yellow-400" />
      </div>
    ),
    features: [
      {
        name: "Advanced Store Customization",
        description: "Full branding, fonts, colors, and layout options",
        included: true,
      },
      {
        name: "Unlimited Product Management",
        description: "Add and manage unlimited affiliate products",
        included: true,
      },
      {
        name: "Advanced Promotional Features",
        description: "Unlimited slides, widgets, and banners",
        included: true,
      },
      {
        name: "Email Subscriptions",
        description: "Advanced subscriber management and export",
        included: true,
      },
      {
        name: "Comprehensive Analytics",
        description: "Detailed user interactions, product performance, and insights",
        included: true,
      },
      {
        name: "CSV Import/Export",
        description: "Bulk import products and export subscriber data",
        included: true,
      },
      {
        name: "Custom HTML Support",
        description: "Inject custom HTML for unique store elements",
        included: true,
      },
      {
        name: "Priority Support",
        description: "Dedicated support for quick resolutions",
        included: true,
      },
    ],
  },
];

export function PricingSectionComponent() {
  return <PricingSection tiers={defaultTiers} />;
}