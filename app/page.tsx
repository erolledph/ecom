'use client';

import { HeroSection } from '@/components/blocks/HeroSection';
import { FeaturesSection } from '@/components/blocks/FeaturesSection';
import { TestimonialsSection } from '@/components/blocks/TestimonialsSection';
import { PricingSectionComponent } from '@/components/blocks/PricingSectionComponent';
import StoreFooter from '@/components/StoreFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSectionComponent />
      <StoreFooter />
    </div>
  );
}
