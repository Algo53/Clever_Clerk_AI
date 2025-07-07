'use client'

import Link from 'next/link'
import { Menu, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'

export function LandingHeader() {
  return (
    <header className="w-full overflow-x-hidden border-b border-border/40 bg-gradient-to-tr from-background/90 via-primary/20 via-destructive/30 to-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="lg:text-4xl md:text-2xl text-xl font-bold font-headline text-primary sm:inline-block">
              Smart Todo
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden sm:flex items-center space-x-2">
            <Button variant="secondary" asChild>
                <Link href="/about">About</Link>
            </Button>
            <Button variant="secondary" asChild>
                <Link href="/contact">Contact</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" className="sm:hidden" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0 data-[state=open]:duration-[2000ms] bg-gradient-to-br from-secondary/80 to-primary/60">
                <div className="p-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                        <Zap className="h-8 w-8 text-primary" />
                        <span className="font-semibold font-headline text-2xl text-primary">Smart Todo</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-4">
                    <SheetClose asChild>
                        <Link href="/about" className="block px-2 py-1 text-lg rounded-md hover:bg-muted-foreground animate-in fade-in slide-in-from-top-10 duration-[2000ms] text-center">About</Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link href="/contact" className="block px-2 py-1 text-lg rounded-md hover:bg-muted-foreground animate-in fade-in slide-in-from-right-20 duration-[2000ms] text-center">Contact</Link>
                    </SheetClose>
                </nav>
                <div className="p-4 mt-auto border-t space-y-2">
                    <SheetClose asChild>
                        <Button variant="ghost" asChild className="w-full text-lg p-3 justify-center animate-in fade-in slide-in-from-left-4 duration-[3000ms] hover:bg-accent-foreground/60 hover:text-muted">
                           <Link href="/login">Login</Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                         <Button asChild className="w-full text-lg p-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-[3000ms] hover:bg-primary/60">
                           <Link href="/signup">Sign Up</Link>
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
