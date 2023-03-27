import { BaseCSVType, BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

/* Merge DisasterCycle of Techs with similar Ideas/Concepts/Examples */
export const mergeDisasterCycle = (blips: BlipType[]): BaseCSVType[] => {
  const blipsToUse = blips;
  const merge: BaseCSVType[] = [];
  blipsToUse.forEach(function (item) {
    const existingBips = merge.filter(function (v, i) {
      return v['Ideas/Concepts/Examples'] === item['Ideas/Concepts/Examples'];
    });

    if (existingBips.length) {
      const existingIndex = merge.indexOf(existingBips[0]);

      const disasterCycles = merge[existingIndex]['Disaster Cycle'].split(',');

      if (
        disasterCycles.length < 4 &&
        !disasterCycles.includes(item['Disaster Cycle'])
      ) {
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

  return merge;
};

/* Search based on keyword */
export const projectSearch = (
  keyword: string,
  blips: BlipType[]
): BaseCSVType[] => {
  // const searchword = keyword.toLowerCase();
  // setTechSearch(searchword);
  const query = keyword.toLowerCase();

  const _newFilter: BaseCSVType[] = blips.filter((value) => {
    return (
      value['Ideas/Concepts/Examples'].toLowerCase().includes(query) ||
      value.Description.toLowerCase().includes(query) ||
      value['Use Case'].toLowerCase().includes(query) ||
      value['Disaster Cycle'].toString().toLowerCase().includes(query) ||
      value['Un Host Organisation'].toString().toLowerCase().includes(query) ||
      value['Country of Implementation']
        .toString()
        .toLowerCase()
        .includes(query) ||
      value['SDG'].toString().toLowerCase().includes(query)
    );
  });
  return _newFilter;
};
