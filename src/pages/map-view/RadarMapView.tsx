/* eslint-disable @typescript-eslint/no-var-requires  */
/* eslint-disable @typescript-eslint/restrict-plus-operands  */
/* eslint no-var: 0 */

import React, { useEffect, useState, useReducer, useContext } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { BlipType, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  Tooltip
} from 'react-leaflet';
import { getCode } from 'country-list';

import { BlipPopOver, mapBlips } from './helpers';
import { ProjectSlider } from './ProjectSlider';
import { RadarContext } from 'navigation/context';

import './RadarMapView.scss';
var geos = require('geos-major');

export const RadarMapView: React.FC = () => {
  const {
    state: { techFilters, blips, isFiltered, filteredBlips },
    actions: { setTechFilter },
    processes: { setFilteredBlips }
  } = useRadarState();

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const setPopupClosed = useReducer((x: any) => x + 1, 0)[1];
  const [popupState, setPopupState] = useState('closed');
  const [countrySelected, setCountrySelected] = useState(false);
  const [countryProjects, setCountryProjects] = useState<BlipType[]>([]);
  const [techBlips, setTechBlips] = useState<BlipType[]>([]);

  const { setBlipsMerged, setRadarStateValues, setFiltered } =
    useContext(RadarContext);

  useEffect(() => {
    setTechFilter([]);
    setRadarStateValues({});
    if (isFiltered) {
      setFilteredBlips(false, blips);
    }
    return () => {
      setFilteredBlips(true, blips);
      setFiltered(false);
      setTechFilter([]);
    };
  }, []);

  useEffect(() => {
    mergeDiasterCycle();
  }, [blips, filteredBlips, techFilters, techBlips]);

  const merge: BlipType[] = [];

  /* Merge DisasterCycle of Techs with similar Ideas/Concepts/Examples */
  const mergeDiasterCycle = (): void => {
    let blipsToUse = [...blips];
    if (isFiltered) {
      blipsToUse = [...filteredBlips];
    }
    if (techBlips.length) {
      blipsToUse = [...techBlips];
    }

    blipsToUse.forEach(function (item) {
      const existingBips = merge.filter(function (v, i) {
        return v['Ideas/Concepts/Examples'] === item['Ideas/Concepts/Examples'];
      });

      if (existingBips.length) {
        const existingIndex = merge.indexOf(existingBips[0]);

        const disasterCycles =
          merge[existingIndex]['Disaster Cycle'].split(',');

        if (
          disasterCycles.length < 4 &&
          !disasterCycles.includes(item['Disaster Cycle'])
        ) {
          // @ts-expect-error
          merge[existingIndex]['Disaster Cycle'] = merge[existingIndex][
            'Disaster Cycle'
          ]
            .concat(',')
            .concat(item['Disaster Cycle']);
        }
      } else {
        merge.push(item);
      }
    });

    setDisplayBlips(merge);
    setBlipsMerged(true);
  };

  useEffect(() => {
    const filteredBlipsAccordingToTechFilters = filteredBlips.filter((blip) => {
      const blipTechnology = blip.Technology.map((tf) => {
        return tf.toLowerCase().replaceAll(' ', '-');
      });
      return blipTechnology.some((t) => techFilters.includes(t));
    });
    setTechBlips(filteredBlipsAccordingToTechFilters);
  }, [techFilters]);

  const getCordinates = (countryName: string): number[] => {
    const code = getCode(countryName);

    if (code) {
      const { latitude, longitude } = geos.country(code);
      return [latitude, longitude];
    }
    return [0, 0];
  };

  return (
    <div className='radarMapView' data-testid='map'>
      <Grid
        alignItems='center'
        templateColumns='repeat(auto-fit, minmax(400px, 1fr))'
      >
        <GridItem
          bg={'#fdfdfd'}
          mb={{ base: 0, md: 50 }}
          colSpan={{ sm: 1, md: 1, lg: 2 }}
          className='mapContainer'
        >
          <MapContainer
            // center={getCordinates('jamaica')}
            center={[-50, 0]}
            zoom={1}
            minZoom={2}
            attributionControl={false}
          >
            <TileLayer url='http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png' />
            {Array.from(mapBlips(displayBlips)).map((blipDetails) => {
              const countryName = blipDetails[0];
              return (
                <CircleMarker
                  key={blipDetails[0]}
                  center={getCordinates(countryName)}
                  // eventHandlers={{ click: (e: any) => {} }}
                  // @ts-expect-error
                  radius={Math.max((40 / 12) * blipDetails[1].length, 6)}
                  fillColor={'#2B6CB0'}
                  stroke={false}
                  fillOpacity={1}
                >
                  <Popup
                    eventHandlers={{
                      remove: () => {
                        setPopupState('closed');
                        setCountryProjects([]);
                        setCountrySelected(false);
                      },
                      add: () => {
                        setPopupState('open');
                        setCountryProjects(blipDetails[1]);
                        setCountrySelected(true);
                      }
                    }}
                  >
                    <BlipPopOver
                      projects={blipDetails[1]}
                      setPopupClosed={setPopupClosed}
                      popupState={popupState}
                      setCountryProjects={setCountryProjects}
                    />
                  </Popup>
                  <Tooltip
                    // @ts-expect-error
                    offset={[0, 0]}
                    opacity={1}
                  >
                    {`${countryName}${
                      blipDetails[1].length > 1
                        ? `: ${blipDetails[1].length} Projects`
                        : ''
                    }`}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
          {false && (
            <ProjectSlider
              blips={countrySelected ? countryProjects : displayBlips}
            />
          )}
        </GridItem>
      </Grid>
    </div>
  );
};
