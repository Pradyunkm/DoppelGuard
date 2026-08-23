import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hasStoryRing?: boolean;
  hasUnseenStory?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  hasStoryRing = false,
  hasUnseenStory = false,
  className = '',
  onClick
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const ringPaddingMap = {
    xs: 'p-[1.5px]',
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3px]',
    xl: 'p-[4px]',
    '2xl': 'p-[4px]'
  };

  const fallbackInitial = alt ? alt.charAt(0).toUpperCase() : '?';

  const avatarContent = (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold shrink-0 select-none ${sizeMap[size]}`}
    >
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <span className="text-sm font-bold">{fallbackInitial}</span>
      )}
    </div>
  );

  if (!hasStoryRing) {
    return (
      <div
        onClick={onClick}
        className={`inline-block shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      >
        {avatarContent}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${ringPaddingMap[size]} ${
        hasUnseenStory
          ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 animate-gradient-x'
          : 'bg-neutral-300 dark:bg-neutral-700'
      } ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
    >
      <div className="rounded-full bg-white dark:bg-neutral-950 p-[2px]">
        {avatarContent}
      </div>
    </div>
  );
};
