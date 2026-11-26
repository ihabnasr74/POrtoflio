import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ArtworkImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain' | 'custom';
  testId?: string;
}

export function ArtworkImage({
  src,
  alt,
  className = '',
  priority = false,
  fit = 'cover',
  testId,
}: ArtworkImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-[#111115] text-[#9A958C] p-6 text-center ${className}`}
      >
        <ImageOff className="w-5 h-5 opacity-60" aria-hidden="true" />
        <span className="text-xs tracking-wide">{alt}</span>
      </div>
    );
  }

  const fitClass =
    fit === 'contain' ? 'object-contain' : fit === 'cover' ? 'object-cover' : '';

  return (
    <img
      src={src}
      alt={alt}
      data-testid={testId}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${fitClass} ${className}`.trim()}
    />
  );
}
