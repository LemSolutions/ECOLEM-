import { Navbar, Footer } from '@/components/layout';
import { HeroSection, ServicesSection, ProductsSection, BlogSection, SupportSection } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          headline="Soluzioni Digitali per il Tuo Successo"
          subheadline="Trasformiamo le tue idee in esperienze digitali straordinarie. Design premium, sviluppo eccellente, risultati concreti."
          ctaPrimaryText="Richiedi Consulenza"
          ctaPrimaryHref="#support"
          ctaSecondaryText="Scopri i Servizi"
          ctaSecondaryHref="#servizi"
          videoSrc="/videos/hero-video.mp4"
          videoPoster="/images/hero-poster.jpg"
          fallbackImage="/images/hero-fallback.jpg"
        />
        <ServicesSection />
        <ProductsSection />
        <BlogSection />
        <SupportSection />
      </main>
      <Footer />
    </>
  );
}
