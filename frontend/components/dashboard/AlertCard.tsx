'use client';

import { Alert } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const AlertCard = ({ alert }: { alert: Alert }) => {
  const metadata = alert.metadata;
  const isHighImpact = metadata.impactScore >= 70;
  const isMediumImpact = metadata.impactScore >= 40 && metadata.impactScore < 70;

  const getColors = () => {
    if (isHighImpact) return {
      border: 'border-l-neutral-700',
      icon: 'bg-red-500/10 text-red-500',
      shadow: 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
    };
    if (isMediumImpact) return {
      border: 'border-l-neutral-700',
      icon: 'bg-yellow-500/10 text-yellow-500',
      shadow: 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
    };
    return {
      border: 'border-l-neutral-700',
      icon: 'bg-blue-500/10 text-blue-500',
      shadow: 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
    };
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={
        isHighImpact
          ? { opacity: 1, y: 0, x: [-2, 2, -2, 2, 0] }
          : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 mb-2 transition-all border-l-2 relative overflow-hidden overflow-visible rounded-r-md bg-transparent hover:bg-card/40 ${colors.border} ${colors.shadow}`}
    >
      {isHighImpact && (
        <span className="absolute top-4 right-4 flex h-2.5 w-2.5 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
        </span>
      )}
      <div className="flex items-start gap-3 relative z-10">
        <div className={`p-2 rounded-lg flex-shrink-0 ${colors.icon}`}>
          {isHighImpact ? (
            <AlertTriangle className="h-4 w-4" />
          ) : isMediumImpact ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
             <Info className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs font-medium text-foreground mb-1">
            {alert.message.split('—')[0].trim()}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs border-foreground/10">
              {metadata.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Impact: {metadata.impactScore}%
            </span>
          </div>
          <time
            dateTime={alert.createdAt}
            className="text-xs text-muted-foreground"
            suppressHydrationWarning
          >
            {new Date(alert.createdAt).toLocaleTimeString()}
          </time>
        </div>
      </div>
    </motion.div>
  );
};

