import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeQuora - AI-Powered Coding Tutor | Learn Programming Faster",
  description: "Master programming with CodeQuora's AI-powered personalized learning platform. Get instant code reviews, interactive lessons, and 24/7 AI mentor support. Start learning for free!",
  keywords: ["coding tutor", "AI programming", "learn to code", "code review", "programming courses", "AI mentor", "interactive coding"],
  openGraph: {
    title: "CodeQuora - AI-Powered Coding Tutor",
    description: "Master programming with personalized AI-powered courses and instant feedback",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeQuora - AI-Powered Coding Tutor",
    description: "Master programming with personalized AI-powered courses and instant feedback",
    images: ["/og-image.jpg"],
  },
};

const HomePage = () => {

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default HomePage;
