'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Users,
  ShieldCheck,
  Building2,
  Landmark,
  Scale,
  ArrowRight,
  CheckCircle2,
  FileText,
  Handshake,
  Gavel,
  LucideIcon,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeader from '@/components/SectionHeader';
import { AREA_IMAGES, DEFAULT_IMAGE } from '@/lib/images';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Users,
  ShieldCheck,
  Building2,
  Landmark,
  Scale,
  FileText,
  Handshake,
  Gavel,
};

const areas = [
  {
    iconName: 'Users',
    title: 'Direito do Trabalho',
    description:
      'Atuação técnica em relações de trabalho, com defesa estratégica de direitos trabalhistas e prevenção de conflitos.',
    topics: [
      'Rescisão Contratual',
      'Verbas Rescisórias',
      'Horas Extras e Adicionais',
      'Acidentes de Trabalho',
      'Assédio Moral',
      'Reclamações Trabalhistas',
    ],
    color: 'from-[#162544] to-[#243b6b]',
  },
  {
    iconName: 'ShieldCheck',
    title: 'Direito de Família e Sucessões',
    description:
      'Atendimento acolhedor em divórcios, guarda, pensão, inventários e planejamento sucessório.',
    topics: [
      'Divórcio e Separação',
      'Guarda e Convivência',
      'Pensão Alimentícia',
      'Inventários',
      'Planejamento Sucessório',
      'Partilha de Bens',
    ],
    color: 'from-[#0b1223] to-[#162544]',
  },
  {
    iconName: 'Briefcase',
    title: 'Direito Previdenciário',
    description:
      'Assessoria completa para benefícios do INSS, aposentadorias e revisões.',
    topics: [
      'Aposentadoria por Idade',
      'Aposentadoria por Tempo',
      'Auxílio-Doença',
      'Benefício Assistencial (BPC)',
      'Revisões de Benefício',
      'Planejamento Previdenciário',
    ],
    color: 'from-[#1d3058] to-[#243b6b]',
  },
  {
    iconName: 'Building2',
    title: 'Direito do Consumidor',
    description:
      'Defesa contra práticas abusivas e soluções rápidas em conflitos de consumo.',
    topics: [
      'Cobrança Indevida',
      'Cancelamentos de Serviços',
      'Danos Morais',
      'Contratos de Consumo',
      'Produtos com Defeito',
      'Negativação Indevida',
    ],
    color: 'from-[#c1933c] to-[#d1ad57]',
  },
  {
    iconName: 'Landmark',
    title: 'Licitação Pública',
    description:
      'Consultoria estratégica para empresas em processos licitatórios e contratos administrativos.',
    topics: [
      'Habilitação e Documentação',
      'Impugnações e Recursos',
      'Contratos Administrativos',
      'Pregões Eletrônicos',
      'Gestão de Riscos',
      'Compliance em Licitações',
    ],
    color: 'from-[#101b32] to-[#243b6b]',
  },
];

export default function AreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#060a16] via-[#0b1223] to-[#162544] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gavel className="w-4 h-4" />
              Áreas de Atuação
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Nossas <span className="text-gold-400">Áreas de Atuação</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl">
              Atuação estratégica e humanizada em diversas áreas do Direito,
              sempre com ética e compromisso com resultados.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Áreas detalhadas */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="space-y-20">
            {areas.map((area, index) => {
              const AreaIcon = iconMap[area.iconName] || Briefcase;
              return (
                <AnimatedSection key={area.title}>
                  <div
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center`}
                        >
                          <AreaIcon className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-500">
                          {area.title}
                        </h2>
                      </div>

                      <p className="text-secondary-600 leading-relaxed mb-8">
                        {area.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {area.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                            <span className="text-secondary-700 text-sm">
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href="/contato"
                        className="btn-primary inline-flex items-center text-sm"
                      >
                        Saiba Mais
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>

                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="aspect-[4/3] rounded-2xl shadow-lg overflow-hidden relative">
                        <Image
                          src={AREA_IMAGES[area.title] || DEFAULT_IMAGE}
                          alt={area.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {index < areas.length - 1 && (
                    <div className="border-b border-secondary-200 mt-20" />
                  )}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#060a16] via-[#0b1223] to-[#162544]">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Precisa de Orientação?
            </h2>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-8">
              Entre em contato para esclarecer suas dúvidas. Nosso atendimento é
              estratégico, humanizado e segue as normas éticas da OAB.
            </p>
            <Link href="/contato" className="btn-gold text-base">
              Agende uma Consulta
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
