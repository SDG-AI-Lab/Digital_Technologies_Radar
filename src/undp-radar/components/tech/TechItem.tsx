import React, { useEffect, useState } from 'react';

import { BlipType, TechItemType, TechKey } from '../../types';
import { Utilities } from '../../helpers/Utilities';

import './TechItem.scss';

export const TechItem: React.FC<{
  tech: TechItemType;
  techKey: TechKey;
  hoveredTech: string | null;
  selected: boolean;
  techFilter: string[];
  setTechFilter: (techSlug: string[]) => void;
  setHoveredTech: (techSlug: string | null) => void;
  hoveredItem: BlipType | null;
}> = ({
  tech,
  techKey,
  hoveredTech,
  selected,
  techFilter,
  setTechFilter,
  setHoveredTech,
  hoveredItem
}) => {
  const selectTech = (): void => setTechFilter([...techFilter, tech.slug]);

  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(
    undefined
  );
  const [isItemHovered, setIsItemHovered] = useState(false);

  useEffect(() => {
    setBackgroundColor(
      selected ||
        (hoveredItem &&
          Utilities.checkItemHasTechFromMultiple(
            hoveredItem,
            [tech.slug],
            techKey
          ))
        ? tech.color
        : undefined
    );
    setIsItemHovered(
      tech.slug === hoveredTech ||
        Utilities.checkItemHasTechFromMultiple(
          hoveredItem,
          [tech.slug],
          techKey
        )
    );
  }, [tech, selected, hoveredItem, hoveredTech]);

  const changeBackgroundEnter = (): void => {
    setHoveredTech(tech.slug);
    setBackgroundColor(selected ? tech.color : tech.color);
  };
  const changeBackgroundLeave = (): void => {
    setHoveredTech(null);
    setBackgroundColor(selected ? tech.color : undefined);
  };

  return (
    <button
      style={{
        border: 'none',
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: 1,
        paddingLeft: 10,
        cursor: 'pointer',
        width: '100%'
      }}
      type='button'
      onClick={selectTech}
      onMouseEnter={changeBackgroundEnter}
      onMouseLeave={changeBackgroundLeave}
      onFocus={changeBackgroundEnter}
      onBlur={changeBackgroundLeave}
    >
      <div
        style={{ backgroundColor: tech.color, marginLeft: 10 }}
        className={'techItem'}
      />
      <div style={{ paddingLeft: 20, width: '100%' }}>
        <div
          style={{
            backgroundColor:
              isItemHovered || selected ? tech.color : backgroundColor,
            color: isItemHovered || selected ? 'white' : tech.color,
            padding: 4,
            border: 1,
            borderColor: 'lightgrey',
            borderStyle: 'solid',
            borderRadius: 5,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          {tech.type}
        </div>
      </div>
    </button>
  );
};
