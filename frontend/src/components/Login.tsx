'use client'
import { useTransition, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { login } from '@/actions/auth.actions'
import { createClient } from '@/utils/supabase/client'


const Login = () => {
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
      console.error('Error reading login search params', e)
    }
  }, [searchParams?.toString()])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await login(formData)

      if (result?.success) {
        toast({ title: 'Logged in', description: 'Welcome back!' })
        router.push('/')
      } else if (result?.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Code2 className="w-8 h-8 text-primary" />
            </div>
          </Link>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Log in to continue your coding journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
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
              {isPending ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="rounded-xl"
              onClick={() => handleGoogleAuth()}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl"
              onClick={() => handleGithubAuth()}
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
//todo: add webhook to sync data to db like clerk