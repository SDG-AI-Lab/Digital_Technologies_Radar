import { getParameterFilteredProjects, projectSearch } from './HelperUtils';

describe('getParameterFilteredProjects', () => {
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

  const parameterFilters = {
    Country: [],
    Data: [],
    'Disaster Type': [],
    Region: [],
    SDG: [],
    'Sub Region': [],
    'UN Host': []
  };

  it('should return an empty list when there are no params set', () => {
    const results = getParameterFilteredProjects(
      parameterFilters,
      testProjects,
      0
    );

    expect(results).toHaveLength(0);
  });

  it('should filter by region', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Region: [{ label: 'Asia', value: 'asia' }]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) => expect(r.Region).toBe('Asia'));
  });

  it('should filter by subregion parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        'Sub Region': [
          {
            label: 'South-eastern Asia',
            value: 'south-eastern asia'
          }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) =>
      expect(r.Subregion).toContain('South-eastern Asia')
    );
  });

  it('should filter by country parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Country: [
          {
            label: 'Indonesia',
            value: 'indonesia'
          }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) =>
      expect(r['Country of Implementation'].includes('Indonesia')).toBeTruthy()
    );
  });

  it('should filter by disaster type parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        'Disaster Type': [
          {
            label: 'Earthquakes',
            value: 'earthquakes'
          }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) =>
      expect(r['Disaster Type']).toContain('Earthquakes')
    );
  });

  it('should filter by UN host parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        'UN Host': [
          {
            label: 'UN Pulse Lab Jakarta',
            value: 'un pulse lab jakarta'
          }
        ]
      },
      testProjects,
      1
    );
    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) =>
      expect(r['Un Host Organisation']).toContain('UN Pulse Lab Jakarta')
    );
  });

  it('should filter by SDG parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        SDG: [
          {
            label: 'SDG 9',
            value: 'sdg 9'
          }
        ]
      },
      testProjects,
      1
    );
    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) => expect(r['SDG']).toContain('SDG 9'));
  });

  it('should filter by data parameter', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Data: [
          {
            label: 'Mobile Network Data',
            value: 'mobile network data'
          }
        ]
      },
      testProjects,
      1
    );
    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) => expect(r['Data']).toContain('Mobile Network Data'));
  });

  it('should use boolean or for multiple parameters', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Region: [
          { label: 'Asia', value: 'asia' },
          { label: 'Oceania', value: 'oceania' }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) => expect(['Asia', 'Oceania']).toContain(r.Region));
  });

  it('should match parameter substrings', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Country: [
          {
            label: 'Nauru',
            value: 'nauru'
          }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBeGreaterThan(0);
    results.map((r: any) =>
      expect(r['Country of Implementation']).toContain('Nauru')
    );
  });

  it('should combine parameter filters using boolean and', () => {
    const results = getParameterFilteredProjects(
      {
        ...parameterFilters,
        Region: [{ label: 'Oceania', value: 'oceania' }],
        SDG: [
          {
            label: 'SDG 13',
            value: 'sdg 13'
          }
        ]
      },
      testProjects,
      1
    );

    expect(results.length).toBe(1);
  });
});

