import React, { useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isSpecial?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", isSpecial = false }) => (
  <div className={`
    border-4 border-black bg-white p-4 pixel-shadow
    ${isSpecial ? 'bg-yellow-100 border-brazil-blue' : ''}
    ${className}
  `}>
    {children}
  </div>
);

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'neutral';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = "", disabled = false }) => {
  const baseStyle = "border-2 border-black font-bold text-xl px-4 py-2 pixel-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase";
  const variants: Record<string, string> = {
    primary: "bg-brazil-green text-white hover:bg-green-700",
    secondary: "bg-brazil-blue text-white hover:bg-blue-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    neutral: "bg-gray-200 text-black hover:bg-gray-300"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant || 'primary']} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue'|'green'|'yellow'|'red';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-brazil-blue text-white',
    green: 'bg-brazil-green text-white',
    yellow: 'bg-brazil-yellow text-brazil-blue',
    red: 'bg-red-600 text-white'
  };
  return (
    <span className={`${colors[color]} px-2 py-0.5 border-2 border-black text-sm font-bold uppercase`}>
      {children}
    </span>
  );
};

interface PixelFlagProps {
  code: string;
  name: string;
}

export const PixelFlag: React.FC<PixelFlagProps> = ({ code, name }) => {
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      {!error && (
        <img 
          src={`assets/flags/${code.toLowerCase()}.png`} 
          alt={name} 
          className="flag-pixel"
          onError={() => setError(true)}
        />
      )}
      <span className="team-code">{code.toUpperCase()}</span>
    </div>
  );
};