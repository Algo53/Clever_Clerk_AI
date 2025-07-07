'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { authStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { token, hydrate, isHydrated } = authStore();

  useEffect( () => {
    if (token) {
      router.replace('/dashboard');
    } else if (!isHydrated) {
      hydrate();
    }
  }, [token])

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden landing-background landing-theme">
      <div className="flex sticky top-0 z-50">
        <LandingHeader />
      </div>
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