describe('projectSearch', () => {
  const testData = [
    {
      id: '1',
      title: 'MobileAid',
      description:
        "Using geo-targeting and machine learning to deliver relief to society's most vulnerable groups",
      source: 'https://www.givedirectly.org/',
      img_url:
        'https://www.givedirectly.org/wp-content/uploads/2021/07/Transfer-Withdrawal-scaled-1-705x469.jpeg',
      date_of_implementation: '2022',
      disaster_type: 'Various',
      status: 'production',
      use_case: 'Disaster Relief logistic/resource allocation',
      theme: ['Disaster Mitigation'].toString(),
      technology: [
        'Machine Learning',
        'Geographical Information Systems'
      ].toString(),
      region: ['Africa'].toString(),
      subregion: ['Eastern Africa'].toString(),
      country: ['Malawi'].toString(),
      partner: [
        'UNDP',
        'UNDP Bangladesh /a2i',
        'World Bank',
        'Center for Effective Global Action (CEGA)',
        'USAID',
        'Google.org',
        'Government of Togo',
        'Fonds Social de la Republique Democratique du Congo (Social Fund of the Democratic Republic of Congo)'
      ].toString(),
      un_host: ['UNDP'].toString(),
      data: ['Mobile Network Data'].toString(),
      sdg: ['SDG 1'].toString(),
      created_at: '2023-07-11T11:56:45.05823+00:00',
      updated_at: '2023-07-11T11:56:45.05823+00:00',
      uuid: '657e845c-98cc-44bf-a4ac-3ff9fa97b534',
      approved: 'true'
    },
    {
      id: '2',
      title: '#JustSaveIt',
      description:
        'The project aimed to encourage bank account usage more specifically regular deposits made into agent-based bank accounts through a series of WhatsApp messages sent to bank agents. The messages (i.e. graphics, comics, written text) were sent to shop owners (who were also bank agents), urging them to encourage their customers to save the change from purchases made at their shops in their bank accounts. The messages shared as part of the #TabunginAja (#JustSaveIt) campaign, were informed by BeSci and included setting specific goals and applying rules of thumb to prompt the target behaviour (e.g. to encourage agents to ask their customers to save their shopping change if the amount is less than USD0.35).',
      source:
        'https://www.bi.team/publications/justsaveit-encouraging-usage-of-agent-based-bank-accounts-to-improve-financial-inclusion/',
      img_url:
        'https://www.bi.team/wp-content/uploads/2020/03/justsaveit-157x216.png',
      date_of_implementation: '2021',
      disaster_type: 'Various',
      status: 'production',
      use_case: 'Situational awareness/actionable information gathering',
      theme: ['Finance'].toString(),
      technology: ['Mobile App'].toString(),
      region: ['Asia'].toString(),
      subregion: ['South-eastern Asia'].toString(),
      country: ['Indonesia'].toString(),
      partner: [
        'The Secretariat of the Indonesian National Council for Financial Inclusion (S-DNKI)'
      ].toString(),
      un_host: ['UN Pulse Lab Jakarta'].toString(),
      data: ['Mobile Network Data', 'Text Data'].toString(),
      sdg: ['SDG 1', 'SDG 8', 'SDG 9'].toString(),
      created_at: '2023-07-11T11:56:45.05823+00:00',
      updated_at: '2023-07-11T11:56:45.05823+00:00',
      uuid: '870205be-4b31-497b-913e-e061b1264ecf',
      approved: 'true'
    },
    {
      id: '3',
      title: 'D.U.Q. Method',
      description:
        'Analysis system to to measure the impact of decisions on forest fires',
      source: 'https://github.com/Maximiliano-Sotar/NASA-SPACE-APPS',
      img_url:
        'https://upload.wikimedia.org/wikipedia/commons/a/a0/Space_Apps_Logo_White.png',
      date_of_implementation: '2021',
      disaster_type: 'Wildfires',
      status: 'prototype',
      use_case: 'Disaster Relief logistic/resource allocation ',
      theme: ['Disaster Risk Management'].toString(),
      technology: [
        'Geographical Information Systems',
        'Data Collection',
        'Data Analysis'
      ].toString(),
      region: ['Americas'].toString(),
      subregion: ['South America'].toString(),
      country: ['Argentina'].toString(),
      partner: ['NASA'].toString(),
      un_host: ['None'].toString(),
      data: ['Spatial Data'].toString(),
      sdg: ['SDG 15'].toString(),
      created_at: '2023-07-11T11:56:45.05823+00:00',
      updated_at: '2023-07-11T11:56:45.05823+00:00',
      uuid: 'f15c2eac-d75d-4951-b3e0-f63340d53047',
      approved: 'true'
    }
  ];

  it('should filter on title substring matches', () => {
    const results = projectSearch('justsave', testData);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('#JustSaveIt');
  });

  it('should filter on description substring matches', () => {
    const results = projectSearch('Bank Account', testData);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('#JustSaveIt');
  });

  it('should filter on UN host substring matches', () => {
    const results = projectSearch('justsave', testData);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('#JustSaveIt');
  });

  it('should filter on country substring matches', () => {
    const results = projectSearch('jakar', testData);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('#JustSaveIt');
  });

  it('should filter on sdg substring matches', () => {
    expect(projectSearch('sdg 1', testData).length).toBe(3);
    expect(projectSearch('sdg 15', testData).length).toBe(1);
  });
});
