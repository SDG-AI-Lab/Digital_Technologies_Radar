import { getFilteredProjects, initialParameterCount } from './HelperUtils';

describe('getFilteredProjects', () => {
  const testProjects = [
    {
      'Unnamed: 0': 0,
      'Ideas/Concepts/Examples': 'The UN Biodiversity Lab',
      Description:
        'UNDP, UN Environment, and the CBD Secretariat launched the UN Biodiversity Lab -  an interactive mapping platform designed to solve biodiversity conservation and development challenges-  as a free, open-source platform to provide policy makers with access to world-class data for national action. The spatial data platform that will help countries support conservation efforts and accelerate delivery of the 2030 Agenda.',
      Theme: 'Biodiversity',
      'Use Case': 'Situational awareness/actionable information gathering',
      'Status/Maturity': 'production',
      'Disaster Cycle': 'preparedness',
      Technology: 'Geographical Information Systems',
      'Disaster Type': 'Various',
      Region: 'Global',
      Subregion: 'Global',
      'Country of Implementation': 'Global',
      'Supporting Partners': 'UNDP, UNDP Nature Climate and Energy Team',
      'Un Host Organisation': 'UNDP, UNEP',
      Data: 'Spatial Data',
      SDG: 'SDG 15',
      'Date of Implementation': 2016,
      Source: 'https://www.unbiodiversitylab.org/',
      imgurl:
        'https://unbiodiversitylab.org/wp-content/uploads/2020/07/UNBL_FULL_WEBSITE.png'
    },
    {
      'Unnamed: 0': 1,
      'Ideas/Concepts/Examples':
        'Disaster Resilience for Pacific SIDS (RESPAC)',
      Description:
        'Focuses on areas where Russian assistance can have maximum impact in close partnership with regional organizations and development partners, to provide support, technical assistance and results. Given identified gaps, the work of others, the skills and experience of UNDP, the project: - Strengthens EWs and climate monitoring capacity; - Strengthens preparedness/planning mechanisms to manage disaster recovery; - Increased use of financial instruments to manage and share disaster-related risks and fund post-disaster recovery efforts. It strengthens preparedness through improved disaster EW and climate information, response services and communication to reduce losses/impacts on the most vulnerable and addresses Resilient recovery.',
      Theme: 'Disaster Risk Management',
      'Use Case': 'Disaster assessment/prediction and early warning systems',
      'Status/Maturity': 'production',
      'Disaster Cycle': 'recovery',
      Technology: 'Geographical Information Systems',
      'Disaster Type': 'Climate Change',
      Region: 'Oceania',
      Subregion: 'Melanesia, Micronesia, Polynesia',
      'Country of Implementation':
        'Fiji, Kiribati, Marshall Islands, Micronesi, Nauru, Palau, Papua New Guinea, Samoa, Solomon Islands, Tonga, Tuvalu, Vanuatu',
      'Supporting Partners':
        'UNDP, The Russian Federation, UNDP Pacific Office in Fiji, Pacific Island Governments',
      'Un Host Organisation': 'UNDP, UNDP Pacific',
      Data: 'Spatial Data',
      SDG: 'SDG 13',
      'Date of Implementation': 2019,
      Source: 'https://sustainabledevelopment.un.org/partnership/?p=14656',
      imgurl:
        'https://pbs.twimg.com/profile_images/933452262940147712/xKUhY-Bj_400x400.jpg'
    },
    {
      'Unnamed: 0': 2,
      'Ideas/Concepts/Examples':
        'Understanding Population Movement After the 2018 Central Sulawesi Natural Disasters',
      Description:
        'After the massive earthquake struck Central Sulawesi, Indonesia in September 2018, through a shared value partnership with mobile telecom Digicel, Pulse Lab Jakarta (PLJ) over the past few years has investigated how pseudonymised mobile network data from subscribers in the Pacific region can be used to support evidence-based decision making. From modelling population displacement to understanding changes in citizens behaviour after natural disasters, the research has yielded actionable insights for policymakers and a wealth of experiential knowledge.',
      Theme: 'Disaster Risk Management',
      'Use Case': 'Disaster Relief logistic/resource allocation',
      'Status/Maturity': 'prototype',
      'Disaster Cycle': 'preparedness',
      Technology:
        'Data Collection, Data Analysis, Cyber Physical Systems, Geographical Information Systems',
      'Disaster Type': 'Earthquakes',
      Region: 'Asia',
      Subregion: 'South-eastern Asia',
      'Country of Implementation': 'Indonesia',
      'Supporting Partners':
        'Digicel, International Organisation for Migration (IOM)',
      'Un Host Organisation': 'UN Pulse Lab Jakarta',
      Data: 'Mobile Network Data, Spatial Data',
      SDG: 'SDG 9',
      'Date of Implementation': 2019,
      Source:
        'https://www.unglobalpulse.org/2019/12/understanding-population-movement-after-the-2018-central-sulawesi-natural-disasters/',
      imgurl:
        'https://www.unglobalpulse.org/wp-content/uploads/2019/12/PLJ-Palu-visualization.webp'
    }
  ];
  type ParameterFilter = {
    label: string;
    value: string;
  };

  const filteredValues = {
    status: {
      production: true,
      prototype: false
    },
    stages: {
      preparedness: true,
      recovery: false
    },
    technologies: {
      'Geographical Information Systems': true,
      'Data Analysis': false
    },

    parameters: {
      Region: [] as ParameterFilter[],
      'Sub Region': [] as ParameterFilter[],
      Country: [] as ParameterFilter[],
      'Disaster Type': [] as ParameterFilter[],
      'UN Host': [] as ParameterFilter[],
      SDG: [] as ParameterFilter[],
      Data: [] as ParameterFilter[]
    }
  };

  it('should filter projects by status', () => {
    filteredValues.status.production = false;
    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    results.map((r: { [x: string]: any }) =>
      expect(r['Status/Maturity']).toBe('prototype')
    );
  });

  it('should filter projects by stages', () => {
    filteredValues.stages.recovery = true;
    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    results.map((r: { [x: string]: any }) =>
      expect(r['Disaster Cycle']).toBe('recovery')
    );
  });

  it('should filter projects by technologies', () => {
    filteredValues.technologies['Data Analysis'] = true;
    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    results.map((r: { Technology: any }) =>
      expect(r.Technology).toContain('Data Analysis')
    );
  });

  it('should return projects when parameters are set', () => {
    filteredValues.parameters.Region.push({ label: 'Asia', value: 'asia' });
    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    expect(results.length).toEqual(0);
  });
  it('should combine filters using boolean AND logic', () => {
    filteredValues.parameters.Region.push({ label: 'Asia', value: 'asia' });
    filteredValues.parameters.SDG.push({ label: 'SDG 9', value: 'sdg 9' });
    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    results.map((r: { Region: any; SDG: any }) => {
      expect(r.Region).toBe('Asia');
      expect(r.SDG).toContain('SDG 9');
    });
  });
});
