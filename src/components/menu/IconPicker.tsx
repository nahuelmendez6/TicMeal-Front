import React from 'react';
import { iconMapList, type IconName } from '../../utilities/icons.utility';
import IconComponent from '../../utilities/icons.utility';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: IconName) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ isOpen, onClose, onSelectIcon }) => {
  if (!isOpen) {
    return null;
  }

  const handleIconClick = (iconName: IconName) => {
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
              {Object.keys(iconMapList).map((iconName) => (
                <div
                  key={iconName}
                  className="p-2 m-1 border rounded-sm d-flex align-items-center justify-content-center"
                  style={{ cursor: 'pointer', width: '60px', height: '60px' }}
                  onClick={() => handleIconClick(iconName as IconName)}
                >
                  <IconComponent iconName={iconName as IconName} size={32} />
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
