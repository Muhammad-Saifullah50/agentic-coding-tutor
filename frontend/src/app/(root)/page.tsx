import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const HomePage = async () => {

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
