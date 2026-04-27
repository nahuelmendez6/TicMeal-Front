import React from 'react';
import { useDrag } from 'react-dnd';
import type { MenuItem } from '../../types/menu'
import IconComponent,  {type IconName } from '../../utilities/icons.utility';
const ItemTypes = {
  MENU_ITEM: 'menu_item',
};
/**
 * Componente para un ítem de menú arrastrable.
 */
const DraggableMenuItem = React.memo(({ item }: { item: MenuItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MENU_ITEM,
    item: { ...item }, // Pasar todos los datos del ítem
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`d-flex align-items-center p-3 mb-2 bg-white border rounded shadow-sm hover-shadow transition-all cursor-grab ${isDragging ? 'opacity-50 border-primary border-dashed' : ''}`}
    >
      <IconComponent iconName={item.iconName as IconName | null} size={32} />
      <span className="ms-3 fw-medium">{item.name}</span>
    </div>
  );
});

export default DraggableMenuItem;