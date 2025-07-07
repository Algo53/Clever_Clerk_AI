import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LandingHero() {
    return (
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
            <div className="container mx-auto text-center text-foreground">
                <div className="bg-gradient-to-br from-background/80 via-destructive/10 to-background/80 backdrop-blur-sm p-6 rounded-xl inline-block">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-headline tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-40 duration-5000">
                        The Future of Productivity is Here.
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 font-body animate-in fade-in slide-in-from-top-40 duration-5000 delay-200">
                        Meet your new AI-powered assistant. Smart Todo intelligently organizes your tasks, suggests deadlines, and helps you focus on what truly matters.
                    </p>
                    <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-left-100 duration-5000 delay-500">
                        <Button size="lg" asChild className="font-headline transition-transform hover:scale-105 bg-gradient-to-br from-primary via-primary/70 to-primary">
                            <Link href="/signup">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
