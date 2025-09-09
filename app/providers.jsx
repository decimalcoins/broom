'use client';

import { PiProvider } from '@/context/PiContext';

export default function Providers({ children }) {
  return <PiProvider>{children}</PiProvider>;
}
