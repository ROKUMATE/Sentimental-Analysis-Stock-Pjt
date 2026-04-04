'use client';

import { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PostItem } from './PostItem';
import { motion, AnimatePresence } from 'framer-motion';

interface PostsFeedProps {
  posts?: Post[];
  loading?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const PostsFeed = ({ posts, loading }: PostsFeedProps) => {
  return (
    <div>
      {loading ? (
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl bg-muted/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <motion.div variants={listVariants} initial="hidden" animate="show">
          <AnimatePresence>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
          <p className="text-muted-foreground mb-2">No posts found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </motion.div>
      )}
    </div>
  );
};
