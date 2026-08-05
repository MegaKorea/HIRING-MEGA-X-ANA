import Image from 'next/image';
import { APP_BRAND, APP_ICON } from '@/constants/brand';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = 36, className, priority }: BrandLogoProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={APP_ICON}
        alt={APP_BRAND}
        width={size}
        height={size}
        priority={priority}
        className="h-[72%] w-[72%] object-contain"
      />
    </span>
  );
}
