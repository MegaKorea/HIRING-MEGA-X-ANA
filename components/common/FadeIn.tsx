'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { THEME } from '@/constants/theme';
import { cn } from '@/lib/utils';

type FadeInProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: THEME.motion.base, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
