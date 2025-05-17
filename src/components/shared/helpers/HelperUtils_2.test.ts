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

  // Define the initial filter state that will be cloned for each test
  const initialFilterState = {
    status: {
      // Disaster Cycle values
      preparedness: false,
      recovery: false,
      mitigation: false,
      response: false
    },
    stages: {
      // Status/Maturity values
      production: false,
      prototype: false,
      validation: false,
      idea: false
    },
    technologies: {
      'Geographical Information Systems': false,
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

  // Create a new clean filter state for each test
  let filteredValues: typeof initialFilterState;

  beforeEach(() => {
    // Clone the initial state for each test
    filteredValues = JSON.parse(JSON.stringify(initialFilterState));
  });

  it('should filter projects by status', () => {
    // In the actual code, the status filter is applied to 'Disaster Cycle'
    filteredValues.status.preparedness = true;

    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    // Check that all returned projects have 'preparedness' in their Disaster Cycle
    results.forEach((r: { [x: string]: any }) => {
      expect(r['Disaster Cycle'].toLowerCase()).toContain('preparedness');
    });
  });

  it('should filter projects by stages', () => {
    // In the actual code, stages filter applies to Status/Maturity
    filteredValues.stages.prototype = true;

    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    // Verify that all returned projects have 'prototype' in Status/Maturity
    results.forEach((r: { [x: string]: any }) => {
      expect(r['Status/Maturity'].toLowerCase()).toBe('prototype');
    });
  });

  it('should filter projects by technologies', () => {
    // Set Data Analysis filter to true
    filteredValues.technologies['Data Analysis'] = true;

    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      initialParameterCount
    );

    // Verify all projects have Data Analysis in their Technology field
    results.forEach((r: { Technology: string }) => {
      expect(r.Technology).toContain('Data Analysis');
    });
  });

  it('should return projects when parameters are set', () => {
    // Set Region filter (targeting a test project with Region="Asia")
    filteredValues.parameters.Region.push({ label: 'Asia', value: 'asia' });

    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      // Need to set parameterCount to make the filter recognize there are filters active
      { Region: 1 }
    );

    // Verify the results contain only projects from Asia
    expect(results.length).toBeGreaterThan(0);
    results.forEach((project: { Region: string }) => {
      expect(project.Region).toBe('Asia');
    });
  });

  it('should combine filters using boolean AND logic', () => {
    // Set Region and SDG filters for a specific test project (#3)
    filteredValues.parameters.Region.push({ label: 'Asia', value: 'asia' });
    filteredValues.parameters.SDG.push({ label: 'SDG 9', value: 'sdg 9' });

    const results = getFilteredProjects(
      filteredValues,
      () => {},
      testProjects,
      // Need to set parameterCount to make the filter recognize there are filters active
      { Region: 1, SDG: 1 }
    );

    // Verify all returned projects match both filters
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r: { Region: string; SDG: string }) => {
      expect(r.Region).toBe('Asia');
      expect(r.SDG).toContain('SDG 9');
    });
  });
});
