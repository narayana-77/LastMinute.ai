import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TrustedByStats from '../components/TrustedByStats';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import DemoSection from '../components/DemoSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustedByStats />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </>
  );
};

export default LandingPage;
