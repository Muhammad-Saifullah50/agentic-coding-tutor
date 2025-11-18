import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import '../globals.css'
import {
  ClerkProvider
} from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
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
              <Navbar user={user}/>
              <div className="min-h-screen bg-background pt-20">
              {children}
              </div>
              <Toaster />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}