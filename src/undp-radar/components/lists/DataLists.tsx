/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { Utilities } from '../../helpers/Utilities';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { BlipType, RadarOptionsType } from '../../types';
import { RadarUtilities } from '../../radar/RadarUtilities';
// states
import { RadarAtoms } from '../../stores/atom.state';

import './DataLists.scss';
import { useAtom } from 'jotai';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipType[];
}

const ItemList: React.FC<Props> = ({ quadrant, horizon = null, blips }) => {
  const [techs] = useAtom(RadarAtoms.data.techs);
  const [techKey] = useAtom(RadarAtoms.key.techKey);
  const [quadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [horizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [titleKey] = useAtom(RadarAtoms.key.titleKey);

  const [hoveredItem, setHoveredItem] = useAtom(RadarAtoms.hoveredItem);
  const [hoveredTech] = useAtom(RadarAtoms.hoveredTech);
  const [, setSelectedItem] = useAtom(RadarAtoms.selectedItem);

  return (
    <ScrollableDiv maxHeight={200}>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          textAlign: 'left',
          fontSize: 14
        }}
      >
        {blips.map((blip) => {
          const onMouseEnter = () => setHoveredItem(blip);
          const onMouseLeave = () => setHoveredItem(null);
          const getHoveredStyle = () => {
            const tech = techs.find((t) => t.type === blip[techKey]);
            if (hoveredItem?.id === blip.id) {
              if (hoveredTech === null || hoveredTech === tech?.slug)
                return 'blipItemHovered';
            }
            return '';
          };
          if (
            blip[quadrantKey] === quadrant.name &&
            (horizon === null || blip[horizonKey] === horizon.name)
          )
            return (
              <li
                key={`${blip.id}-${quadrant.uuid}-${horizon && horizon.uuid}`}
                className={'blipItemWrapper'}
              >
                <button
                  className={`${'blipItem'} ${getHoveredStyle()}`}
                  onClick={() => setSelectedItem(blip)}
                  type='button'
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {blip[titleKey]}
                </button>
              </li>
            );
          return null;
        })}
      </ul>
    </ScrollableDiv>
  );
};

export const DataLists: React.FC = () => {
  const [blips] = useAtom(RadarAtoms.blips);
  const [selectedQuadrant] = useAtom(RadarAtoms.selectedQuadrant);

  const [techFilters] = useAtom(RadarAtoms.techFilters);

  const [quadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [horizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [techKey] = useAtom(RadarAtoms.key.techKey);
  const [isFiltered] = useAtom(RadarAtoms.isFiltered);
  const [filteredBlips] = useAtom(RadarAtoms.filteredBlips);

  const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
  const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

  const [myBlips, setMyBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    let newBlips = isFiltered ? filteredBlips : blips;

    if (selectedQuadrant) {
      newBlips = newBlips.filter(
        (blip) => blip[quadrantKey] === selectedQuadrant
      );
    }
    setMyBlips(newBlips);
  }, [blips, selectedQuadrant]);

  useEffect(() => {
    if (blips && blips.length > 0) {
      const newHeaders: ListMatrixItem[] = [];
      RadarUtilities.getQuadrants(blips, quadrantKey).forEach((header) => {
        if (
          !selectedQuadrant ||
          (selectedQuadrant && selectedQuadrant === header)
        ) {
          newHeaders.push({ uuid: uuidv4(), name: header });
        }
      });
      const newHorizons: ListMatrixItem[] = [];
      RadarUtilities.getHorizons(blips, horizonKey).forEach((horizon) =>
        newHorizons.push({ uuid: uuidv4(), name: horizon })
      );
      setHeaders(newHeaders);
      setHorizons(newHorizons);
    }
  }, [blips, selectedQuadrant]);

  // const setSelectedItemLogic = (item: BlipType) => {
  //   setSelectedItem(item);
  //   setHoveredItem(null);
  // };

  return (
    <section>
      {techFilters.length > 0 && (
        <React.Fragment>
          <header
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {headers.map((header) => (
              <div
                key={header.uuid}
                className='column'
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 200
                }}
              >
                <Title label={Utilities.capitalize(header.name)} type='h4' />
                <ItemList
                  blips={myBlips.filter(
                    (b) =>
                      Utilities.checkItemHasTechFromMultiple(
                        b,
                        techFilters,
                        techKey
                      ) && b[quadrantKey] === header.name
                  )}
                  quadrant={header}
                />
              </div>
            ))}
          </header>
        </React.Fragment>
      )}
      {techFilters.length === 0 && (
        <React.Fragment>
          <header>
            {headers.map((header) => (
              <div key={header.uuid} className='col'>
                <Title label={Utilities.capitalize(header.name)} type='h4' />
              </div>
            ))}
          </header>
          <div className='row'>
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[0].uuid}`} className='col'>
                <Title
                  label={Utilities.capitalize(horizons[0].name)}
                  type='h5'
                />

                <ItemList
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[0]}
                />
              </div>
            ))}
          </div>

          <div className='row'>
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[1].uuid}`} className='col'>
                <Title
                  label={Utilities.capitalize(horizons[1].name)}
                  type='h5'
                />

                <ItemList
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[1]}
                />
              </div>
            ))}
          </div>

          <div className='row'>
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[2].uuid}`} className='col'>
                <Title
                  label={Utilities.capitalize(horizons[2].name)}
                  type='h5'
                />

                <ItemList
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[2]}
                />
              </div>
            ))}
          </div>

          <div className='row'>
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[3].uuid}`} className='col'>
                <Title
                  label={Utilities.capitalize(horizons[3].name)}
                  type='h5'
                />

                <ItemList
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[3]}
                />
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </section>
  );
};
