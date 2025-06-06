
import React from 'react';
import { 
  Activity,
  Bell,
  Calendar,
  Clock,
  FileText,
  Monitor,
  Search,
  Settings,
  User,
  type LucideIcon
} from 'lucide-react';

// Map of available icons
const iconMap = {
  activity: Activity,
  bell: Bell,
  calendar: Calendar,
  clock: Clock,
  'file-text': FileText,
  monitor: Monitor,
  search: Search,
  settings: Settings,
  user: User,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, ...props }) => {
  const IconComponent = iconMap[name] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent size={size} {...props} />;
};

// Re-export individual icons for direct use
export {
  Activity,
  Bell,
  Calendar,
  Clock,
  FileText,
  Monitor,
  Search,
  Settings,
  User,
};
