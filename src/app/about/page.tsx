import { Zap } from "lucide-react";

import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden landing-background landing-theme">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>

      <main className="flex-1">
        <div className="container mx-auto py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-in fade-in">
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">About Smart Todo</h1>
            <p className="text-xl text-muted-foreground font-body mb-8">
              We believe that technology should work for you, making your life simpler and more productive.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6 text-lg font-body text-foreground/80 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <p>
              Smart Todo was born from a simple idea: what if your to-do list was actually smart? Not just a passive list of items, but an active partner in your productivity. We were tired of constantly juggling priorities, forgetting context, and missing deadlines. We knew there had to be a better way.
            </p>
            <p>
              By leveraging the power of modern AI, we've created an application that understands your needs. It reads between the lines of your notes and messages, helps you prioritize what's truly important, and keeps you organized without the mental overhead.
            </p>
            <p>
              Our mission is to give you back your most valuable resource: your time. Spend less time managing tasks and more time doing what you love. Join us on our journey to redefine productivity.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
