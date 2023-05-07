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

  if (!statusFilters.length && !stageFilters.length && !techFilters.length) {
    return setter(projectsList);
  }

  // status filter
  let statusFilteredProjects: any = [];

  statusFilteredProjects = projectsList.filter((project: any) => {
    return statusFilters.some((item: any) =>
      project['disaster_cycle'].includes(item)
    );
  });

  // stages filter
  let stageFilteredProjects: any = [];

  stageFilteredProjects = projectsList.filter((project: any) => {
    return stageFilters.includes(project['status'].trim());
  });

  let techFilteredProjects: any = [];
  techFilteredProjects = projectsList.filter((project: any) => {
    return techFilters.some((item: any) =>
      project['technology'].includes(item)
    );
  });

  return [
    ...stageFilteredProjects,
    ...statusFilteredProjects,
    ...techFilteredProjects
  ];
};
