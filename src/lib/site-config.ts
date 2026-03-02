// ============================================================
// CONFIGURAÇÃO DO ESCRITÓRIO - SAMUEL SAKAMOTO SOCIEDADE DE ADVOGADOS
// ============================================================

export const SITE_CONFIG = {
  // === DADOS DOS ADVOGADOS / ESCRITÓRIO ===
  nome: 'Samuel Sakamoto',
  nomeCompleto: 'Dr. Samuel Sakamoto',
  nomeEscritorio: 'Samuel Sakamoto Sociedade de Advogados',
  oab: 'OAB/SP', // Número da OAB precisa ser preenchido
  oabNumero: '', // PREENCHER
  oabEstado: 'SP',

  // === SÓCIOS ===
  socios: [
    {
      nome: 'Dr. Samuel Sakamoto',
      titulo: 'Sócio fundador',
      oab: '', // PREENCHER
    },
    {
      nome: 'Dra. Sonia Sakamoto',
      titulo: 'Sócia',
      oab: '', // PREENCHER
    },
  ],

  // === CONTATO ===
  telefone: '(18) 3221-1222',
  telefoneLink: '551832211222',
  whatsapp: '551832211222',
  email: 'contato@samuelsakamoto.adv.br',

  // === ENDEREÇO ===
  endereco: {
    rua: 'R. Francisco Machado de Campos, 393',
    complemento: '',
    bairro: 'Vila Nova',
    cidade: 'Presidente Prudente',
    estado: 'SP',
    cep: '19010-300',
    completo:
      'R. Francisco Machado de Campos, 393 - Vila Nova, Presidente Prudente/SP - CEP 19010-300',
  },

  // === HORÁRIO DE ATENDIMENTO ===
  horario: 'Segunda a Sexta, 08:00 às 18:00',

  // === SITE / SEO ===
  dominio: 'https://samuelsakamoto.adv.br',
  descricaoSite:
    'Samuel Sakamoto Sociedade de Advogados em Presidente Prudente, SP. Quase três décadas de atuação jurídica com foco em Direito do Trabalho, Família e Sucessões, Previdenciário, Consumidor e Licitações Públicas.',
  palavrasChave: [
    'Samuel Sakamoto',
    'escritório de advocacia Presidente Prudente',
    'advogado Presidente Prudente',
    'direito do trabalho',
    'direito de família e sucessões',
    'direito previdenciário',
    'direito do consumidor',
    'licitação pública',
    'advogado trabalhista Presidente Prudente',
    'advogado previdenciário Presidente Prudente',
    'advogado família Presidente Prudente',
    'sociedade de advogados SP',
  ],

  // === SOBRE O ESCRITÓRIO ===
  sobreResumo:
    'Quase três décadas de atuação jurídica sólida em Presidente Prudente e região, com atendimento acolhedor e orientação precisa.',
  sobreHistoria: [
    'O escritório Samuel Sakamoto Sociedade de Advogados construiu uma trajetória de quase 30 anos baseada em ética, transparência e compromisso com cada cliente.',
    'O Dr. Samuel Sakamoto é referência regional, com ampla experiência prática em tribunais e atuação reconhecida em milhares de processos judiciais.',
    'Sua presença diária na mídia local, como comentarista jurídico na Rádio Jovem Pan Presidente Prudente, reforça a autoridade técnica e a confiança do público.',
    'A equipe multidisciplinar reúne advogados associados dedicados às áreas de Trabalho, Família e Sucessões, Previdenciário, Consumidor e Licitações Públicas.',
  ],

  // === FORMAÇÃO ACADÊMICA ===
  formacao: [
    {
      year: '1997',
      title: 'Fundação do Escritório',
      institution: 'Samuel Sakamoto Sociedade de Advogados',
    },
    {
      year: '2000+',
      title: 'Expansão e atuação regional',
      institution: 'Presidente Prudente e região',
    },
    {
      year: '2026',
      title: '29 anos de experiência jurídica',
      institution: 'Atuação consolidada e reconhecida na região',
    },
  ],

  // === AVALIAÇÕES (Google) ===
  avaliacaoGoogle: '5.0',
  totalAvaliacoes: 'Máxima',

  // === DEPOIMENTOS ===
  depoimentos: [
    {
      text: 'Excelente recepção e atendimento muito humano. Resolveram minha demanda com clareza e profissionalismo.',
      author: 'Cliente do Google',
      role: 'Cliente',
    },
    {
      text: 'Equipe atenciosa e preparada. Foi fácil entender cada etapa do processo.',
      author: 'Cliente do Google',
      role: 'Cliente',
    },
    {
      text: 'Referência na região. Atendimento acolhedor e técnico, com total segurança nas orientações.',
      author: 'Cliente do Google',
      role: 'Cliente',
    },
  ],

  // === REDES SOCIAIS ===
  redesSociais: {
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
  },

  // === IMAGENS ===
  imagens: {
    advogado:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80',
    escritorio:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    logo: '/images/samuel_sakamoto_logo.svg',
    logoAlt: '/images/samuel_sakamoto_mark.svg',
    logoMini: '/images/samuel_sakamoto_mark.svg',
  },

  // === GOOGLE MAPS ===
  googleMapsApiKey: '',
  googleMapsUrl:
    'https://maps.google.com/?q=Samuel+Sakamoto+Sociedade+de+Advogados+R.+Francisco+Machado+de+Campos,+393+-+Vila+Nova,+Presidente+Prudente+-+SP,+19010-300',
};

export default SITE_CONFIG;
