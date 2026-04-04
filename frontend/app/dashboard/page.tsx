'use client';

import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { preferencesAPI, postsAPI, alertsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/dashboard/PostCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

// Mini Sparkline component (SVG)
const MiniSparkline = ({ color = 'text-accent' }: { color?: string }) => (
  <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${color} opacity-60 ml-auto`}>
    <motion.path 
      d="M2 18 L10 12 L18 15 L26 5 L38 8" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

export default function DashboardPage() {
  const { data: preferences, loading: prefLoading } = useFetch(() =>
    preferencesAPI.getAll()
  );

  const { data: posts, loading: postsLoading } = useFetch(() =>
    postsAPI.getAll({ limit: 5 })
  );

  const { data: alerts, loading: alertsLoading } = useFetch(() =>
    alertsAPI.getAll()
  );

  return (
    <div className="p-6 space-y-0 relative z-10 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b-2 border-border/60 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            {/* Blinking 'Live' indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">Live</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your market sentiment overview.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x-2 divide-border/60 border-b-2 border-border/60 perspective-[1000px]">
        
        {/* Tracked Assets (Neutral/Blue glow) */}
        <motion.div
          whileHover={{ rotateX: 4, rotateY: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-6 transition-all duration-300 hover:bg-accent/5 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tracked Assets</p>
              <div className="text-2xl font-bold text-foreground">
                {prefLoading ? (
                  <Skeleton className="w-12 h-8" />
                ) : (
                  <AnimatedCounter value={preferences?.length || 0} />
                )}
              </div>
            </div>
          </div>
          <MiniSparkline color="text-accent" />
        </motion.div>

        {/* Latest Posts (Positive/Green glow based on activity) */}
        <motion.div
          whileHover={{ rotateX: 4, rotateY: 0, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-6 transition-all duration-300 hover:bg-emerald-500/5 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Activity className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest Posts</p>
              <div className="text-2xl font-bold text-foreground">
                {postsLoading ? (
                  <Skeleton className="w-12 h-8" />
                ) : (
                  <AnimatedCounter value={posts?.length || 0} />
                )}
              </div>
            </div>
          </div>
          <MiniSparkline color="text-emerald-500" />
        </motion.div>

        {/* Active Alerts (Negative/Red glow) */}
        <motion.div
          whileHover={{ rotateX: 4, rotateY: 4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-6 transition-all duration-300 hover:bg-red-500/5 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] relative flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <div className="text-2xl font-bold text-foreground">
                {alertsLoading ? (
                  <Skeleton className="w-12 h-8" />
                ) : (
                  <AnimatedCounter value={alerts?.length || 0} />
                )}
              </div>
            </div>
          </div>
          <MiniSparkline color="text-red-500" />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1">
        {/* Posts Feed */}
        <div>
          <div className="p-6 border-b-2 border-border/60 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Recent Posts</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  View All
                </Button>
              </motion.div>
            </div>
          </div>
          <div>
            {postsLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-20 w-full rounded-xl bg-muted/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No posts yet. Start tracking assets to see sentiment data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
