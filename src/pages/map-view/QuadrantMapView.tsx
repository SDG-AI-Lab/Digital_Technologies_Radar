import React, { useEffect, useState } from 'react';
import {
  BlipType,
  QuadrantRadar,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { BackButton } from '../../radar/components';
import './QuadrantMapView.scss';
// import SearchResult from '../search/SearchResult';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, GridItem } from '@chakra-ui/react';
import AmChartsMapView from './AmChartsMapView';

export const QuadrantMapView: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant,
      techFilters,
      radarData: { quadrants }
    }
  } = useRadarState();

  const [bufferBlips, setBufferBlips] = useState<BlipType[]>([]);
  const [quadIndex, setQuadIndex] = useState<number | false>(false);

  const matchSmScreen = useMediaQuery('(max-width:576px)');

  const mapViewContainerStyle = {
    height: matchSmScreen ? '30vh' : '99vh',
    width: matchSmScreen ? '90vw' : '52.3vw'
  };

  useEffect(() => {
    const newBufferBlips = (isFiltered ? filteredBlips : blips).filter(
      (b) => b.quadrantIndex === quadIndex
    );

    if (techFilters.length > 0) {
      // filter by tech
      const techFilteredBufferBlips = newBufferBlips.filter((blip) => {
        // blip.Technology and the techFilters sent by Radar state is different
        // e.g. blip.Technology=['Geographical Information Systems']
        // whereas techFilters=['geographical-information-systems']
        // as a workaround, try to convert blip.Technology to techFilter format
        const blipTechnology = blip.Technology.map((tf) => {
          return tf.toLowerCase().replaceAll(' ', '-');
        });
        return blipTechnology.some((t) => techFilters.includes(t));
      });

      setBufferBlips(techFilteredBufferBlips);
    } else {
      setBufferBlips(newBufferBlips);
    }
  }, [filteredBlips, blips, isFiltered, quadIndex, techFilters]);

  useEffect(() => {
    if (selectedQuadrant) {
      setQuadIndex(quadrants.indexOf(selectedQuadrant));
    } else setQuadIndex(false);
  }, [selectedQuadrant]);

  return (
    <Grid templateColumns='fit-content(97%)'>
      <GridItem
        className='quadrantView'
        style={{ display: 'flex', flex: 1, padding: 2 }}
        colSpan={{ sm: 1, md: 1, lg: 1 }}
      >
        <BackButton to='RADAR' />
        <div className='quadrantRadar' style={{ flex: 1 }}>
          <QuadrantRadar />
        </div>
        {(quadIndex === 0 ||
          quadIndex === 1 ||
          quadIndex === 2 ||
          quadIndex === 3) && (
          <div
            className={matchSmScreen ? '' : 'horizontalMap'}
            style={{ flex: '2' }}
          >
            <AmChartsMapView
              blips={bufferBlips}
              containerStyle={mapViewContainerStyle}
            />
          </div>
        )}
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 1, lg: 1 }} pb={{ base: 67, md: 9 }}>
        {/* <SearchResult filteredContent={bufferBlips} pageSize={4} /> */}
      </GridItem>
    </Grid>
  );
};
