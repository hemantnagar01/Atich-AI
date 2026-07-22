import React from 'react';
import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';

type AnimationMode = 'auto-rotate' | 'rotate-on-hover' | 'stop-rotate-on-hover';

interface BorderRotateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
  animationMode?: AnimationMode;
  animationSpeed?: number;
  gradientColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  backgroundColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  style?: CSSProperties;
}

const defaultGradientColors = {
  primary: '#0d9488',   // teal-600
  secondary: '#14b8a6', // teal-500
  accent: '#2dd4bf'     // teal-400
};

const BorderRotate: React.FC<BorderRotateProps> = ({
  children,
  className = '',
  animationMode = 'auto-rotate',
  animationSpeed = 4,
  gradientColors = defaultGradientColors,
  backgroundColor = '#171717',
  borderWidth = 1,
  borderRadius = 16,
  style = {},
  ...props
}) => {
  const getAnimationClass = () => {
    switch (animationMode) {
      case 'auto-rotate': return 'gradient-border-auto';
      case 'rotate-on-hover': return 'gradient-border-hover';
      case 'stop-rotate-on-hover': return 'gradient-border-stop-hover';
      default: return '';
    }
  };
 
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        ...style,
      }}
      {...props}
    >
      {/* Rotating Background */}
      <div 
        className={`absolute inset-[-100%] z-0 ${getAnimationClass()}`}
        style={{
          backgroundImage: `conic-gradient(from 0deg, ${gradientColors.primary} 0%, ${gradientColors.secondary} 37%, ${gradientColors.accent} 30%, ${gradientColors.secondary} 33%, ${gradientColors.primary} 40%, ${gradientColors.primary} 50%, ${gradientColors.secondary} 77%, ${gradientColors.accent} 80%, ${gradientColors.secondary} 83%, ${gradientColors.primary} 90%)`,
          animationDuration: `${animationSpeed}s`,
        }}
      />
      {/* Inner Content */}
      <div 
        className="relative z-10 w-full h-full"
        style={{
          backgroundColor,
          borderRadius: `${borderRadius - borderWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { BorderRotate };
