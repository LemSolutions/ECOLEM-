'use client';

import React from 'react';
import Image from 'next/image';
import type { Quote, QuoteItem } from '@/types/database';

interface QuoteTemplateProps {
  quote: {
    quote_number?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    customer_address?: string;
    language: 'it' | 'en' | 'es' | 'fr' | 'pt' | 'cn' | 'rs';
    items: QuoteItem[];
    subtotal: number;
    discount_percentage: number;
    discount_amount: number;
    total: number;
    notes?: string;
    payment_method?: 'iban' | 'banca' | 'bonifico' | 'altro' | null;
    payment_details?: string | null;
    validity_days: number;
    created_at?: string;
  };
  showPreview?: boolean;
}

const translations = {
  it: {
    quote: 'PREVENTIVO',
    quoteNumber: 'N° Preventivo',
    date: 'Data',
    validity: 'Validità',
    days: 'giorni',
    customer: 'Cliente',
    description: 'DESCRIZIONE',
    quantity: 'QTÀ',
    price: 'PREZZO',
    total: 'TOTALE',
    subtotal: 'Subtotale',
    discount: 'Sconto',
    grandTotal: 'TOTALE',
    notes: 'Note',
    paymentMethod: 'Metodo di Pagamento',
    paymentDetails: 'Dettagli Pagamento',
    validUntil: 'Valido fino al',
    thankYou: 'Grazie per la fiducia',
    company: 'LEM SOLUTIONS',
    tagline: 'Ceramiche Artistiche',
  },
  en: {
    quote: 'QUOTE',
    quoteNumber: 'Quote Number',
    date: 'Date',
    validity: 'Validity',
    days: 'days',
    customer: 'Customer',
    description: 'DESCRIPTION',
    quantity: 'QTY',
    price: 'PRICE',
    total: 'TOTAL',
    subtotal: 'Subtotal',
    discount: 'Discount',
    grandTotal: 'TOTAL',
    notes: 'Notes',
    paymentMethod: 'Payment Method',
    paymentDetails: 'Payment Details',
    validUntil: 'Valid until',
    thankYou: 'Thank you for your trust',
    company: 'LEM SOLUTIONS',
    tagline: 'Artistic Ceramics',
  },
  es: {
    quote: 'COTIZACIÓN',
    quoteNumber: 'N° Cotización',
    date: 'Fecha',
    validity: 'Validez',
    days: 'días',
    customer: 'Cliente',
    description: 'DESCRIPCIÓN',
    quantity: 'CANT',
    price: 'PRECIO',
    total: 'TOTAL',
    subtotal: 'Subtotal',
    discount: 'Descuento',
    grandTotal: 'TOTAL',
    notes: 'Notas',
    paymentMethod: 'Método de Pago',
    paymentDetails: 'Detalles de Pago',
    validUntil: 'Válido hasta',
    thankYou: 'Gracias por su confianza',
    company: 'LEM SOLUTIONS',
    tagline: 'Cerámicas Artísticas',
  },
  fr: {
    quote: 'DEVIS',
    quoteNumber: 'N° Devis',
    date: 'Date',
    validity: 'Validité',
    days: 'jours',
    customer: 'Client',
    description: 'DESCRIPTION',
    quantity: 'QTÉ',
    price: 'PRIX',
    total: 'TOTAL',
    subtotal: 'Sous-total',
    discount: 'Remise',
    grandTotal: 'TOTAL',
    notes: 'Notes',
    paymentMethod: 'Méthode de Paiement',
    paymentDetails: 'Détails de Paiement',
    validUntil: 'Valable jusqu\'au',
    thankYou: 'Merci pour votre confiance',
    company: 'LEM SOLUTIONS',
    tagline: 'Céramiques Artistiques',
  },
  pt: {
    quote: 'ORÇAMENTO',
    quoteNumber: 'N° Orçamento',
    date: 'Data',
    validity: 'Validade',
    days: 'dias',
    customer: 'Cliente',
    description: 'DESCRIÇÃO',
    quantity: 'QTD',
    price: 'PREÇO',
    total: 'TOTAL',
    subtotal: 'Subtotal',
    discount: 'Desconto',
    grandTotal: 'TOTAL',
    notes: 'Notas',
    paymentMethod: 'Método de Pagamento',
    paymentDetails: 'Detalhes de Pagamento',
    validUntil: 'Válido até',
    thankYou: 'Obrigado pela confiança',
    company: 'LEM SOLUTIONS',
    tagline: 'Cerâmicas Artísticas',
  },
  cn: {
    quote: '报价单',
    quoteNumber: '报价单号',
    date: '日期',
    validity: '有效期',
    days: '天',
    customer: '客户',
    description: '描述',
    quantity: '数量',
    price: '价格',
    total: '总计',
    subtotal: '小计',
    discount: '折扣',
    grandTotal: '总计',
    notes: '备注',
    paymentMethod: '付款方式',
    paymentDetails: '付款详情',
    validUntil: '有效期至',
    thankYou: '感谢您的信任',
    company: 'LEM SOLUTIONS',
    tagline: '艺术陶瓷',
  },
  rs: {
    quote: 'СМЕТА',
    quoteNumber: '№ Сметы',
    date: 'Дата',
    validity: 'Срок действия',
    days: 'дней',
    customer: 'Клиент',
    description: 'ОПИСАНИЕ',
    quantity: 'КОЛ',
    price: 'ЦЕНА',
    total: 'ИТОГО',
    subtotal: 'Подытог',
    discount: 'Скидка',
    grandTotal: 'ИТОГО',
    notes: 'Примечания',
    paymentMethod: 'Способ Оплаты',
    paymentDetails: 'Детали Оплаты',
    validUntil: 'Действительно до',
    thankYou: 'Спасибо за доверие',
    company: 'LEM SOLUTIONS',
    tagline: 'Художественная Керамика',
  },
};

