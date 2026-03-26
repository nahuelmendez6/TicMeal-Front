import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="container-fluid">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default PageLayout;
