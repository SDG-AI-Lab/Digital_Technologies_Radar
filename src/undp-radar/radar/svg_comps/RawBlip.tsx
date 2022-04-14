import React from 'react';
import { v4 } from 'uuid';
import { useAtom } from 'jotai';
import { TechKey } from '../../../undp-radar';
// import { TechKey } from '@undp_sdg_ai_lab/undp-radar';

import { BlipType, TechItemType } from '../../types';
import { RadarAtoms } from '../../stores/atom.state';

import './RawBlip.scss';

export const RawBlip: React.FC<{
  blip: BlipType;
  techKey: TechKey;
  blipSize?: number;
  scaleFactor?: number;
}> = ({ blip, techKey, blipSize = 1, scaleFactor = 1 }) => {
  const [selectedItem, setSelectedItem] = useAtom(RadarAtoms.selectedItem);
  const [hoveredItem, setHoveredItem] = useAtom(RadarAtoms.hoveredItem);
  const [hoveredTech] = useAtom(RadarAtoms.hoveredTech);
  const [techFilters] = useAtom(RadarAtoms.techFilters);

  const [techs] = useAtom(RadarAtoms.data.techs);

  const [, setPopoverIsShown] = useAtom(RadarAtoms.ui.popover.isShown);
  const [, setPopoverPosition] = useAtom(RadarAtoms.ui.popover.position);

  const grey = {
    color: 'rgba(100,100,100,.5)',
    uuid: v4(),
    type: '',
    slug: '',
    description: ['']
  };

  const fillLogic = (blip: BlipType): TechItemType[] => {
    const allItemTechs: TechItemType[] = [];
    techs.forEach((radarTech) => {
      const itemTechs = (blip[techKey] as string[]) || [];
      if (itemTechs.includes(radarTech.type)) allItemTechs.push(radarTech);
    });

    if (selectedItem !== null) {
      if (selectedItem.id === blip.id && allItemTechs.length > 0)
        return allItemTechs;
      return [grey];
    }

    // No hover on blip, no hover on tech and no tech filters logic
    if (!hoveredItem && !hoveredTech && techFilters.length === 0) {
      const itemTechs = (blip[techKey] as string[]) || [];
      const foundTechs = allItemTechs.filter((item) =>
        itemTechs.includes(item.type)
      );
      if (foundTechs && foundTechs.length > 0) return foundTechs;
      else return [grey];
    }

    if (
      (!hoveredItem && techFilters.length > 0) ||
      hoveredItem?.id === blip.id ||
      !!hoveredTech
    ) {
      if (techFilters && !hoveredItem && !hoveredTech) {
        const foundTech = allItemTechs.find((item) =>
          techFilters.includes(item.slug)
        );
        if (foundTech) return [foundTech];
        else return [grey];
      }

      if (hoveredTech === null) return allItemTechs;
      const itemHoveredTech = allItemTechs.find((i) => hoveredTech === i.slug);

      if (itemHoveredTech) {
        return [
          itemHoveredTech,
          ...allItemTechs.splice(allItemTechs.indexOf(itemHoveredTech), 1)
        ];
      }
    }

    if (allItemTechs.length > 0 && !techFilters && !hoveredItem && !hoveredTech)
      return allItemTechs;

    return [grey];
  };

  const getFill = (blip: BlipType, index: number) => {
    const fillings = fillLogic(blip);
    if (fillings[index]) return fillings[index].color;
    if (fillings && fillings[0] && fillings[0].color) return fillings[0].color;
    return grey.color;
  };

  const closeTooltip = (): void => {
    setPopoverIsShown(false);
    setHoveredItem(null);
  };

  const onMouseMove: React.MouseEventHandler<SVGGElement> = (e) => {
    setPopoverPosition({ top: e.pageY - 10, left: e.pageX + 15 });
    setPopoverIsShown(true);
  };

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
