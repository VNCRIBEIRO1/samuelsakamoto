'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  children?: ReactNode;
  light?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {badge && (
        <span
          className={`inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-4 ${
            light
              ? 'bg-white/20 text-white'
              : 'bg-primary-50 text-primary-500'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`section-title ${
          light ? 'text-white' : ''
        } ${centered ? 'mx-auto' : ''}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`section-subtitle ${
            light ? 'text-primary-200' : ''
          } ${centered ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
