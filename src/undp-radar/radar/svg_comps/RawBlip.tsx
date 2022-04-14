import React from 'react';
import { useDataState } from '../../stores/data.state';

import { BlipType } from '../../types';

import './RawBlip.scss';

export const RawBlip: React.FC<{
  blip: BlipType;
  blipSize?: number;
  scaleFactor?: number;
  hoveredItem: BlipType | null;
  selectedItem: BlipType | null;
  getFill: (blip: BlipType, index: number) => string;
  setHoveredItem: (blip: BlipType | null) => void;
  setSelectedItem: (blip: BlipType | null) => void;
}> = ({
  blip,
  blipSize = 1,
  scaleFactor = 1,
  hoveredItem,
  selectedItem,
  getFill,
  setHoveredItem,
  setSelectedItem
}) => {
  const {
    state: {
      ui: { popupDisabled }
    },
    actions: { setUiPopup }
  } = useDataState();

  const closeTooltip = (): void => {
    setUiPopup({ isShown: false });
    setHoveredItem(null);
  };

  const onMouseMove: React.MouseEventHandler<SVGGElement> = (e) =>
    setUiPopup({
      top: e.pageY - 10,
      left: e.pageX + 15,
      isShown: popupDisabled ? false : true
    });

  const onMouseEnter = (): void => setHoveredItem(blip);

  // On click
  const onClick = (): void => {
    if (selectedItem && selectedItem.id === blip.id) setSelectedItem(null);
    else setSelectedItem(blip);
    closeTooltip();
  };

  const className1 = hoveredItem?.id === blip.id ? 'circle-pulse1' : '';
  const className2 = hoveredItem?.id === blip.id ? 'circle-pulse2' : '';

  return (
    <React.Fragment>
      <g
        key={blip.id}
        className='blip'
        id={`blip-${blip.id}`}
        transform={`translate(${blip.x * scaleFactor}, ${
          blip.y * scaleFactor
        })`}
        cursor='pointer'
        onClick={onClick}
        // onMouse stuff
        onMouseMove={onMouseMove}
        onMouseOut={closeTooltip}
        onMouseEnter={onMouseEnter}
      >
        <circle className='circle' r={6 * blipSize} fill={getFill(blip, 0)} />
        {/* https://codepen.io/riccardoscalco/pen/GZzZRz */}
        <circle
          className={`circle ${className1}`}
          r={8 * blipSize}
          strokeWidth={1.5 * blipSize}
          stroke={getFill(blip, 1)}
          fill='none'
        />
        <circle
          className={`circle ${className2}`}
          r={11 * blipSize}
          strokeWidth={0.5 * blipSize}
          stroke={getFill(blip, 2)}
          fill='transparent'
        />
      </g>
    </React.Fragment>
  );
};
