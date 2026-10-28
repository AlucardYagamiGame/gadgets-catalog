import { MotionConfig, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

import type {
  AnimationProviderProps,
  PageTransitionProps,
  RevealProps,
} from '../types';

export const AnimationProvider = ({ children }: AnimationProviderProps) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export const PageTransition = ({ children }: PageTransitionProps) => {
  const { pathname } = useLocation();
  const section = pathname.split('/')[1];

  return (
    <motion.div
      key={section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export const Reveal = ({ children, delay = 0 }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
