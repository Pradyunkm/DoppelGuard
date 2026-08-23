import React from 'react';
import { Check, ShieldCheck, Building2 } from 'lucide-react';

interface BadgeProps {
  type?: 'verified' | 'business' | 'official' | 'none';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedBadge: React.FC<BadgeProps> = ({ type = 'verified', size = 'sm', className = '' }) => {
  if (type === 'none') return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-[11px]',
    lg: 'w-6 h-6 text-xs'
  }[size];

  if (type === 'business') {
    return (
      <span
        title="Verified Business Account"
        className={`inline-flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs ${sizeClasses} ${className}`}
      >
        <Building2 className="w-2.5 h-2.5" />
      </span>
    );
  }

  if (type === 'official') {
    return (
      <span
        title="Official Registered Entity"
        className={`inline-flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs ${sizeClasses} ${className}`}
      >
        <ShieldCheck className="w-2.5 h-2.5" />
      </span>
    );
  }

  return (
    <span
      title="Verified Account"
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-xs ${sizeClasses} ${className}`}
    >
      <Check className="w-2.5 h-2.5 stroke-[3]" />
    </span>
  );
};
