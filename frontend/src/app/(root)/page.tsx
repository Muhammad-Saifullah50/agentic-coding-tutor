import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

import { currentUser } from "@clerk/nextjs/server";

const HomePage = async () => {
  const user = await currentUser();

  return (
    <div className="min-h-screen">
      <Hero userId={user?.id} />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default HomePage;
