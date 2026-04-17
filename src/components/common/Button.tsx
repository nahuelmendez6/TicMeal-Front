import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children, 
  ...props 
}) => {
  const sizeClass = size === 'md' ? '' : `btn-${size}`;
  const className = `btn btn-${variant} ${sizeClass} ${props.className || ''}`;

  return (
    <button 
      {...props} 
      className={className} 
      disabled={props.disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
