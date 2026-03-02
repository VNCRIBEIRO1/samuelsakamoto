import Link from 'next/link';
import Image from 'next/image';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import SectionHeader from '@/components/SectionHeader';
import AreaCard from '@/components/AreaCard';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';
import GoogleReviewsSlider from '@/components/GoogleReviewsSlider';
import { IMAGES } from '@/lib/images';

const areas = [
  {
    iconName: 'Users',
    title: 'Direito do Trabalho',
    description:
      'Defesa técnica em relações de trabalho, verbas rescisórias, horas extras, adicionais e conflitos empregatícios.',
  },
  {
    iconName: 'Briefcase',
    title: 'Direito de Família e Sucessões',
    description:
      'Divórcios, guarda, pensão, inventários e planejamento sucessório com orientação humanizada.',
  },
  {
    iconName: 'ShieldCheck',
    title: 'Direito Previdenciário',
    description:
      'Aposentadorias, auxílios, revisões e benefícios do INSS com análise detalhada.',
  },
  {
    iconName: 'Building2',
    title: 'Direito do Consumidor',
    description:
      'Defesa contra práticas abusivas e proteção dos direitos nas relações de consumo.',
  },
  {
    iconName: 'Landmark',
    title: 'Licitação Pública',
    description:
      'Consultoria estratégica para empresas em processos licitatórios e contratos administrativos.',
  },
];

const blogPosts = [
  {
    title: 'Pensão Alimentícia e Guarda: Entenda Seus Direitos',
    excerpt:
      'Saiba como funciona a definição de guarda, pensão alimentícia e quais documentos são essenciais no processo.',
    date: '25 Fev 2026',
    readTime: '6 min',
    slug: 'pensao-e-guarda',
    category: 'Direito de Família e Sucessões',
  },
  {
    title: 'Aposentadoria por Idade: Requisitos e Prazos',
    excerpt:
      'Entenda critérios, documentação e principais pontos de atenção para requerer benefícios no INSS.',
    date: '18 Fev 2026',
    readTime: '5 min',
    slug: 'aposentadoria-por-idade',
    category: 'Direito Previdenciário',
  },
  {
    title: 'Direitos do Consumidor: Cobranças Indevidas e Cancelamentos',
    excerpt:
      'Veja como agir em casos de cobrança indevida, cancelamento de serviços e reparação de danos.',
    date: '12 Fev 2026',
    readTime: '7 min',
    slug: 'direitos-do-consumidor-cobrancas',
    category: 'Direito do Consumidor',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Áreas de Atuação */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Áreas de Atuação"
              title="Como Podemos Ajudar"
              subtitle="Oferecemos atuação estratégica e humanizada em diversas áreas do Direito, sempre com ética e compromisso com resultados."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <AreaCard
                key={area.title}
                iconName={area.iconName}
                title={area.title}
                description={area.description}
                delay={index * 0.1}
              />
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/areas-de-atuacao"
              className="btn-primary inline-flex items-center"
            >
              Ver Todas as Áreas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Sobre - Prévia */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src={IMAGES.lawyer}
                    alt="Equipe Samuel Sakamoto Sociedade de Advogados"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-sm font-medium">5.0 no Google</p>
                  <p className="text-xs opacity-80">Nota máxima</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="inline-block text-sm font-medium text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
                Sobre o Escritório
              </span>
              <h2 className="section-title">
                Tradição, Ética e Atendimento Humanizado
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-6">
                O Samuel Sakamoto Sociedade de Advogados atua em Presidente
                Prudente e região há quase três décadas. Liderado pelo Dr. Samuel
                Sakamoto, referência regional com ampla vivência prática, o
                escritório combina técnica, acolhimento e foco em resultados.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Equipe multidisciplinar com advogados associados',
                  'Atendimento acolhedor e objetivo',
                  'Transparência em todas as orientações',
                  'Compromisso com ética e resultados',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sobre" className="btn-primary">
                Conheça Nossa História
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gradient-to-r from-[#0b1223] via-[#162544] to-[#0b1223] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="stats-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0v40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" />
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5.0', label: 'Avaliação Google', hasStar: true },
              { number: '29', label: 'Anos de Experiência', hasStar: false },
              { number: '+2.600', label: 'Processos Identificados', hasStar: false },
              { number: '5', label: 'Áreas de Atuação', hasStar: false },
            ].map((stat, index) => (
              <AnimatedSection
                key={stat.label}
                delay={index * 0.1}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-3xl md:text-4xl font-bold text-gold-400">
                    {stat.number}
                  </p>
                  {stat.hasStar && (
                    <Star className="w-6 h-6 fill-gold-400 text-gold-400" />
                  )}
                </div>
                <p className="text-primary-200 text-sm">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Samuel na Mídia */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Samuel na Mídia"
              title="Comentário Jurídico na Jovem Pan"
              subtitle="Destaque regional com participação fixa no Jornal da Manhã da Rádio Jovem Pan Presidente Prudente."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Jornal da Manhã — Jovem Pan',
                desc: 'Análises jurídicas e políticas com linguagem clara e acessível ao público.',
              },
              {
                title: 'Autoridade Técnica',
                desc: 'Mais de 2.600 processos identificados, reforçando experiência prática nos tribunais.',
              },
              {
                title: 'Conteúdo Educativo',
                desc: 'Temas da rádio transformados em artigos e orientações no site.',
              },
            ].map((item) => (
              <AnimatedSection key={item.title}>
                <div className="card p-6 border border-secondary-100 h-full">
                  <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações Google — Slider Real */}
      <GoogleReviewsSlider />

      {/* Blog - Prévia */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Blog Jurídico"
              title="Artigos Informativos"
              subtitle="Conteúdo educativo para esclarecer dúvidas jurídicas comuns, sem caráter de aconselhamento."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.slug} {...post} delay={index * 0.1} />
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/blog"
              className="btn-outline inline-flex items-center"
            >
              Ver Todos os Artigos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#060a16] via-[#0b1223] to-[#162544] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Precisa de Orientação Jurídica?
            </h2>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-8">
              Entre em contato com o Samuel Sakamoto Sociedade de Advogados para
              uma consulta. Estamos prontos para orientar seu caso com ética e
              profissionalismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" className="btn-gold text-base">
                Agende uma Consulta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '551832211222'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-primary-300 text-primary-100 hover:bg-primary-100/10 hover:text-white text-base"
              >
                WhatsApp
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-primary-400 text-sm">
              <MapPin className="w-4 h-4" />
              Presidente Prudente, SP • OAB/SP
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
