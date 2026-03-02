import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import CanvasLogo from './CanvasLogo';

const areas = [
  'Direito do Trabalho',
  'Direito de Família e Sucessões',
  'Direito Previdenciário',
  'Direito do Consumidor',
  'Licitação Pública',
];

const links = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Áreas de Atuação', href: '/areas-de-atuacao' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '/contato' },
  { name: 'Agendamento', href: '/agendamento' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b1223] to-[#060a16] text-primary-100">
      {/* Conteúdo principal */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CanvasLogo
                src="/images/samuel_sakamoto_logo.svg"
                alt="Samuel Sakamoto Sociedade de Advogados"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <div>
                <h3 className="text-white font-serif font-bold text-lg">
                  Samuel Sakamoto
                </h3>
                <p className="text-xs tracking-wider uppercase text-primary-300">
                  Sociedade de Advogados
                </p>
              </div>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed mb-4">
              Quase três décadas de atuação jurídica em Presidente Prudente e
              região, com atendimento acolhedor e orientação precisa.
            </p>
            <p className="text-gold-400 text-sm font-medium">OAB/SP</p>
          </div>

          {/* Coluna 2 - Links */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Navegação
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Áreas */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Áreas de Atuação
            </h4>
            <ul className="space-y-3">
              {areas.map((area) => (
                <li key={area}>
                  <Link
                    href="/areas-de-atuacao"
                    className="text-primary-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-sm">
                  R. Francisco Machado de Campos, 393
                  <br />
                  Vila Nova
                  <br />
                  Presidente Prudente - SP
                  <br />
                  CEP 19010-300
                </span>
              </li>
              <li>
                <a
                  href="tel:+551832211222"
                  className="flex items-center gap-3 text-primary-300 hover:text-gold-400 transition-colors text-sm"
                >
                  <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  (18) 3221-1222
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@samuelsakamoto.adv.br"
                  className="flex items-center gap-3 text-primary-300 hover:text-gold-400 transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  contato@samuelsakamoto.adv.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-sm">
                  Seg a Sex, 08:00 às 18:00
                </span>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-primary-700/30">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Samuel Sakamoto Sociedade de
            Advogados. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/politica-privacidade"
              className="text-primary-400 hover:text-gold-400 text-xs transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="text-primary-400 hover:text-gold-400 text-xs transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
          <p className="text-primary-500 text-xs">
            Este site tem caráter informativo, nos termos do Provimento 205/2021
            da OAB.
          </p>
        </div>
      </div>
    </footer>
  );
}
