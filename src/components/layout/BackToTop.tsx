import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900/90 hover:bg-amber-600 text-white rounded-full shadow-lg backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 cursor-pointer focus:outline-hidden"
      aria-label="Scroll back to top"
      title="Back to Top"
    >
      <ArrowUp size={20} />
    </button>
  );
};
