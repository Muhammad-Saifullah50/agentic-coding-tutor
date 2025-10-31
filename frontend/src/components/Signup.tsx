'use client'

import { useTransition, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Code2, Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { signup } from "@/actions/auth.actions"
import { createClient } from '@/utils/supabase/client'
import { updateUserProfile } from '@/actions/profile.actions'

const Signup = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()
  useEffect(() => {
    try {
      const err = searchParams?.get('error')
      if (err) {
        toast({
          title: 'Error',
          description: String(err),
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error('Error reading signup search params', e)
    }
  }, [searchParams?.toString()])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const profileData = {
      name: formData.get('name'),
      email: formData.get('email'),
    }

    startTransition(async () => {
      const result = await signup(formData)

      if (result?.success) {
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to verify your account',
        })
        router.push('/login?message=Account created successfully, please verify your email')
      } else if (result?.error) {

        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      }
    })
  }

  const handleGoogleAuth = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }
  const handleGithubAuth = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }

  const handleSocialAuth = (provider: 'google' | 'github') => {

    
    if (provider === 'google') {
      handleGoogleAuth();
    } else if (provider === 'github') {
      handleGithubAuth()
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Code2 className="w-8 h-8 text-primary" />
            </div>
          </Link>
          <CardTitle className="text-3xl font-bold">Start Learning Today</CardTitle>
          <CardDescription className="text-base">
            Create your account and begin your coding journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => handleSocialAuth('google')}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => handleSocialAuth('github')}
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                name="name"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-hero rounded-xl"
              size="lg"
              disabled={isPending}
            >
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>


          </form>

          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signup