// Funzione per normalizzare gli spazi nel testo
function normalizeSpaces(text: string): string {
  if (!text) return text;
  
  // NON modificare email o URL
  if (text.includes('@') || text.includes('http://') || text.includes('https://') || text.includes('www.')) {
    return text.trim();
  }
  
  // Se il testo contiene già spazi normali, normalizza solo quelli multipli
  if (text.includes(' ') && text.split(' ').length > 1) {
    return text.replace(/\s+/g, ' ').trim();
  }
  
  // Pattern per parole comuni italiane che potrebbero essere attaccate
  const commonWords = [
    'di', 'da', 'per', 'con', 'su', 'in', 'a', 'al', 'del', 'della', 'delle', 'dei', 'degli',
    'la', 'le', 'il', 'lo', 'gli', 'una', 'uno', 'un',
    'ceramica', 'ceramiche', 'fotografica', 'fotografiche', 'alta', 'qualità', 'formato', 'formati',
    'cornice', 'cornici', 'legno', 'montaggio', 'professionale', 'servizio', 'servizi', 'supporto',
    'rettangolare', 'quadra', 'quadrato', 'ovale', 'ovali', 'cm', 'mm', 'x'
  ];
  
  // Aggiunge spazi prima dei numeri se mancano (es: "Quadra20x20" -> "Quadra 20x20")
  text = text.replace(/([a-zA-ZÀ-ÿ])(\d)/g, '$1 $2');
  // Aggiunge spazi dopo i numeri se seguiti da lettere (es: "20x20cm" -> "20x20 cm")
  text = text.replace(/(\d)([a-zA-ZÀ-ÿ])/g, '$1 $2');
  
  // Aggiunge spazi tra parole comuni attaccate (case-insensitive)
  // Ordina per lunghezza decrescente per gestire prima le parole più lunghe
  const sortedWords = commonWords.sort((a, b) => b.length - a.length);
  sortedWords.forEach(word => {
    // Cerca la parola attaccata ad altre lettere (non all'inizio/fine della stringa)
    const regex = new RegExp(`([a-zÀ-ÿ])(${word})([a-zÀ-ÿ])`, 'gi');
    text = text.replace(regex, (match, before, wordMatch, after) => {
      // Se la parola è tra altre lettere, aggiungi spazi
      if (before && after) {
        return `${before} ${wordMatch} ${after}`;
      }
      return match;
    });
    
    // Gestisce anche il caso in cui la parola è all'inizio seguita da altre lettere
    const startRegex = new RegExp(`^(${word})([a-zÀ-ÿ])`, 'gi');
    text = text.replace(startRegex, (match, wordMatch, after) => {
      if (after) {
        return `${wordMatch} ${after}`;
      }
      return match;
    });
    
    // Gestisce il caso in cui la parola è alla fine preceduta da altre lettere
    const endRegex = new RegExp(`([a-zÀ-ÿ])(${word})$`, 'gi');
    text = text.replace(endRegex, (match, before, wordMatch) => {
      if (before) {
        return `${before} ${wordMatch}`;
      }
      return match;
    });
  });
  
  // Aggiunge spazi tra maiuscole e minuscole (es: "CeramicaQuadra" -> "Ceramica Quadra")
  text = text.replace(/([a-zÀ-ÿ])([A-ZÀ-Ÿ])/g, '$1 $2');
  
  // Normalizza spazi multipli in uno solo
  text = text.replace(/\s+/g, ' ');
  
  // Rimuove spazi all'inizio e alla fine
  return text.trim();
}

