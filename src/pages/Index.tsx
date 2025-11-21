import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Services from "@/components/home/Services";
import CTA from "@/components/home/CTA";
import Footer from "@/components/shared/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
