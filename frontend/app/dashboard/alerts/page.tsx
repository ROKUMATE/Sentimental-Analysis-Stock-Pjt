'use client';

import { useFetch } from '@/hooks/useFetch';
import { alertsAPI } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, AlertTriangle, Info, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AlertsPage() {
  const { data: alerts, loading: alertsLoading } = useFetch(() =>
    alertsAPI.getAll()
  );

  const sortedAlerts = alerts
    ? [...alerts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const highImpactAlerts = sortedAlerts.filter((a) => (a.metadata?.impactScore || 0) >= 70);
  const mediumImpactAlerts = sortedAlerts.filter((a) => (a.metadata?.impactScore || 0) >= 40 && (a.metadata?.impactScore || 0) < 70);
  const lowImpactAlerts = sortedAlerts.filter((a) => (a.metadata?.impactScore || 0) < 40);

  return (
    <div className="p-6 space-y-0 relative z-10 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b-2 border-border/60">
        <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
        <p className="text-muted-foreground">
          Real-time notifications for market sentiment changes.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-x-2 divide-border/60 border-b-2 border-border/60">
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Alerts</p>
          <div className="text-2xl font-bold text-foreground">
            {alertsLoading ? <Skeleton className="w-12 h-8" /> : sortedAlerts.length}
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">High Impact</p>
          <div className="text-2xl font-bold text-red-500">
            {alertsLoading ? <Skeleton className="w-12 h-8" /> : highImpactAlerts.length}
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Medium Impact</p>
          <div className="text-2xl font-bold text-yellow-500">
            {alertsLoading ? <Skeleton className="w-12 h-8" /> : mediumImpactAlerts.length}
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Low Impact</p>
          <div className="text-2xl font-bold text-blue-500">
            {alertsLoading ? <Skeleton className="w-12 h-8" /> : lowImpactAlerts.length}
          </div>
        </div>
      </div>

      {alertsLoading ? (
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
             <Skeleton key={i} className="h-24 w-full rounded-xl bg-muted/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
          ))}
        </div>
      ) : sortedAlerts.length > 0 ? (
        <div className="py-6 space-y-6">
          <CollapsibleAlertSection 
            title="High Impact Alerts" 
            alerts={highImpactAlerts} 
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />} 
            badgeColor="bg-red-500/10 text-red-500 border-red-500/30"
            defaultOpen={true}
          />
          <CollapsibleAlertSection 
            title="Medium Impact Alerts" 
            alerts={mediumImpactAlerts} 
            icon={<AlertCircle className="h-5 w-5 text-yellow-500" />} 
            badgeColor="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          />
          <CollapsibleAlertSection 
            title="Low Impact Alerts" 
            alerts={lowImpactAlerts} 
            icon={<Info className="h-5 w-5 text-blue-500" />} 
            badgeColor="bg-blue-500/10 text-blue-500 border-blue-500/30"
          />
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground mt-8">
          No alerts yet. Enable alerts on tracked assets to get notifications.
        </div>
      )}
    </div>
  );
}

function CollapsibleAlertSection({ title, alerts, icon, badgeColor, defaultOpen = false }: { title: string, alerts: any[], icon: React.ReactNode, badgeColor: string, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (alerts.length === 0) return null;

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card/20 backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-background/50 hover:bg-muted/30 transition-colors border-b border-border/30"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <Badge variant="outline" className={badgeColor}>{alerts.length}</Badge>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
              >
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlertItem({ alert }: { alert: any }) {
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
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { 
          opacity: 1, 
          y: 0,
          x: isHighImpact ? [-2, 2, -2, 2, 0] : 0, 
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      whileHover={{ scale: 1.01 }}
      className={`p-5 mb-3 transition-all border-l-2 relative overflow-hidden overflow-visible rounded-r-lg bg-transparent hover:bg-card/40 ${colors.border} ${colors.shadow}`}
    >
      {isHighImpact && (
        <span className="absolute top-5 right-5 flex h-2.5 w-2.5 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
        </span>
      )}
      
      <div className="flex items-start gap-4 pr-6 relative z-10">
        <div className={`p-3 rounded-lg flex-shrink-0 ${colors.icon}`}>
          {isHighImpact ? (
            <AlertTriangle className="h-5 w-5" />
          ) : isMediumImpact ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
             <Info className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground mb-2">
            {alert.message.split('—')[0].trim()}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Sentiment</p>
              <p className="text-sm font-semibold text-foreground">
                {(metadata.sentimentScore * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Impact</p>
              <p className="text-sm font-semibold text-foreground">
                {metadata.impactScore}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <Badge variant="outline" className="text-xs border-foreground/10">
                {metadata.category}
              </Badge>
            </div>
          </div>

          <time
            dateTime={alert.createdAt}
            className="text-xs text-muted-foreground"
            suppressHydrationWarning
          >
            {new Date(alert.createdAt).toLocaleString()}
          </time>
        </div>
      </div>
    </motion.div>
  );
}

