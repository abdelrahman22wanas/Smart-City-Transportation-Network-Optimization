import React from 'react';

export default function GlowCard({ children, className = '', as: Component = 'div', ...props }) {
  const combinedClassName = ['glow-card', className].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}