import React from 'react';

// state
import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';

export const ToolTip: React.FC = ({ children }) => {
  const {
    state: {
      ui: {
        popup: { isShown, left, top },
        popupDisabled
      }
    }
  } = useDataState();

  const display = isShown ? 'initial' : 'none';

  return popupDisabled ? null : (
    <div style={{ display, position: 'absolute', top, left }}>
      {children && children}
      {!children && <DefaultToolTip />}
    </div>
  );
};

const DefaultToolTip: React.FC = () => {
  const {
    state: { hoveredItem }
  } = useRadarState();

  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();
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
