import { BaseCSVType, BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

/* Merge DisasterCycle of Techs with similar Ideas/Concepts/Examples */
export const mergeDisasterCycle = (blips: BlipType[]): BaseCSVType[] => {
  const blipsToUse = blips || [];
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
  const query = keyword.toLowerCase();

  const _newFilter: BaseCSVType[] = blips.filter((value) => {
    return (
      value['name'].toLowerCase().includes(query) ||
      value.description.toLowerCase().includes(query) ||
      value['disaster_cycle'].toString().toLowerCase().includes(query) ||
      value['un_host'].toString().toLowerCase().includes(query) ||
      value['country'].toString().toLowerCase().includes(query) ||
      value['sdg'].toString().toLowerCase().includes(query)
    );
  });

  return _newFilter;
};

export const getFilteredProjects = (
  filteredValues: {
    status: any;
    stages: any;
    technologies: any;
    parameters: any;
  },
  setter: Function,
  projectsList: any[]
): any => {
  // status filter
  const statusFilters: any = Object.keys(filteredValues['status']).reduce(
    (statusArr: any, status) => {
      if (filteredValues['status'][status])
        statusArr.push(status.toLowerCase());
      return statusArr;
    },
    []
  );

  // stages filter
  const stageFilters = Object.keys(filteredValues['stages']).reduce(
    (stagesArr: any, stage) => {
      if (filteredValues['stages'][stage]) stagesArr.push(stage.toLowerCase());
      return stagesArr;
    },
    []
  );

  // technologies filter
  const techFilters = Object.keys(filteredValues['technologies']).reduce(
    (techArr: any, tech) => {
      if (filteredValues['technologies'][tech]) techArr.push(tech);
      return techArr;
    },
    []
  );

  const parameterFilteredProjects =
    getParameterFilteredProjects(filteredValues.parameters, projectsList) || [];

  if (
    !statusFilters.length &&
    !stageFilters.length &&
    !techFilters.length &&
    !parameterFilteredProjects.length
  ) {
    return setter(projectsList);
  }

  // status filter
  const statusFilteredProjects = projectsList.filter((project: any) => {
    return statusFilters.some((item: any) =>
      (project['disaster_cycle'] || project['Disaster Cycle']).includes(item)
    );
  });

  // stages filter
  const stageFilteredProjects = projectsList.filter((project: any) => {
    return stageFilters.includes(
      (project['status'] || project['Status/Maturity']).trim()
    );
  });

  // tech filter
  const techFilteredProjects = projectsList.filter((project: any) => {
    return techFilters.some((item: any) =>
      (project['technology'] || project['Technology']).includes(item)
    );
  });

  const results = [
    ...stageFilteredProjects,
    ...statusFilteredProjects,
    ...techFilteredProjects,
    ...parameterFilteredProjects
  ];

  return [...new Set(results)];
};

const getParameterFilteredProjects = (
  parameterFilters: any,
  projectsList: any
): any => {
  // Region
  const regionFilters: any = parameterFilters['Region'].reduce(
    (regionArr: any, region: { label: string; value: string }) => {
      regionArr.push(region.label);
      return regionArr;
    },
    []
  );

  let regionFilteredProjects: any = [];
  regionFilteredProjects = projectsList.filter((project: any) => {
    return regionFilters.some((item: any) => project['region'].includes(item));
  });

  // Sub Region
  const subRegionFilters: any = parameterFilters['Sub Region'].reduce(
    (subRegionArr: any, subRegion: { label: string; value: string }) => {
      subRegionArr.push(subRegion.label);
      return subRegionArr;
    },
    []
  );

  const subRegionFilteredProjects = projectsList.filter((project: any) => {
    return subRegionFilters.some((item: any) =>
      project['sub_region'].includes(item)
    );
  });

  // Country
  const countryFilters: any = parameterFilters['Country'].reduce(
    (countryArr: any, country: { label: string; value: string }) => {
      countryArr.push(country.label);
      return countryArr;
    },
    []
  );

  const countryFilteredProjects = projectsList.filter((project: any) => {
    return countryFilters.some((item: any) =>
      (project['country'] || project['Country of Implementation']).includes(
        item
      )
    );
  });

  // Data
  const dataFilters: any = parameterFilters['Data'].reduce(
    (dataArr: any, data: { label: string; value: string }) => {
      dataArr.push(data.label);
      return dataArr;
    },
    []
  );

  const dataFilteredProjects = projectsList.filter((project: any) => {
    return dataFilters.some((item: any) =>
      (project['data'] || project['Data']).includes(item)
    );
  });

  // SDG
  const sdgFilters: any = parameterFilters['SDG'].reduce(
    (sdgArr: any, sdg: { label: string; value: string }) => {
      sdgArr.push(sdg.label);
      return sdgArr;
    },
    []
  );

  const sdgFilteredProjects = projectsList.filter((project: any) => {
    return sdgFilters.some((item: any) =>
      (project['sdg'] || project['SDG']).includes(item)
    );
  });

  // UN Host
  const unHostFilters: any = parameterFilters['UN Host'].reduce(
    (unHostArr: any, unHost: { label: string; value: string }) => {
      unHostArr.push(unHost.label);
      return unHostArr;
    },
    []
  );

  const unHostFilteredProjects = projectsList.filter((project: any) => {
    return unHostFilters.some((item: any) =>
      (project['un_host'] || project['Un Host Organisation']).includes(item)
    );
  });

  // Disaster Type
  const disasterFilters: any = parameterFilters['Disaster Type'].reduce(
    (disasterArr: any, disaster: { label: string; value: string }) => {
      disasterArr.push(disaster.label);
      return disasterArr;
    },
    []
  );

  const disasterFilteredProjects = projectsList.filter((project: any) => {
    return disasterFilters.some((item: any) =>
      (project?.disaster_types?.name || project['Disasater Type']).includes(
        item
      )
    );
  });

  if (
    !disasterFilters.length &&
    !unHostFilters.length &&
    !sdgFilters.length &&
    !dataFilters.length &&
    !countryFilters.length &&
    !subRegionFilters.length &&
    !regionFilters.length
  ) {
    return false;
  }

  return [
    ...regionFilteredProjects,
    ...subRegionFilteredProjects,
    ...countryFilteredProjects,
    ...dataFilteredProjects,
    ...sdgFilteredProjects,
    ...unHostFilteredProjects,
    ...disasterFilteredProjects
  ];
};

// const getParamFilteredProjects = (
//   parameterFilters: any,
//   key: any,
//   projectsList: any[]
// ): any => {
//   const filters: any = parameterFilters.reduce(
//     (filterArr: any, option: { label: string; value: string }) => {
//       filterArr.push(option.label);
//       return filterArr;
//     },
//     []
//   );

//   const slug = key.toLowerCase().split('').join('_');
//   const filteredProjects = projectsList.filter((project: any) => {
//     return filters.some((item: any) => project[slug].includes(item));
//   });

//   // return filteredProjects;
// };
