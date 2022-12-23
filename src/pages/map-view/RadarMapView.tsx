import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { BlipType, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import './RadarMapView.scss';
import AmChartsMapView from './AmChartsMapView';

import { ProjectSlider } from './ProjectSlider';

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
          // blip.Technology and the techFilters sent by Radar state is different
          // e.g. blip.Technology=['Geographical Information Systems']
          // whereas techFilters=['geographical-information-systems']
          // as a workaround, try to convert blip.Technology to techFilter format
          const blipTechnology = blip.Technology.map((tf) => {
            return tf.toLowerCase().replaceAll(' ', '-');
          });
          return blipTechnology.some((t) => techFilters.includes(t));
        }
      );
      setDisplayBlips(filteredBlipsAccordingToTechFilters);
    }
  }, [techFilters]);

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
          <AmChartsMapView blips={displayBlips} />
          <ProjectSlider blips={displayBlips} />
        </GridItem>
      </Grid>
    </div>
  );
};
