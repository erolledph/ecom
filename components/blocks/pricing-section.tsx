"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface PricingTier {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: Feature[]
  highlight?: boolean
  badge?: string
  icon: React.ReactNode
}

interface PricingSectionProps {
  tiers: PricingTier[]
  className?: string
}

function PricingSection({ tiers, className }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)

  const buttonStyles = {
    default: cn(
      "h-14 bg-white border-2 border-gray-300",
      "hover:bg-gray-50 hover:border-gray-400",
      "text-gray-900",
      "shadow-lg hover:shadow-xl",
      "text-base font-semibold",
      "transition-all duration-300 hover:scale-105"
    ),
    highlight: cn(
      "h-14 bg-gradient-to-r from-primary-600 to-secondary-600",
      "hover:from-primary-700 hover:to-secondary-700",
      "text-white",
      "shadow-xl hover:shadow-2xl",
      "font-bold text-base",
      "transition-all duration-300 hover:scale-105"
    ),
  }

  const badgeStyles = cn(
    "px-4 py-2 text-sm font-bold",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "text-white",
    "border-none shadow-lg rounded-full",
  )

  return (
    <section
      id="pricing"
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden bg-gradient-to-b from-gray-50 to-white",
        className,
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Choose your plan
          </h2>
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {isYearly && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Save up to 17% with yearly billing
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-gradient-to-b from-primary-50/80 to-white border-2"
                  : "bg-white",
                "border",
                tier.highlight
                  ? "border-primary-200 shadow-2xl"
                  : "border-gray-200 shadow-lg",
                "hover:translate-y-0 hover:shadow-lg",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>
              )}

              <div className="p-6 sm:p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                      ${isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className="text-base text-gray-600">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-600 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-1 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-400 dark:text-zinc-600",
                        )}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {feature.name}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 mt-auto">
                <Button
                  asChild
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? buttonStyles.highlight
                      : buttonStyles.default,
                  )}
                >
                  <a href="/auth">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {tier.highlight ? (
                        <>
                          Get Started
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Get Started Free
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }