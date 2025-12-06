import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import { Toaster as ShadcnToaster } from '@/components/ui/toaster'
import '../globals.css'
import {
  ClerkProvider
} from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import MentorChatbox from '@/components/MentorChatbox'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


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
              <Navbar />
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
              <MentorChatbox />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}