import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <select {...props} className="form-select">
        {children}
      </select>
    </div>
  );
};

export default Select;
