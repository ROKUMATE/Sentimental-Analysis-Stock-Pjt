'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedGrid } from '@/components/ui/animated-background';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen relative">
        <AnimatedGrid />
        <Navbar />
        <div className="flex flex-1 overflow-hidden z-10">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative perspective-[1200px]">
             {/* 
                AnimatePresence MUST wrap the motion.div. 
                mode="wait" ensures old component exits before new one enters. 
             */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full h-full"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
