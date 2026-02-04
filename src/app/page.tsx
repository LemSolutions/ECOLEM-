import { Navbar, Footer } from '@/components/layout';
import { HeroSection, ServicesSection, ProductsSection, BlogSection, SupportSection } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <BlogSection />
        <SupportSection />
      </main>
      <Footer />
    </>
  );
}
