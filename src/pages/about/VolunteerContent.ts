export interface VolunteerContentChild {
  name: string;
  background: string;
  quote: string;
  imageSrc: string;
  linkedinLink: string;
  githubLink: string;
}

class VolunteerContent {
  static readonly NunoR: VolunteerContentChild = {
    name: 'Nuno Ribeiro',
    background:
      'He has developed the baseline for both the project and website. Provided consultancy on how to build such project with React.',
    quote:
      '"It has been an amazing journey, setting up and working on this project. I hope this project will be valuable for stakeholders aiming at visualizing their data/projects."',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165523780-f3414b24-7895-4178-a212-72875c92baae.jpg',
    linkedinLink: 'https://www.linkedin.com/in/nmpribeiro/',
    githubLink: 'https://github.com/nmpribeiro'
  } as const;

  static readonly BlessingO: VolunteerContentChild = {
    name: 'Blessing Ojediran',
    background:
      'She has develop the mockups for the website. The website has modelled by using these mockups.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/uxfoodie'
  } as const;

  static readonly EyoabT: VolunteerContentChild = {
    name: 'Eyoab Tesfaye',
    background:
      'He has actively developed both backend and frontend components for the radar.',
    quote: ' ',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/Eyu-Tes'
  } as const;

  static readonly YashkumarS: VolunteerContentChild = {
    name: 'Yashkumar Shiroya',
    background:
      "CS Graduate, Class of '18, Purdue University. Ex-Developer at Amazon.com. MBA Grad, Class of '24, University Of British Columbia",
    quote:
      '"Writing code for the DRM Radar Project was a unique opportunity to work with super-talented designers, developers and technologists from around the world while creating something that can enrich, empower and save lives." ',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165501346-29d084a9-6ef4-476f-858b-91aa5fdc725f.jpg',
    linkedinLink: 'https://www.linkedin.com/in/shiroya/',
    githubLink: 'https://github.com/YashShiroya'
  } as const;

  static readonly KarshilD: VolunteerContentChild = {
    name: 'Karshil Desai',
    background:
      'Cornell MBA, Management Consultant, Automation and Control Systems Specialist',
    quote:
      '"To get involved with United Nations initiatives and contribute to UNDP Global Goals." ',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165501428-f409eb1e-6028-4135-b1d9-7dcebc7dac27.jpg',
    linkedinLink: 'https://www.linkedin.com/in/karshil/',
    githubLink: 'https://github.com/karshil'
  } as const;

  static readonly FranciscoJ: VolunteerContentChild = {
    name: 'Francisco José Peñarrubia',
    background: 'He has actively developed frontend components for the radar.',
    quote: ' ',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/fpenarru'
  } as const;

  static readonly NicolaS: VolunteerContentChild = {
    name: 'Nicola Shen',
    background: 'She has actively developed frontend components for the radar.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/xmz0601'
  } as const;

  static readonly SvenS: VolunteerContentChild = {
    name: 'Sven Simikin',
    background: 'He has actively developed frontend components for the radar.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/UnlikeMars'
  } as const;

  static readonly VladyslavaD: VolunteerContentChild = {
    name: 'Vladyslava Diachenko',
    background: 'She has actively developed frontend components for the radar.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: 'https://github.com/vladislawa'
  } as const;

  static readonly ZekariasT: VolunteerContentChild = {
    name: 'Zekarias Teshome',
    background:
      'M.Sc from NTNU; Working on Technology(ICT, ICT4D, Web, App) and Data; Interested in Technology, Data Science, ML, AI, and SDG',
    quote:
      '"An excellent project to visualize vast amount of data in a single screen; made by excellent collaborative team; it is a great addition to SDGs tracking effort."',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165503859-2abf042e-f9df-4794-833e-1934c6b0d074.jpg',
    linkedinLink: 'https://www.linkedin.com/in/zekariasteshome/',
    githubLink: 'https://github.com/lordakarias'
  } as const;

  static readonly BeniamS: VolunteerContentChild = {
    name: 'Beniam Shewaye',
    background:
      'Completed my BSc on Computer Science and Information Technology in 2016. Have been in ICT sector since 2017.',
    quote:
      '"I believe volunteering service provides knowledge, skill and satisfaction in faith and professional development. Also radar development projects like in SDG AI Lab will benefit us from the wisdom and contributions of people everywhere on earth."',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165512870-f5588a6f-99ee-4520-aef6-07b58fe769f0.jpg',
    linkedinLink: 'https://www.linkedin.com/in/beniam-shewaye-b65a7018a/',
    githubLink: ''
  } as const;

  static readonly AhmedA: VolunteerContentChild = {
    name: 'Ahmed Akbar',
    background:
      'He has actively collected projects that are ongoing or done in disaster context.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: ''
  } as const;

  static readonly CezmiO: VolunteerContentChild = {
    name: 'Cezmi Onat',
    background:
      'He has actively collected projects that are ongoing or done in disaster context.',
    quote: '',
    imageSrc: '',
    linkedinLink: '',
    githubLink: ''
  } as const;

  static readonly MansurM: VolunteerContentChild = {
    name: 'Mansur Mohammad Dambuwa',
    background:
      'He has actively collected projects that are ongoing or done in disaster context.',
    quote: '',
    imageSrc: '',
    linkedinLink: 'https://www.linkedin.com/',
    githubLink: ''
  } as const;

  static readonly VioletteH: VolunteerContentChild = {
    name: 'Violette Heron',
    background:
      'She has develop the mockups for the website. The website has modelled by using these mockups.',
    quote: '',
    imageSrc: '',
    linkedinLink: 'https://www.linkedin.com/',
    githubLink: 'https://github.com/ViolettaHeron'
  } as const;

  static readonly NajiA: VolunteerContentChild = {
    name: 'Naji Alhusami',
    background:
      'He has actively developed both backend and frontend components for the radar.',
    quote: '',
    imageSrc: '',
    linkedinLink: 'https://www.linkedin.com/[removed]',
    githubLink: 'https://github.com/naji-alhusami'
  } as const;
}

export const volunteerContentList: ReadonlyArray<VolunteerContentChild> = [
  VolunteerContent.NunoR,
  VolunteerContent.BlessingO,
  VolunteerContent.EyoabT,
  VolunteerContent.YashkumarS,
  VolunteerContent.KarshilD,
  VolunteerContent.FranciscoJ,
  VolunteerContent.NicolaS,
  VolunteerContent.SvenS,
  VolunteerContent.VladyslavaD,
  VolunteerContent.ZekariasT,

  VolunteerContent.BeniamS,
  VolunteerContent.AhmedA,
  VolunteerContent.CezmiO,
  VolunteerContent.MansurM,

  VolunteerContent.VioletteH,
  VolunteerContent.NajiA
];
