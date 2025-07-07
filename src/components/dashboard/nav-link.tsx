
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type NavLinkProps = {
    href: string
    children: React.ReactNode
    mobile?: boolean
}

export function NavLink({ href, children, mobile = false }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "rounded-md text-sm font-medium",
                mobile 
                ? "flex items-center gap-3 px-3 py-2"
                : "transition-colors",
                isActive 
                ? (mobile ? "bg-muted text-primary" : "text-foreground")
                : (mobile ? "text-muted-foreground hover:bg-muted/50 hover:text-primary" : "text-muted-foreground hover:text-foreground")
            )}
        >
            {children}
        </Link>
    )
}
