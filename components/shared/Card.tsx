
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 ${className}`}>
      {title && (
        <h3 className={`text-xl font-semibold mb-4 text-cyan-300 ${titleClassName}`}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
