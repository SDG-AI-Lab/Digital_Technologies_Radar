import React from "react";
import {
  AddCSV,
  DataProvider,
  RadarDataGenerator,
  RadarProvider,
  SetData,
  Utilities,
} from "@undp_sdg_ai_lab/undp-radar";
import {
  KeysObject,
  MappingType,
  RawBlipType,
} from "@undp_sdg_ai_lab/undp-radar/dist/types";

import csvData from "../assets/csv/technology_radar_dataset_updated.csv";

export const AppRadarProvider: React.FC = ({ children }) => {
  const mapping: MappingType<RawBlipType> = (item) =>
    ({
      "Country of Implementation": item["Country of Implementation"],
      Data: item.Data,
      "Date of Implementation": item["Date of Implementation"],
      Description: item.Description,
      "Disaster Cycle": item["Disaster Cycle"],
      "Ideas/Concepts/Examples": item["Ideas/Concepts/Examples"],
      Source: item.Source,
      "Status/Maturity": item["Status/Maturity"],
      "Supporting Partners": item["Supporting Partners"],
      "Un Host Organisation": item["Un Host Organisation"],
      "Use Case": item["Use Case"],
      SDG: Utilities.cleanupStringArray(item.SDG.split(",")),
      Technology: Utilities.cleanupStringArray(item.Technology.split(",")),
    } as unknown as RawBlipType);

  const keys = {
    techKey: "Technology",
    titleKey: "Ideas/Concepts/Examples",
    horizonKey: "Status/Maturity",
    quadrantKey: "Disaster Cycle",
    useCaseKey: "Use Case",
    disasterTypeKey: "",
  };

  const orders = {
    quadrant: ["Response", "Recovery", "Resilience", "Preparedness"],
    horizon: ["Production", "Validation", "Prototype", "Idea"],
  };

  return (
    <RadarProvider>
      <DataProvider>
        <SetData keys={keys} orders={orders} />
        <RadarDataGenerator />
        <AddCSV csvFile={csvData} mapping={mapping} />
        {children}
      </DataProvider>
    </RadarProvider>
  );
};
