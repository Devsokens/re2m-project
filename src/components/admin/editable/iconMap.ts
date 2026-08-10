import {
  ClipboardList,
  GraduationCap,
  UsersRound,
  Workflow,
  ShieldCheck,
  Star,
  Landmark,
  Building2,
  Users,
  CircleCheck,
  CalendarDays,
  Award,
  Sparkles,
  Handshake,
  TrendingUp,
  Briefcase,
  Target,
  Trophy,
  Gem,
  HelpCircle
} from 'lucide-react';

// Closed registry — only the icon NAME (string) is ever persisted, never code.
export const iconMap: Record<string, React.ComponentType<any>> = {
  ClipboardList,
  GraduationCap,
  UsersRound,
  Workflow,
  ShieldCheck,
  Star,
  Landmark,
  Building2,
  Users,
  CircleCheck,
  CalendarDays,
  Award,
  Sparkles,
  Handshake,
  TrendingUp,
  Briefcase,
  Target,
  Trophy,
  Gem
};

export const FallbackIcon = HelpCircle;

export const getIcon = (name?: string): React.ComponentType<any> => (name && iconMap[name]) || FallbackIcon;
