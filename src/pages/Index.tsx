import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import Bestsellers from "@/components/home/Bestsellers";
import AboutTeaser from "@/components/home/AboutTeaser";
import BlogTeaser from "@/components/home/BlogTeaser";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <Bestsellers />
        <AboutTeaser />
        <BlogTeaser />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
