'use client';

import Link from 'next/link';
import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const PostItem = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sentiment = post.sentiment;
  const isPositive = (sentiment?.sentimentScore || 0) > 0.5;
  const isWhaleAlert = sentiment?.isWhaleAlert;

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-6 transition-all border-b-2 border-border/60 last:border-0 relative overflow-hidden cursor-pointer bg-transparent hover:bg-card/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="flex flex-col gap-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-medium text-foreground truncate">
                @{post.author}
              </span>
              <Badge variant="secondary" className="text-xs">
                {post.source}
              </Badge>
              {isWhaleAlert && (
                <Badge className="bg-yellow-500/20 text-yellow-200 text-xs">
                  Whale Alert
                </Badge>
              )}
            </div>

            {post.asset && (
              <Badge variant="outline" className="text-xs mb-3 border-foreground/10">
                {post.asset.symbol}
              </Badge>
            )}

            <p className={`text-sm text-foreground/80 leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {post.content}
            </p>

            <div className="flex items-center justify-between">
              <time
                dateTime={post.postedAt}
                className="text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {new Date(post.postedAt).toLocaleString()}
              </time>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                {isExpanded ? 'Show less' : 'Show details'}
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </div>
            </div>
          </div>

          {sentiment && (
            <div className="flex-shrink-0 text-right">
              <div
                className={`p-3 rounded-lg ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                }`}
              >
                {isPositive ? (
                  <ThumbsUp className="h-5 w-5" />
                ) : (
                  <ThumbsDown className="h-5 w-5" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && sentiment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-border/10 space-y-4">
                {/* Sentiment Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                    <div className="flex items-center gap-2 justify-center">
                      <p className="text-sm font-semibold text-foreground">
                        {(sentiment.sentimentScore * 100).toFixed(0)}%
                      </p>
                      {/* Animated sentiment bar */}
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${sentiment.sentimentScore * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Impact</p>
                    <p className="text-sm font-semibold text-foreground">
                      {sentiment.impactScore}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(sentiment.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Category & Reason */}
                <div className="flex items-start gap-2 bg-card/40 p-3 rounded-lg border border-border/40">
                  <Badge variant="outline" className="text-xs whitespace-nowrap mt-0.5">
                    {sentiment.category}
                  </Badge>
                  <p className="text-sm text-foreground/80">{sentiment.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="text-xs hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]" asChild>
                      <Link href={`/dashboard/posts/${post.id}`}>View Details</Link>
                    </Button>
                  </motion.div>

                  {post.url && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="sm" className="text-xs hover:text-accent" asChild>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Source
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
