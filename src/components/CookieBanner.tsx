'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-secondary-200 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-500" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">
                  Privacidade e Cookies
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed mb-4">
                  Utilizamos cookies para melhorar sua experiência de navegação.
                  Em conformidade com a LGPD (Lei nº 13.709/2018), solicitamos
                  seu consentimento para o uso de cookies não essenciais. Para
                  mais informações, consulte nossa{' '}
                  <Link
                    href="/politica-privacidade"
                    className="text-primary-500 underline hover:text-gold-500"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptCookies}
                    className="btn-gold text-sm py-2 px-6"
                  >
                    Aceitar Todos
                  </button>
                  <button
                    onClick={declineCookies}
                    className="btn-outline text-sm py-2 px-6"
                  >
                    Apenas Essenciais
                  </button>
                </div>
              </div>

              <button
                onClick={declineCookies}
                className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
