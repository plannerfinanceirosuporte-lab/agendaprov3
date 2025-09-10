import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { CTA } from './CTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}