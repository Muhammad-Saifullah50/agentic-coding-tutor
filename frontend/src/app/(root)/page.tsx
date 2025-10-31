import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";

const HomePage = async () => {

  const user = await getCurrentUser()
  if (!user) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default HomePage;
