/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { Utilities } from '../../helpers/Utilities';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { BlipType, RadarOptionsType } from '../../types';
import { RadarUtilities } from '../../radar/RadarUtilities';
// states
import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';

import './DataLists.scss';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  radarData: RadarOptionsType;
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipType[];
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  setHoveredItem: (payload: BlipType | null) => void;
  setSelectedItem: (item: BlipType) => void;
}

const ItemList: React.FC<Props> = ({
  radarData,
  quadrant,
  horizon = null,
  blips,
  hoveredItem,
  hoveredTech,
  setHoveredItem,
  setSelectedItem
}) => {
  const {
    state: {
      keys: { techKey, titleKey, quadrantKey, horizonKey }
    }
  } = useDataState();
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
            const tech = radarData.tech.find((t) => t.type === blip[techKey]);
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
  const {
    state: { keys }
  } = useDataState();

  const {
    state: {
      blips,
      radarData,
      useCaseFilter,
      disasterTypeFilter,
      techFilters,
      hoveredItem,
      hoveredTech,
      selectedQuadrant
    },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
  const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

  const [myBlips, setMyBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    let newBlips = RadarUtilities.filterBlips(
      blips,
      keys,
      useCaseFilter,
      disasterTypeFilter
    );
    if (selectedQuadrant) {
      newBlips = newBlips.filter(
        (blip) => blip[keys.quadrantKey] === selectedQuadrant
      );
    }
    setMyBlips(newBlips);
  }, [blips, selectedQuadrant, useCaseFilter, disasterTypeFilter]);

  useEffect(() => {
    if (blips && blips.length > 0) {
      const newHeaders: ListMatrixItem[] = [];
      RadarUtilities.getQuadrants(blips, keys.quadrantKey).forEach((header) => {
        if (
          !selectedQuadrant ||
          (selectedQuadrant && selectedQuadrant === header)
        ) {
          newHeaders.push({ uuid: uuidv4(), name: header });
        }
      });
      const newHorizons: ListMatrixItem[] = [];
      RadarUtilities.getHorizons(blips, keys.horizonKey).forEach((horizon) =>
        newHorizons.push({ uuid: uuidv4(), name: horizon })
      );
      setHeaders(newHeaders);
      setHorizons(newHorizons);
    }
  }, [blips, selectedQuadrant]);

  const setSelectedItemLogic = (item: BlipType) => {
    setSelectedItem(item);
    setHoveredItem(null);
  };

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
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips.filter(
                    (b) =>
                      Utilities.checkItemHasTechFromMultiple(
                        b,
                        techFilters,
                        keys.techKey
                      ) && b[keys.quadrantKey] === header.name
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
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
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
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
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
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
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
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
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
