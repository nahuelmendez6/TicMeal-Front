import React from 'react';
import IconComponent from '../../utilities/icons.utility';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ isOpen, onClose, onSelectIcon }) => {
  if (!isOpen) {
    return null;
  }

  const handleIconClick = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select an Icon</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-wrap justify-content-center">
              {[
                "Plus", "Coffee", "Sandwich", "Apple", "Pizza", "Trash2", "Beef", "Hamburger",
                "IceCreamBowl", "Salad", "Soup", "Utensils", "Wine", "Banana", "Cookie", "Croissant", "Dessert",
                "Drumstick", "EggFried", "Ham", "IceCreamCone", "CupSoda", "CakeSlice", "Beer", "Torus", "Donut",
                "Egg", "GlassWater", "Milk", "PackagePlus", "FilePenLine", "Pasta", "Tea", "Toast", "MenuOne", "Latte"
              ].map((iconName) => (
                <div
                  key={iconName}
                  className="p-2 m-1 border rounded d-flex align-items-center justify-content-center hover-shadow transition-all"
                  style={{ cursor: 'pointer', width: '80px', height: '80px', backgroundColor: 'var(--color-gray-100)' }}
                  onClick={() => handleIconClick(iconName)}
                  title={iconName}
                >
                  <IconComponent iconName={iconName} size={64} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
