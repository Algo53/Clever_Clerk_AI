'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, ListTodo, LogOut, Menu, MessageSquareText, Settings, Zap } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";
import { authStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/dashboard/nav-link";
import { UserNav } from "@/components/dashboard/user-nav";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { userStore } from "@/store/userStore";

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/tasks', label: 'Tasks', icon: ListTodo },
    { href: '/dashboard/context', label: 'Context', icon: MessageSquareText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { token, logoutEndPoint } = authStore();
    const { getUserDetails } = userStore();
    const { theme } = useTheme();

    useEffect(() => {
        if (!token) {
            router.replace('/');
        } else {
            getUserDetails();
        }
    }, [token])

    return (
        <div className="flex flex-col min-h-screen dashboard-background w-full overflow-x-hidden">
            <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-border bg-card/60 backdrop-blur-lg">
                <div className="container flex h-14 items-center">

                    {/* Logo & Desktop Nav */}
                    <div className="sm:mr-4 mr-2 flex items-center">
                        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                            <Zap className="h-6 w-6 text-primary" />
                            <span className="font-bold sm:inline-block text-primary text-xl whitespace-nowrap">
                                Smart Todo
                            </span>
                        </Link>
                        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
                            {navLinks.map(link => (
                                <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Right side: Actions + Mobile Menu */}
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <ThemeToggle />

                        <div className="hidden md:block">
                            <UserNav />
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant={theme === 'light' ? "outline" : 'destructive'} className="md:hidden" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col p-0">
                                <div className="p-4 border-b">
                                    <Link href="/dashboard" className="flex items-center space-x-2">
                                        <Zap className="h-6 w-6 text-primary" />
                                        <span className="font-bold">Smart Todo</span>
                                    </Link>
                                </div>
                                <nav className="flex-1 px-4 py-4">
                                    <ul className="space-y-1">
                                        {navLinks.map(link => (
                                            <li key={link.href}>
                                                <SheetClose asChild>
                                                    <NavLink href={link.href} mobile>
                                                        <link.icon className="h-5 w-5" />
                                                        <span>{link.label}</span>
                                                    </NavLink>
                                                </SheetClose>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                                <div className="border-t p-4">
                                    <Link href="/dashboard/settings" className="flex space-x-2 items-center">
                                        <Settings className="mr-2 h-5 w-5" />
                                        <span>Settings</span>
                                    </Link>
                                </div>
                                <div className="flex border-t p-4 space-x-2 items-center cursor-pointer" onClick={() => logoutEndPoint()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
