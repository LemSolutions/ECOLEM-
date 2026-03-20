import { Navbar, Footer } from '@/components/layout';
import { HeroSection, StatsSection, IdentitaValoriSection, ServicesSection, ProductsSection, BlogSection, AboutSection, SupportSection } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <IdentitaValoriSection />
        <ServicesSection />
        <ProductsSection />
        <AboutSection />
        <BlogSection />
        <SupportSection />
      </main>
      <Footer />
    </>
  );
}
