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
  projectsList: any[],
  parameterCount?: any
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

  let filteredProjects = projectsList;
  const parameters = totalParameterCount(parameterCount);
  const parameterFilteredProjects =
    getParameterFilteredProjects(
      filteredValues.parameters,
      projectsList,
      parameters
    ) || [];

  if (parameters) {
    filteredProjects = parameterFilteredProjects;
  }

  if (
    !statusFilters.length &&
    !stageFilters.length &&
    !techFilters.length &&
    !parameterFilteredProjects.length
  ) {
    return setter(projectsList);
  }

  // status filter
  if (statusFilters.length) {
    const statusFilteredProjects = filteredProjects.filter((project: any) => {
      return statusFilters.some((item: any) =>
        (project['disaster_cycle'] || project['Disaster Cycle']).includes(item)
      );
    });

    filteredProjects = statusFilteredProjects;
  }

  // stages filter
  if (stageFilters.length) {
    const stageFilteredProjects = filteredProjects.filter((project: any) => {
      return stageFilters.includes(
        (project['status'] || project['Status/Maturity']).trim()
      );
    });

    filteredProjects = stageFilteredProjects;
  }

  // tech filter
  if (techFilters.length) {
    const techFilteredProjects = filteredProjects.filter((project: any) => {
      return techFilters.some((item: any) =>
        (project['technology'] || project['Technology']).includes(item)
      );
    });

    filteredProjects = techFilteredProjects;
  }

  return [...new Set(filteredProjects)];
};

const getParameterFilteredProjects = (
  parameterFilters: any,
  projectsList: any,
  parameters: number
): any => {
  if (!parameters) return [];
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
    return regionFilters.some((item: any) =>
      (project['region'] || project['Region']).includes(item)
    );
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
      (project['sub_region'] || project['Subregion']).includes(item)
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
      (project?.disaster_type || project['Disaster Type']).includes(item)
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

export const sliceForBadge = (projectArray: string[]): string[] => {
  if (projectArray.length > 2) {
    const sliced = projectArray.slice(0, 2);
    sliced.push('...');
    return sliced;
  }
  return projectArray;
};

export const totalParameterCount = (parameters: any): any => {
  if (parameters) {
    return Object.values(parameters).reduce(
      (a: any, b: any) => (a as number) + (b as number),
      0
    );
  }
};

export const PARAMETERS = [
  'Region',
  'SubRegion',
  'Country',
  'Disaster Type',
  'UN Host',
  'SDG',
  'Data'
];

export const initialParameterCount = PARAMETERS.reduce((a, b) => {
  // @ts-expect-error
  a[b] = 0;
  return a;
}, {});
