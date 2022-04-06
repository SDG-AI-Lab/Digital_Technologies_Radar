import React from 'react';
import {
  AddCSV,
  DataProvider,
  RadarDataGenerator,
  RadarProvider,
  SetData,
  Utilities,
  ColorsParamType,
  KeysObject,
  MappingType,
  OrdersParamType,
  RawBlipType
} from '@undp_sdg_ai_lab/undp-radar';
import '@undp_sdg_ai_lab/undp-radar/dist/index.css';

import csvData from '../assets/csv/technology_radar_dataset_updated_v4.csv';

export const AppRadarProvider: React.FC = ({ children }) => {
  const mapping: MappingType<RawBlipType> = (item: { [key: string]: string }) =>
    ({
      Region: item['Region'],
      'Country of Implementation': item['Country of Implementation'],
      Data: item.Data,
      'Date of Implementation': item['Date of Implementation'],
      Description: item.Description,
      'Disaster Cycle': item['Disaster Cycle'],
      'Ideas/Concepts/Examples': item['Ideas/Concepts/Examples'],
      Source: item.Source,
      'Status/Maturity': item['Status/Maturity'],
      'Supporting Partners': item['Supporting Partners'],
      'Un Host Organisation': item['Un Host Organisation'],
      'Use Case': item['Use Case'],
      SDG: Utilities.cleanupStringArray(item.SDG.split(',')),
      Technology: Utilities.cleanupStringArray(item.Technology.split(',')),
      'Disaster Type': item['Disaster Type'],
      Theme: item['Theme']
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
      initialOpacity: 0.7, // [OPTIONAL default=0.7] opacity from the inner horizon
      clumpingOpacity: 1.1 // [OPTIONAL default=1.0] compresses the opacity so it becomes much smoother
    }
  };

  return (
    <RadarProvider>
      <DataProvider>
        <SetData
          radarConf={{ title: '' }}
          keys={keys}
          orders={orders}
          colors={colors}
        />
        <RadarDataGenerator />
        <AddCSV csvFile={csvData} mapping={mapping} />
        {children}
      </DataProvider>
    </RadarProvider>
  );
};
