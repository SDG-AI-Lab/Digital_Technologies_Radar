/* eslint-disable @typescript-eslint/no-var-requires  */
/* eslint no-var: 0 */

import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { BlipType, ToolTip, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { getCode } from 'country-list';

import { BlipPopOver, mapBlips, getRandomHexColor } from './helpers';
import { ProjectSlider } from './ProjectSlider';

import './RadarMapView.scss';
var geos = require('geos-major');

export const RadarMapView: React.FC = () => {
  const {
    state: { techFilters, blips, isFiltered, filteredBlips }
  } = useRadarState();

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    let blipsToUse = blips;
    if (isFiltered) {
      blipsToUse = filteredBlips;
    }
    setDisplayBlips(blipsToUse);
  }, [blips, filteredBlips]);

  useEffect(() => {
    if (techFilters.length > 0) {
      const filteredBlipsAccordingToTechFilters = displayBlips.filter(
        (blip) => {
          const blipTechnology = blip.Technology.map((tf) => {
            return tf.toLowerCase().replaceAll(' ', '-');
          });
          return blipTechnology.some((t) => techFilters.includes(t));
        }
      );
      setDisplayBlips(filteredBlipsAccordingToTechFilters);
    }
  }, [techFilters]);

  const getCordinates = (countryName: string): number[] => {
    const code = getCode(countryName);

    if (code) {
      const { latitude, longitude } = geos.country(code);
      return [latitude, longitude];
    }
    return [0, 0];
  };

  const colorMap: any = {
    recovery: '#E7D438',
    response: '#ED6058',
    preparedness: '#44936E',
    mitigation: '#A5E0FF'
  };

  return (
    <div className='radarMapView'>
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
            center={getCordinates('algeria')}
            zoom={2}
            // dragging={false}
            minZoom={2}
            attributionControl={false}
            fillColor='blue'
          >
            <TileLayer
              // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              url='http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
              // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {Array.from(mapBlips(displayBlips)).map((blipDetails) => {
              const countryName = blipDetails[0];
              const position = getCordinates(countryName);
              // const project = blipDetails[1][0][0];
              // const color = colorMap[project['Disaster Cycle']];
              const color = getRandomHexColor();
              return (
                <CircleMarker
                  key={blipDetails[0]}
                  center={position}
                  eventHandlers={{
                    click: (e: any) => {
                      console.log('marker clicked', e);
                    }
                  }}
                  // @ts-expect-error
                  radius={
                    blipDetails[1].length > 1 ? 4 * blipDetails[1].length : 8
                  }
                  radius={Math.max((33 / 12) * blipDetails[1].length, 9)}
                  color={color}
                  fill={true}
                  fillColor={color}
                  stroke={false}
                  fillOpacity={1}
                >
                  {/* <Popup>
                    <BlipPopOver project={project} />
                  </Popup> */}

                  <ToolTip>test</ToolTip>
                </CircleMarker>
              );
            })}
          </MapContainer>
          <ProjectSlider blips={displayBlips} />
        </GridItem>
      </Grid>
    </div>
  );
};
