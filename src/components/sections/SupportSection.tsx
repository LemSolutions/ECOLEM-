'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Heading, { Eyebrow, Text } from '@/components/ui/Heading';

const services = [
  { value: '', label: 'Seleziona un prodotto/servizio' },
  { value: 'stampante-c265', label: 'Stampante LEM CERAMIC C265/270' },
  { value: 'stampante-c7000', label: 'Stampante LEM CERAMIC C7000' },
  { value: 'stampante-165', label: 'Stampante LEM CERAMIC 165' },
  { value: 'toner', label: 'LEM CERAMIC Toner' },
  { value: 'pronto-decal', label: 'LEM CERAMIC Pronto Decal' },
  { value: 'paper-film', label: 'LEM CERAMIC Paper Film' },
  { value: 'consulenza', label: 'Consulenza Tecnica' },
  { value: 'assistenza', label: 'Assistenza & Supporto' },
  { value: 'altro', label: 'Altro' },
];

export default function SupportSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setIsVisible(true); }); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Iubenda Consent Database (best-effort).
   * Se lo script non è ancora caricato, non blocchiamo l'invio del form.
   */
  const sendIubendaConsent = () => {
    try {
      const w = window as unknown as { _iub?: { cons_instructions?: unknown[] } };
      if (!w._iub || !Array.isArray(w._iub.cons_instructions)) return;

      // Nota: l'SDK Iubenda processa una coda di istruzioni.
      // Qui inviamo un trigger "submit" legato all'id del form (integrazione rapida).
      w._iub.cons_instructions.push(['submit', { form_id: 'lem-contact-form' }]);
    } catch {
      // no-op
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      sendIubendaConsent();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = 'w-full px-4 py-3 bg-white border border-[var(--color-light-gray)] rounded-lg text-[var(--color-charcoal)] placeholder:text-[var(--color-medium-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200';

  return (
    <Section id="support" variant="gradient" size="lg" ref={sectionRef} showTricolor>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className={isVisible ? 'animate-fade-up' : 'opacity-0'}>
          <Eyebrow className="text-[var(--color-accent)]">Contattaci</Eyebrow>
          <Heading as="h2" size="section" variant="default" className="mb-6">Richiedi Informazioni</Heading>
          <Text variant="default" size="lg" className="mb-10 text-[var(--color-dark-gray)]">Scopri la soluzione LEM CERAMIC più adatta alle tue esigenze. Compila il form e ti risponderemo entro 24 ore lavorative.</Text>

          <div className="space-y-6 mb-10">
            {[
              { icon: <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Email', content: <a href="mailto:info@lemsolutions.it" className="text-[var(--color-dark-gray)] hover:text-[var(--color-accent)] transition-colors">info@lemsolutions.it</a> },
              { icon: <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, title: 'Telefono', content: <a href="tel:+393474806300" className="text-[var(--color-dark-gray)] hover:text-[var(--color-accent)] transition-colors">+39 347 480 6300</a> },
              { icon: <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Sede', content: <span className="text-[var(--color-dark-gray)]">Via Gondar 6, 20900 Monza (MB)</span> },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-md">{item.icon}</div>
                <div><h4 className="font-semibold text-[var(--color-primary)] mb-1">{item.title}</h4>{item.content}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[var(--color-light-gray)]">
            {['Risposta in 24h', 'Consulenza gratuita', 'Senza impegno'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-[var(--color-dark-gray)] text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={isVisible ? 'animate-fade-up delay-200' : 'opacity-0'}>
          <Card variant="default" padding="lg" hover={false}>
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="font-heading font-semibold text-xl text-[var(--color-primary)] mb-2">Messaggio Inviato!</h3>
                <p className="text-[var(--color-dark-gray)] mb-6">Grazie per averci contattato. Ti risponderemo il prima possibile.</p>
                <Button variant="secondary" onClick={() => setSubmitStatus('idle')}>Invia un altro messaggio</Button>
              </div>
            ) : (
              <form id="lem-contact-form" name="lem_contact_form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label htmlFor="name" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Nome *</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Il tuo nome" /></div>
                  <div><label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Email *</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="tua@email.com" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label htmlFor="phone" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Telefono</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="+39 123 456 7890" /></div>
                  <div><label htmlFor="company" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Azienda</label><input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={inputClasses} placeholder="Nome azienda" /></div>
                </div>
                <div><label htmlFor="service" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Servizio di interesse</label><select id="service" name="service" value={formData.service} onChange={handleChange} className={inputClasses}>{services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                <div><label htmlFor="message" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Messaggio *</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${inputClasses} resize-none`} placeholder="Descrivici le tue esigenze produttive..." /></div>
                {submitStatus === 'error' && <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">Si è verificato un errore. Per favore riprova più tardi.</div>}
                <Button id="lem-contact-submit" type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>Invia Richiesta</Button>
                <p className="text-xs text-[var(--color-medium-gray)] text-center">Inviando questo form accetti la nostra <a href="/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</a></p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}
