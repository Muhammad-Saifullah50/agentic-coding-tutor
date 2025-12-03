import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import { Toaster as ShadcnToaster } from '@/components/ui/toaster'
import '../globals.css'
import {
  ClerkProvider
} from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import MentorChat from '@/components/MentorChat'
import { getCurrentUserWithProfile } from '@/actions/profile.actions'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getCurrentUserWithProfile()

  if (user && !user?.onBoarded) redirect('/onboarding');
  return (
    <ClerkProvider>

      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main id='root' className=''>
              <Navbar user={user} />
              <div className="min-h-screen bg-background pt-20">
                {children}
              </div>
              <Toaster
                toastOptions={{
                  classNames: {
                    toast: 'bg-background text-foreground border-border',
                    title: 'text-foreground',
                    description: 'text-muted-foreground',
                    actionButton: 'bg-primary text-primary-foreground',
                    cancelButton: 'bg-muted text-muted-foreground',
                    success: 'text-green-500',
                    error: 'text-red-500',
                  },
                }}
              />
              <ShadcnToaster />
              <MentorChat />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}