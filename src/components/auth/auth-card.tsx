'use client'

import * as z from 'zod'
import Link from 'next/link'
import { useEffect } from 'react'
import { Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { authStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { AuthService } from '@/services/authService'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type AuthFormValues = {
    name?: string
    username?: string
    email: string
    password: string
}

type AuthCardProps = {
    type: 'login' | 'signup'
}

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(8, { message: 'Password is required.' }),
})

const signupSchema = z.object({
    name: z.string().min(3, { message: 'Name is required.' }),
    username: z.string().min(3, { message: 'username is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
})


export function AuthCard({ type }: AuthCardProps) {
    const router = useRouter();
    const { toast } = useToast();

    const isLogin = type === 'login'
    const schema = isLogin ? loginSchema : signupSchema

    const { loginEndPoint, token } = authStore();

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(schema),
        defaultValues: isLogin ? { email: '', password: '' } : { name: '', username: '', email: '', password: '' },
    })

    const onSubmit = async (values: AuthFormValues) => {
        try {
            if (isLogin) {
                const response = await AuthService.login({ login: values.email, password: values.password })
                if (response.status === 200) {
                    toast({ title: "Success", description: "Login successful" });
                    loginEndPoint(response.data.data.access);
                } else {
                    toast({ variant: 'destructive', title: "Error", description: response.data.errorText ||  `Invalid credentials` });
                }
            } else {
                const response = await AuthService.register({ name: values.name as string, username: values.username as string, email: values.email, password: values.password })
                if (response.status === 201) {
                    toast({ title: "Success", description: response.data.successText || 'Registration successful' });
                    router.push('/login');
                } else {
                    toast({ variant: 'destructive', title: "Error", description: response.data.errorText ||  `Try using a different username or email` });
                }
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message || "Server error!.Please try again." });
        }
    }

    useEffect( () => {
        if (token) {
            router.push('/dashboard');
        }
    }, [token])

    return (
        <Card className="w-full max-w-sm mt-20">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-2">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                    {isLogin ? 'Welcome Back!' : 'Create an Account'}
                </CardTitle>
                <CardDescription>
                    {isLogin ? 'Sign in to continue to Smart Todo.' : 'Get started with your AI-powered task list.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {!isLogin && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a unique username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    {isLogin && <Link href="#" className="text-xs text-muted-foreground hover:text-primary float-right pt-1">Forgot password?</Link>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            {isLogin ? 'Log In' : 'Sign Up'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm">
                <p className="text-muted-foreground">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <Button variant="link" asChild>
                        <Link href={isLogin ? '/signup' : '/login'}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </Link>
                    </Button>
                </p>
            </CardFooter>
        </Card>
    )
}
