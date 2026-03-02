// Mapeamento central de imagens
// Imagens do escritório e Unsplash (uso gratuito)

export const IMAGES = {
  // Foto dos sócios
  lawyer:
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',

  // Hero background - Estátua da Justiça
  hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80',

  // Escritório / ambiente profissional
  office:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',

  // Logotipo
  logo: '/images/samuel_sakamoto_logo.svg',
  logoAlt: '/images/samuel_sakamoto_mark.svg',
  logoMini: '/images/samuel_sakamoto_mark.svg',
} as const;

// Imagens por área de atuação (cada uma única, sem repetição)
export const AREA_IMAGES: Record<string, string> = {
  'Direito do Trabalho':
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  'Direito de Família e Sucessões':
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
  'Direito Previdenciário':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  'Direito do Consumidor':
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
  'Licitação Pública':
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
};

// Imagens por categoria de blog (reutiliza áreas + fallback para 'Direito' genérico)
export const BLOG_IMAGES: Record<string, string> = {
  ...AREA_IMAGES,
  Direito:
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
};

// Imagem padrão (fallback)
export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80';

// Helper
export function getCategoryImage(category: string): string {
  return BLOG_IMAGES[category] || AREA_IMAGES[category] || DEFAULT_IMAGE;
}
