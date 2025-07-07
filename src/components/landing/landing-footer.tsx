import Link from "next/link"
import { Zap } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-body">&copy; {new Date().getFullYear()} Smart Todo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
