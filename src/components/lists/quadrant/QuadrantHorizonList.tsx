import React, { useEffect, useState } from 'react';
import {
  BlipType,
  Utilities,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { HorizonItem } from './HorizonItem';
import { BlipView } from '../../views/blip/BlipView';
import { ScrollableDiv } from '../../lists/components/ScrollableDiv';
import { TechDescription } from '../../../radar/tech/TechDescription';
import './DataLists.scss';

export type BlipsPerQuadType = Record<string, BlipType[]>;

interface Props {
  blips: BlipType[];
  quadIndex: number | false;
}
export const QuadrantHorizonList: React.FC<Props> = ({ blips, quadIndex }) => {
  const {
    state: {
      techFilters,
      radarData: { horizons },
      selectedItem
    }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey, techKey }
    }
  } = useDataState();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [displayHBlips, setDisplayHBlips] = useState<BlipsPerQuadType>({});

  useEffect(() => {
    if (techFilters.length > 0) {
      setDisplayBlips(
        blips.filter((b) => {
          let hasTech = false;
          (b[techKey] || []).forEach((blipTech) => {
            if (techFilters.includes(Utilities.createSlug(blipTech)))
              hasTech = true;
          });
          return hasTech;
        })
      );
    } else {
      setDisplayBlips(blips);
    }
  }, [blips, techFilters]);

  useEffect(() => {
    const newDisplayBlipsByHorizon: BlipsPerQuadType = {};
    displayBlips.forEach((blip) => {
      newDisplayBlipsByHorizon[blip[horizonKey]] = [
        ...(newDisplayBlipsByHorizon[blip[horizonKey]] || []),
        blip
      ];
    });
    setDisplayHBlips(newDisplayBlipsByHorizon);
  }, [displayBlips, horizonKey, quadIndex]);

  useEffect(() => {
    if (techFilters && techFilters.length > 0) {
      setTabIndex(1);
    }
  }, [techFilters]);

  useEffect(() => {
    if (selectedItem) {
      setTabIndex(2);
    }
  }, [selectedItem]);

  const tabsChangeHandler = (ind: number) => {
    setTabIndex(ind);
  };

  const [sourceHorizon, setSourceHorizon] = useState<string>();

  const triggerSiblings = (horizon: string) => setSourceHorizon(horizon);

  /**
   * @ImplNote
   * Unfortunately we need to use Chakra-ui as least as possible. If we come up with
   * a deep enough DOM structure using Box, Flex and Accordions, the radar will start
   * to suffer performance. Not because the radar is impacting, but because Chakra
   * constructs Components that need to allow for all sorts of use cases, therefore they
   * need to implement too much.
   * We do not.
   * So we use simple divs whenever - also, consider removing these 2 Boxes here.
   */
  return (
    <div
      style={{
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 40,
        padding: '15px 5px'
      }}
    >
      <Tabs variant='enclosed' index={tabIndex} onChange={tabsChangeHandler}>
        <TabList>
          <Tab as='h5'>Stages</Tab>
          <Tab as='h5'>Technologies</Tab>
          <Tab as='h5'>Project</Tab>
        </TabList>
        <TabPanels minHeight={445}>
          <TabPanel>
            <div
              style={{
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 2,
                borderRadius: 10,
                margin: 5,
                marginLeft: 0,
                marginRight: 0,
                padding: 10
              }}
            >
              {horizons.map((horizon) => (
                <HorizonItem
                  key={horizon}
                  horizonName={Utilities.capitalize(horizon)}
                  quadrantBlips={displayHBlips[horizon]}
                  triggerSiblings={triggerSiblings}
                  close={!(sourceHorizon === Utilities.capitalize(horizon))}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel overflowY='auto'>
            <TechDescription />
          </TabPanel>
          <TabPanel>
            <ScrollableDiv maxHeight={413}>
              <BlipView />
            </ScrollableDiv>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
