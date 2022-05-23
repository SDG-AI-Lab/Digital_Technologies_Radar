export interface AboutContentChild {
  title: string;
  description: string;
  imageSrc: string;
}

class AboutContent {
  static readonly aboutDigitalTechnologiesRadarContent: AboutContentChild = {
    title: 'Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)',
    description:
      'SDG AI Lab in partnership with UNDP DRT and CBi has developed an online tool – a Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR), which allows for the systematic tracking and understanding of frontier technologies as they are developed. This would categorize technological solutions according to their technology type, disaster/crisis type and maturity level. Moreover, it is expected that the tool developed would encourage knowledge and experience-sharing among development stakeholders on the use of frontier technologies in disaster and conflict contexts. The Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR) aims to highlight the potential of technological solutions in disaster contexts to those working in the fields of risk reduction, response and recovery. It supports development stakeholders to navigate the variety of existing and emerging technologies and their possible use cases.',
    imageSrc: 'https://cdn-icons-png.flaticon.com/512/1299/1299558.png'
  } as const;

  static readonly aboutDigitalResilienceTeamContent: AboutContentChild = {
    title:
      'UNDP Disaster Risk Reduction and Recovery for Building Resilience Team (DRT)',
    description:
      'The Crisis Bureau guides UNDP’s corporate crisis-related strategies and vision for crisis prevention, response and recovery. The Bureau has the responsibility for support to prevention, crisis response, resilience and recovery work under the auspices of UNDP’s Strategic Plan. The Disaster Risk Reduction and Recovery for Building Resilience Team (DRT) is situated within the Crisis Bureau of UNDP providing integrated policy and program support on disaster risk reduction and recovery in the context of UNDP’s broader approach to crisis prevention and increased resilience. The Team specifically fosters the mainstreaming of risk reduction as a key element in sustainable development and recovery at national, sub-national and sectoral level with a focus on integrated approaches with climate change adaptation.',
    imageSrc:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/UNDP_logo.svg/1011px-UNDP_logo.svg.png'
  } as const;

  static readonly aboutSDGAiLabContent: AboutContentChild = {
    title: 'SDG AI Lab',
    description:
      'The SDG AI Lab is a joint initiative of UNDP BPPS teams, and it is hosted under UNDP IICPSD. The Lab has a mission to harness the potential of frontier technologies such as Artificial Intelligence (AI), Machine Learning (ML), Geographic Information Systems (GIS) for sustainable development. SDG AI Lab provides research, development, and advisory services in the areas of frontier technologies and sustainable development. As well, the Lab supports UNDP’s internal capacity strengthening efforts for the increasing demand for digital solutions. To bridge the talent gap in the use of frontier technologies in development contexts, the Lab mobilizes a community of volunteer data scientists, connecting UNDP teams and highly skilled data scientists to address development challenges with digital solutions.',
    imageSrc: 'https://avatars.githubusercontent.com/u/64203335?s=200&v=4'
  } as const;

  static readonly aboutConnectingBusinessInitiativeContent: AboutContentChild =
    {
      title: 'Connecting Business initiative',
      description:
        'Connecting Business initiative (CBi) engages the private sector strategically before, during and after emergencies, increasing the scale and effectiveness of the response and recovery in a coordinated manner. To do so the Connecting Business initiative strengthens and supports 17 private sector networks around the world. These networks reached a combined membership of 4,100 companies and they have access to more than 40,000 micro-, small- and medium-sized enterprises (MSMEs). CBi also actively disseminates innovative methods to private-sector networks and other partners to inform what is possible through recent breakthroughs also in technologies.',
      imageSrc: 'https://sdgailab.org/assets/img/logos/Picture5.png'
    } as const;
}

export const aboutContentList: ReadonlyArray<AboutContentChild> = [
  AboutContent.aboutDigitalTechnologiesRadarContent,
  AboutContent.aboutDigitalResilienceTeamContent,
  AboutContent.aboutSDGAiLabContent,
  AboutContent.aboutConnectingBusinessInitiativeContent
];
