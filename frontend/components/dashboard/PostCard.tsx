'use client';

import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const PostCard = ({ post }: { post: Post }) => {
  const sentiment = post.sentiment;
  const isPositive = (sentiment?.sentimentScore || 0) > 0.5;
  const isWhaleAlert = sentiment?.isWhaleAlert;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 transition-all border-b-2 border-border/60 last:border-0 relative overflow-hidden bg-transparent hover:bg-card/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground truncate">
              {post.author}
            </span>
            <Badge variant="secondary" className="text-xs">
              {post.source}
            </Badge>
            {isWhaleAlert && (
              <Badge className="bg-yellow-500/20 text-yellow-200 text-xs">
                Whale
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
            {post.content}
          </p>
        </div>

        {sentiment && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <p className="text-sm font-semibold text-foreground">
                  {(sentiment.sentimentScore * 100).toFixed(0)}%
                </p>
              </div>
              {/* Animated sentiment bar */}
              <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden ml-auto mb-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${sentiment.sentimentScore * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Impact: {sentiment.impactScore}
              </p>
            </div>
            <div
              className={`p-2 rounded-lg ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
              }`}
            >
              {isPositive ? (
                <ThumbsUp className="h-4 w-4" />
              ) : (
                <ThumbsDown className="h-4 w-4" />
              )}
            </div>
          </div>
        )}
      </div>

      {sentiment && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground relative z-10">
          <Badge variant="outline" className="text-xs">
            {sentiment.category}
          </Badge>
          <span className="truncate">{sentiment.reason}</span>
        </div>
      )}
    </motion.div>
  );
};
