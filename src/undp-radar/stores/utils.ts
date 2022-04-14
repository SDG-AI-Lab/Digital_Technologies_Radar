import { Utilities } from '../helpers/Utilities';
import { CSVManager } from '../services/CSVManager';
import { BaseCSVType, MappingType, RawBlipType } from '../types';

type FetchRadarDataProcess = (
  content: string,
  mapping: MappingType<RawBlipType>
) => Promise<RawBlipType[]>;
const fetchRadarBlips: FetchRadarDataProcess = async (content, mapping) => {
  // async (dispatch): Promise<void> => {
  const radarCSV = await Utilities.getCSVFileFromUrl(content);
  const rawBlips = new CSVManager(radarCSV).processCSV<BaseCSVType>();
  return Utilities.cleanRawBlips(rawBlips, mapping);
  // dispatch(setRawBlips(Utilities.cleanRawBlips(rawBlips, mapping)));
};

export const StoreUtils = {
  fetchRadarBlips
};
