import {
  Building2,
  ClipboardCheck,
  Code2,
  GraduationCap,
  Repeat,
  Scale,
  School,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Os dados (src/data/indicators.ts) guardam apenas o nome do ícone; aqui o
 * nome vira o componente do lucide-react.
 */
export const icons: Record<string, LucideIcon> = {
  Building2,
  ClipboardCheck,
  Code2,
  GraduationCap,
  Repeat,
  Scale,
  School,
  TrendingUp,
  Users,
  Wifi,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? School;
}
