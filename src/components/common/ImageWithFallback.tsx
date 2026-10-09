import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackIconSize?: number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackIconSize = 32,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-amber-50 via-sky-50 to-pink-50 flex flex-col items-center justify-center text-slate-400 p-4 border border-dashed border-amber-200/70 select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-amber-500 mb-1">
          <Package size={fallbackIconSize} />
        </div>
        <span className="text-xs font-medium text-slate-500 text-center line-clamp-1">{alt || 'Toy Image'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...rest}
      />
    </div>
  );
};