export default function QuoteTemplate({ quote, showPreview = false }: QuoteTemplateProps) {
  const t = translations[quote.language];
  const date = quote.created_at 
    ? new Date(quote.created_at).toLocaleDateString(quote.language === 'it' ? 'it-IT' : 'en-US')
    : new Date().toLocaleDateString(quote.language === 'it' ? 'it-IT' : 'en-US');
  
  const validUntil = quote.created_at
    ? new Date(new Date(quote.created_at).getTime() + quote.validity_days * 24 * 60 * 60 * 1000)
        .toLocaleDateString(quote.language === 'it' ? 'it-IT' : 'en-US')
    : new Date(Date.now() + quote.validity_days * 24 * 60 * 60 * 1000)
        .toLocaleDateString(quote.language === 'it' ? 'it-IT' : 'en-US');

  return (
    <div 
      id="quote-template" 
      className="bg-white p-6 max-w-4xl mx-auto"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.4',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
        boxSizing: 'border-box',
        width: '100%',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: showPreview ? '24px' : '24px',
      }}
    >
      {/* Header - Company info left, Customer info right */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-300" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #cccccc', pageBreakAfter: 'avoid' }}>
        {/* Company Info - Left side */}
        <div className="flex-1" style={{ flex: '1' }}>
          <div className="mb-2" style={{ marginBottom: '8px' }}>
            <Image
              src="/images/CERAMIC PRINTING.png"
              alt="LEM SOLUTIONS"
              width={120}
              height={40}
              style={{ objectFit: 'contain', maxWidth: '120px', height: 'auto', marginBottom: '8px' }}
              unoptimized
            />
          </div>
          <div className="text-xs text-black space-y-1" style={{ fontSize: '11px', lineHeight: '1.4' }}>
            <p style={{ marginBottom: '2px' }}>Via Gondar 6, 20900 Monza (MB)</p>
            <p style={{ marginBottom: '2px', wordBreak: 'break-word' }}>P.IVA: 12345678901 | info@lemsolutions.it | www.lemsolutions.it</p>
            {quote.validity_days > 0 && (
              <p style={{ marginTop: '4px' }}>
                {t.validUntil}: {validUntil}
              </p>
            )}
          </div>
        </div>

        {/* Customer Info - Right side */}
        <div className="flex-1 text-right" style={{ flex: '1', textAlign: 'right' }}>
          <h1 className="text-2xl font-bold text-black mb-2" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.2' }}>
            {t.quote}
          </h1>
          {quote.quote_number && (
            <p className="text-xs text-black mb-2" style={{ fontSize: '11px', lineHeight: '1.3', marginBottom: '8px' }}>
              {t.quoteNumber}: {quote.quote_number}
            </p>
          )}
          <p className="text-sm text-black font-medium mb-2" style={{ fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }}>{date}</p>
          <p className="text-xs text-black font-bold uppercase mb-2" style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
            {t.customer}: {quote.customer_name}
          </p>
          {(quote.customer_email || quote.customer_phone || quote.customer_address) && (
            <div className="text-xs text-black space-y-1" style={{ fontSize: '11px', lineHeight: '1.4' }}>
              {quote.customer_email && (
                <p style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                  Email: {quote.customer_email}
                </p>
              )}
              {quote.customer_phone && (
                <p style={{ marginBottom: '2px' }}>
                  Telefono: {quote.customer_phone}
                </p>
              )}
              {quote.customer_address && (
                <p style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                  Indirizzo: {quote.customer_address}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Table - Clean and minimal */}
      <div className="mb-4" style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
        <table className="w-full border-collapse" style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #cccccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', color: '#000000' }}>
              <th className="text-left py-2 px-3 font-bold uppercase text-xs" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #cccccc' }}>{t.description}</th>
              <th className="text-center py-2 px-3 font-bold uppercase text-xs" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #cccccc' }}>{t.quantity}</th>
              <th className="text-right py-2 px-3 font-bold uppercase text-xs" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #cccccc' }}>{t.price}</th>
              <th className="text-right py-2 px-3 font-bold uppercase text-xs" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #cccccc' }}>{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr 
                key={index} 
                style={{ borderBottom: '1px solid #e5e5e5', pageBreakInside: 'avoid' }}
              >
                <td className="py-2 px-3" style={{ padding: '8px 12px', verticalAlign: 'top', border: '1px solid #e5e5e5', lineHeight: '1.3' }}>
                  <div className="font-semibold text-black text-sm" style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1px', lineHeight: '1.3', wordBreak: 'break-word' }}>
                    {normalizeSpaces(item.product_name)}
                  </div>
                  {item.description && (
                    <div className="text-xs text-black" style={{ fontSize: '11px', lineHeight: '1.3', wordBreak: 'break-word', marginTop: '1px' }}>
                      {normalizeSpaces(item.description)}
                    </div>
                  )}
                </td>
                <td className="text-center py-2 px-3" style={{ padding: '8px 12px', verticalAlign: 'middle', border: '1px solid #e5e5e5', fontSize: '12px' }}>
                  {item.quantity}
                </td>
                <td className="text-right py-2 px-3" style={{ padding: '8px 12px', verticalAlign: 'middle', border: '1px solid #e5e5e5', fontSize: '12px' }}>€{item.unit_price.toFixed(2)}</td>
                <td className="text-right py-2 px-3 font-bold" style={{ padding: '8px 12px', verticalAlign: 'middle', border: '1px solid #e5e5e5', fontSize: '12px', fontWeight: 'bold' }}>€{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals - Simple and compact */}
      <div className="mb-4" style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
        <div className="flex justify-end">
          <div className="w-64" style={{ width: '256px' }}>
            <div className="space-y-1" style={{ lineHeight: '1.4' }}>
              <div className="flex justify-between items-center py-1" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <span className="text-xs text-black" style={{ fontSize: '11px' }}>{t.subtotal}:</span>
                <span className="text-sm font-medium text-black" style={{ fontSize: '12px', fontWeight: '500' }}>€{quote.subtotal.toFixed(2)}</span>
              </div>
              {quote.discount_percentage > 0 && (
                <div className="flex justify-between items-center py-1" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                  <span className="text-xs text-black" style={{ fontSize: '11px' }}>
                    {t.discount} {quote.discount_percentage}%:
                  </span>
                  <span className="text-sm font-medium text-black" style={{ fontSize: '12px', fontWeight: '500' }}>-€{quote.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-t border-gray-400 pt-2 mt-1" style={{ paddingTop: '8px', marginTop: '4px', borderTop: '1px solid #999999' }}>
                <span className="text-sm font-bold text-black uppercase" style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.grandTotal}:</span>
                <span className="text-base font-bold text-black" style={{ fontSize: '14px', fontWeight: 'bold' }}>€{quote.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment and Notes - Only show if they have content */}
      {((quote.payment_method && quote.payment_method.trim()) || (quote.payment_details && quote.payment_details.trim()) || (quote.notes && quote.notes.trim())) && (
        <div 
          className="mb-4"
          style={{ 
            marginBottom: '16px', 
            pageBreakInside: 'avoid',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Payment Details - Only show if payment_method OR payment_details exist and have content */}
          {((quote.payment_method && quote.payment_method.trim()) || (quote.payment_details && quote.payment_details.trim())) && (
            <div 
              className="border border-gray-300 p-3"
              style={{ 
                border: '1px solid #cccccc', 
                padding: '12px',
                flex: (quote.notes && quote.notes.trim()) ? '1' : '0 1 48%',
                minWidth: (quote.notes && quote.notes.trim()) ? '0' : '48%',
                maxWidth: (quote.notes && quote.notes.trim()) ? 'none' : '48%'
              }}
            >
              <h3 className="font-bold text-sm text-black mb-2 uppercase" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                {t.paymentDetails}
              </h3>
              <div className="text-xs text-black space-y-1" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                {quote.payment_method && quote.payment_method.trim() && (
                  <p style={{ marginBottom: '4px' }}>
                    <span className="font-medium" style={{ fontWeight: '500' }}>
                      {quote.payment_method === 'iban' && 'IBAN'}
                      {quote.payment_method === 'banca' && 'Banca'}
                      {quote.payment_method === 'bonifico' && 'Bonifico'}
                      {quote.payment_method === 'altro' && 'Altro'}
                    </span>
                  </p>
                )}
                {quote.payment_details && quote.payment_details.trim() && (
                  <p className="whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '4px' }}>
                    {quote.payment_details}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Notes - Only show if notes exist and have content */}
          {quote.notes && quote.notes.trim() && (
            <div 
              className="border border-gray-300 p-3"
              style={{ 
                border: '1px solid #cccccc', 
                padding: '12px',
                flex: ((quote.payment_method && quote.payment_method.trim()) || (quote.payment_details && quote.payment_details.trim())) ? '1' : '0 1 48%',
                minWidth: ((quote.payment_method && quote.payment_method.trim()) || (quote.payment_details && quote.payment_details.trim())) ? '0' : '48%',
                maxWidth: ((quote.payment_method && quote.payment_method.trim()) || (quote.payment_details && quote.payment_details.trim())) ? 'none' : '48%'
              }}
            >
              <h3 className="font-bold text-sm text-black mb-2 uppercase" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                {t.notes}
              </h3>
              <p className="text-xs text-black whitespace-pre-wrap" style={{ fontSize: '11px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.4' }}>
                {quote.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer - Simple and clean */}
      <div className="mt-6 pt-4 border-t border-gray-300" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #cccccc', pageBreakInside: 'avoid' }}>
        <div className="text-center text-xs text-black" style={{ fontSize: '11px', lineHeight: '1.4' }}>
          <p className="font-bold mb-1" style={{ fontWeight: 'bold', marginBottom: '4px' }}>LEM SOLUTIONS</p>
          <p style={{ marginBottom: '2px' }}>Via Gondar 6, 20900 Monza (MB)</p>
          <p style={{ wordBreak: 'break-word' }}>P.IVA: 12345678901 | info@lemsolutions.it | www.lemsolutions.it</p>
        </div>
      </div>
    </div>
  );
}
