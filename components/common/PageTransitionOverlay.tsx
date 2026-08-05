'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useNavigation } from '@/lib/contexts/navigation.context';
import { THEME } from '@/constants/theme';

export function PageTransitionOverlay() {
  const { isNavigating } = useNavigation();

  return (
    <AnimatePresence>
      {isNavigating ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-[var(--bg-sunken)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: THEME.motion.fast }}
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-[var(--primary)]"
            initial={{ x: '-100%' }}
            animate={{ x: '300%' }}
            transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
