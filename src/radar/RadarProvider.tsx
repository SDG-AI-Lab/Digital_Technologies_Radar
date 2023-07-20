import React, { useEffect, useState } from 'react';
import {
  AddCSV,
  SetData,
  Utilities,
  KeysObject,
  RawBlipType,
  MappingType,
  DataProvider,
  RadarProvider,
  ColorsParamType,
  OrdersParamType,
  RadarDataGenerator
} from '@undp_sdg_ai_lab/undp-radar';
import '@undp_sdg_ai_lab/undp-radar/dist/index.css';

import csvData from '../assets/csv/tr_data_14_07_23_00.csv';
import csvData2 from '../assets/csv/tr_data_20_07_23_01.csv';

import { HorizonsNameComp } from './components/svg-hover/HorizonsNameComp';
import { QuadrantNameComp } from './components/svg-hover/QuadrantNameComp';
import { supabase } from 'helpers/databaseClient';

export const AppRadarProvider: React.FC = ({ children }) => {
  const [csvString, setCsvString] = useState('');
  useEffect(() => {
    console.log('bwahaaaa', { csvString });
    void getBlips();
  }, []);

  const getBlips = async (): Promise<void> => {
    const { data, error } = await supabase.from('project_data').select().csv();
    if (!error) {
      setCsvString(data);
      console.log({ data });
    }
  };
  const quadrantsDescription = {
    preparedness:
      'The knowledge and capacities developed by governments, response and recovery organizations, communities, and individuals to effectively anticipate, respond to and recover from the impacts of likely, imminent or current disasters.',
    response:
      'Actions taken directly before, during or immediately after a disaster to save lives, reduce health impacts, ensure public safety, and meet the basic subsistence needs of the people affected.',
    recovery:
      'The restoring or improving of livelihoods and health, as well as economic, physical, social, cultural, and environmental assets, systems, and activities, of a disaster-affected community or society, aligning with the principles of sustainable development and “build back better”, to avoid or reduce future disaster risk.',
    mitigation:
      'The lessening or minimizing of the adverse impacts of a hazardous event.'
  };

  const horizonsDescription = {
    production:
      'Digital Solutions is fully functional and readily available on the market for implementation.  ',
    validation:
      'Digital Solution has been identified and tested with a minimum functionality. Not available on the market for implementation. ',
    prototype:
      'Digital Solutions is fully functional. Not available on the market for implementation.  ',
    idea: 'Digital Solution has been identified and explained in the project document. Not available on the market for implementation.  '
  };

  const mapping: MappingType<RawBlipType> = (item: Record<string, string>) =>
    ({
      Region: Utilities.cleanupStringArray(item.region.split(',')),
      Subregion: Utilities.cleanupStringArray(item.subregion.split(',')),
      'Country of Implementation': Utilities.cleanupStringArray(
        item.country.replace(/[{}]/g, '').split(',')
      ),
      Data: Utilities.cleanupStringArray(item.data.split(',')),
      'Date of Implementation': item.date_of_implementation,
      Description: item.description,
      'Disaster Cycle': item.disaster_cycle,
      'Ideas/Concepts/Examples': item.title,
      Source: item.source,
      'Status/Maturity': item.status,
      'Supporting Partners': item.partner,
      'Un Host Organisation': Utilities.cleanupStringArray(
        item.un_host.split(',')
      ),
      'Use Case': item.use_case,
      SDG: Utilities.cleanupStringArray(
        item.sdg.replace(/[{}"]/g, '').split(',')
      ),
      Technology: Utilities.cleanupStringArray(item.technology.split(',')),
      'Disaster Type': item.disaster_type,
      Theme: item.theme,
      'Image Url': item.img_url,
      uuid: item.uuid
    } as unknown as RawBlipType);

  const keys: KeysObject = {
    techKey: 'Technology',
    titleKey: 'Ideas/Concepts/Examples',
    horizonKey: 'Status/Maturity',
    quadrantKey: 'Disaster Cycle',
    useCaseKey: 'Use Case',
    disasterTypeKey: 'Disaster Type'
  };

  const orders: OrdersParamType = {
    quadrants: ['Response', 'Recovery', 'Mitigation', 'Preparedness'],
    horizons: ['Production', 'Prototype', 'Validation', 'Idea']
  };

  const colors: ColorsParamType = {
    quadrants: {
      // colors from https://www.colorhexa.com/color-names
      colors: [
        { r: 235, g: 76, b: 66, opacity: 1 }, // Carmine Pink
        { r: 228, g: 208, b: 10, opacity: 1 }, // Citrine
        { r: 155, g: 221, b: 255, opacity: 1 }, // Columbia blue
        { r: 0, g: 204, b: 153, opacity: 1 } // Carabean green
      ],
      initialOpacity: 0.9, // [OPTIONAL default=0.7] opacity from the inner horizon
      clumpingOpacity: 1.3 // [OPTIONAL default=1.0] compresses the opacity so it becomes much smoother
    }
  };

  return (
    <RadarProvider>
      <DataProvider>
        <SetData
          keys={keys}
          orders={orders}
          colors={colors}
          quadrantsDescription={quadrantsDescription}
          horizonsDescription={horizonsDescription}
          QuadrantNameComponent={QuadrantNameComp}
          HorizonsNameComponent={HorizonsNameComp}
        />
        <RadarDataGenerator />
        <AddCSV csvFile={csvString} mapping={mapping} isCsvString={true} />
        {children}
      </DataProvider>
    </RadarProvider>
  );
};
