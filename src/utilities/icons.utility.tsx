import React from 'react';

// Dynamically import all PNGs from the menu-icons directory
const menuIconModules = import.meta.glob('../assets/menu-icons/*.png', { eager: true, as: 'url' });

// Create a map from icon name (e.g., "BookText") to its URL
const iconSrcMap = Object.keys(menuIconModules).reduce((acc, path) => {
  const iconNameWithExtension = path.split('/').pop(); // e.g., "BookText.png"
  if (iconNameWithExtension) {
    const iconName = iconNameWithExtension.replace(/\.png$/, ''); // e.g., "BookText"
    acc[iconName] = menuIconModules[path];
  }
  return acc;
}, {} as Record<string, string>);

export type IconName = string;

// Dynamic Icon Component - uses provided PNGs or falls back to a placeholder
const DynamicIcon: React.FC<{ iconName: string; size?: number; className?: string }> = ({ iconName, size = 20, className }) => {
  const src = iconSrcMap[iconName];

  if (src) {
    return (
      <img
        src={src}
        alt={iconName}
        style={{ width: size, height: size, verticalAlign: 'middle' }}
        className={className}
      />
    );
  }

  // Fallback to placeholder if no PNG is found
  return (
    <img
      src={`https://via.placeholder.com/${size}?text=${iconName.substring(0, 1)}`}
      alt={iconName}
      style={{ width: size, height: size, verticalAlign: 'middle' }}
      className={className}
    />
  );
};

interface IconComponentProps {
  iconName: string | null | undefined;
  size?: number;
  className?: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ iconName, size = 18, className = "" }) => {
  return <DynamicIcon iconName={iconName || "Default"} size={size} className={className} />;
};

export default IconComponent;
