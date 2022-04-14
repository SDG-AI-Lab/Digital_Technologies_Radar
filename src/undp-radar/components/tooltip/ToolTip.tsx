import { useAtom } from 'jotai';
import React from 'react';

// state
import { RadarAtoms } from '../../stores/atom.state';

export const ToolTip: React.FC = ({ children }) => {
  const [isDisabled] = useAtom(RadarAtoms.ui.popover.isDisabled);
  const [isShown] = useAtom(RadarAtoms.ui.popover.isShown);
  const [position] = useAtom(RadarAtoms.ui.popover.position);

  const display = isShown ? 'initial' : 'none';
  return isDisabled ? null : (
    <div style={{ display, position: 'absolute', ...position }}>
      {children && children}
      {!children && <DefaultToolTip />}
    </div>
  );
};

const DefaultToolTip: React.FC = () => {
  const [hoveredItem] = useAtom(RadarAtoms.hoveredItem);
  const [titleKey] = useAtom(RadarAtoms.key.titleKey);
  return (
    <div
      style={{
        backgroundColor: 'white',
        boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.25)',
        borderRadius: 10,
        padding: 5
      }}
    >
      {hoveredItem && hoveredItem[titleKey]}
    </div>
  );
};
