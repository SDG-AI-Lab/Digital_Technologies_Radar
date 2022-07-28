import React from 'react';
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

import csvData from '../assets/csv/technology_radar_dataset_updated_v6.csv';
import { HorizonsNameComp } from './components/svg-hover/HorizonsNameComp';
import { QuadrantNameComp } from './components/svg-hover/QuadrantNameComp';

export const AppRadarProvider: React.FC = ({ children }) => {
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

  const mapping: MappingType<RawBlipType> = (item: { [key: string]: string }) =>
    ({
      Region: Utilities.cleanupStringArray(item.Region.split(',')),
      Subregion: Utilities.cleanupStringArray(item.Subregion.split(',')),
      'Country of Implementation': Utilities.cleanupStringArray(
        item['Country of Implementation'].split(',')
      ),
      Data: Utilities.cleanupStringArray(item.Data.split(',')),
      'Date of Implementation': item['Date of Implementation'],
      Description: item.Description,
      'Disaster Cycle': item['Disaster Cycle'],
      'Ideas/Concepts/Examples': item['Ideas/Concepts/Examples'],
      Source: item.Source,
      'Status/Maturity': item['Status/Maturity'],
      'Supporting Partners': item['Supporting Partners'],
      'Un Host Organisation': Utilities.cleanupStringArray(
        item['Un Host Organisation'].split(',')
      ),
      'Use Case': item['Use Case'],
      SDG: Utilities.cleanupStringArray(item.SDG.split(',')),
      Technology: Utilities.cleanupStringArray(item.Technology.split(',')),
      'Disaster Type': item['Disaster Type'],
      Theme: item['Theme'],
      'Image Url': item['imgurl']
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
      // colors: null,
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
        <AddCSV csvFile={csvData} mapping={mapping} />
        {children}
      </DataProvider>
    </RadarProvider>
  );
};
