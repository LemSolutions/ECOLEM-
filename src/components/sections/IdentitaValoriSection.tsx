'use client';

import { useState } from 'react';
import Section, { SectionHeader } from '@/components/ui/Section';

const BLOCKS = [
  {
    title: 'Know-how e investimenti',
    text: 'La trasformazione di una stampante tradizionale in una stampante per fotoceramica è il risultato di know-how, anni di esperienza, prove e investimenti. Non si tratta di un processo improvvisabile.',
  },
  {
    title: 'Solo modelli specifici',
    text: 'Non tutte le stampanti presenti sul mercato possono essere convertite: solo alcuni modelli specifici si prestano a questo tipo di lavorazione. Noi di Lem Solutions abbiamo sempre scelto stampanti professionali di fascia alta, progettate per centri stampa e produzioni intensive, perché garantiscono una qualità di stampa e resa fotografica superiore.',
  },
  {
    title: 'Componenti e toner ceramico',
    text: 'Durante il processo vengono sostituiti diversi componenti fondamentali, ma questo da solo non è sufficiente. Il toner ceramico ha caratteristiche molto diverse rispetto a quello originale: è più abrasivo e genera una resa cromatica completamente differente. È necessario intervenire su numerosi parametri interni della macchina, modificando firmware e regolazioni per ottenere le corrette temperature di fissaggio e una perfetta adesione del pigmento.',
  },
  {
    title: 'Gestione del colore',
    text: 'Una volta stabilizzata la stampante, è fondamentale lavorare sulla gestione del colore, adattando i profili per ottenere la migliore resa possibile con pigmenti ceramici. Questo richiede strumenti avanzati, come spettrofotometri professionali, e soprattutto esperienza.',
  },
  {
    title: 'Paper Film e materiali innovativi',
    text: "A completare il processo si utilizzano materiali innovativi come la Paper Film: una carta speciale che migliora l'adesione del pigmento, riduce gli sprechi e consente di ottenere una maggiore densità e stabilità del colore.",
  },
  {
    title: 'Tempi e complessità',
    text: "L'intero lavoro richiede generalmente dai 7 ai 10 giorni lavorativi, tra test, regolazioni e prove di cottura. Nel caso di stampanti usate, il processo diventa ancora più complesso: è necessario smontare completamente le unità colore ed eliminare ogni residuo dei materiali originali. Operazioni delicate, eseguibili esclusivamente da tecnici qualificati.",
  },
  {
    title: 'Servizio in tutto il mondo',
    text: "Lem Solutions offre questo servizio in tutto il mondo. Supportiamo il cliente nella scelta e nell'acquisto di una stampante usata presso centri specializzati Canon locali. Interveniamo poi direttamente presso il laboratorio del cliente: in soli 3-4 giorni lavorativi è possibile completare la trasformazione e consegnare una stampante per fotoceramica perfettamente funzionante, completa di garanzia di un anno e supporto diretto online post-vendita.",
  },
];

export default function IdentitaValoriSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => setActiveIndex((i) => (i === 0 ? BLOCKS.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === BLOCKS.length - 1 ? 0 : i + 1));

  return (
    <Section id="identita-valori" variant="cream" size="lg" showTricolor>
      <SectionHeader
        eyebrow="Il Nostro Approccio"
        title="Identità e Valori"
        subtitle="Know-how, esperienza e investimenti: il processo di trasformazione delle stampanti per fotoceramica."
      />

      <div className="max-w-4xl mx-auto">
        {/* Carosello card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg min-h-[280px] md:min-h-[240px]">
            {BLOCKS.map((block, i) => (
              <div
                key={i}
                className={`p-6 md:p-8 lg:p-10 transition-opacity duration-500 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                <h3 className="font-heading font-semibold text-xl md:text-2xl text-[var(--color-primary)] mb-4">
                  {block.title}
                </h3>
                <p className="text-[var(--color-dark-gray)] leading-relaxed text-base md:text-lg">
                  {block.text}
                </p>
              </div>
            ))}
          </div>

          {/* Pulsanti prev/next */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors z-10"
            aria-label="Precedente"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors z-10"
            aria-label="Successiva"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicatori */}
        <div className="flex justify-center gap-2 mt-6">
          {BLOCKS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === activeIndex
                  ? 'bg-[var(--color-primary)] scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Vai alla card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
