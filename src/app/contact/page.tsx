import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden landing-background landing-theme">
      <div className="flex sticky top-0 z-50">
        <LandingHeader />
      </div>

      <main className="flex-1">
        <div className="container mx-auto py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground font-body mb-12">
              Have a question, feedback, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
          <Card className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <CardHeader>
              <CardTitle className="font-headline">Contact Us</CardTitle>
              <CardDescription className="font-body">Please fill out the form below and we will get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-headline">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-headline">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-headline">Message</Label>
                  <Textarea id="message" placeholder="Your message..." />
                </div>
                <Button type="submit" className="w-full font-headline">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
