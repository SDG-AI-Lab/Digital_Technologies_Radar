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
      'Completed degree on Audiovisual Communication Technology in 2008 and have been a software developer for +7 years',
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
      'UX designer from Nigeria. Have a Bachelor of Nursing Science degree',
    quote:
      'I have been designing since 2021 and I had a great time working on this project. It is my dream to build useful products. I hope lives are improved using this radar.',
    imageSrc:
      'https://github.com/SDG-AI-Lab/Course-Images/blob/main/20220507_103527.jpg?raw=true',
    linkedinLink: 'https://www.linkedin.com/in/versatileblessing',
    githubLink: 'Behance.net/uxfoodie'
  } as const;

  static readonly EyoabT: VolunteerContentChild = {
    name: 'Eyoab Tesfaye',
    background:
      "Completed bachelor's degree in Software Engineering in 2021 and have been a Full-Stack engineer for 1 year.",
    quote:
      '"I am grateful for the opportunity to collaborate with the individuals on my team to contribute to the area of disaster context on behalf of the UNDP."',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165528220-4456c4da-7d4c-4589-be19-f8cdcc04862f.jpg',
    linkedinLink: 'https://www.linkedin.com/in/eyoabtaregay/',
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
    name: 'Francisco Peñarrubia',
    background:
      'Telecommunications Engineer, involved in Open Source GIS software development for more than 20 years',
    quote:
      "As an engineer, I like to build new things, and learn. Working on TechRadar project allowed me to learn by doing, meet very talented people and help a nice community in UN's Family",
    imageSrc:
      'https://github.com/SDG-AI-Lab/Course-Images/blob/main/Black%20and%20White%20Minimalist%20Company%20Profile%20-%20Business%20Presentation%20(1).jpg?raw=true',
    linkedinLink: 'https://www.linkedin.com/in/fpenarru/',
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
    background:
      "Completed Master's degree in Computer Science in 2022 and is currently working as a Research Assistant on Big Data Platforms for the Fraunhofer Society",
    quote:
      '"It has been a great experience to network with new faces and a pleasure to see my contributions in productive use to achieve sustainable development goals."',
    imageSrc: '',
    linkedinLink: 'https://www.linkedin.com/in/sven-simikin-559031223/',
    githubLink: 'https://github.com/UnlikeMars'
  } as const;

  static readonly VladyslavaD: VolunteerContentChild = {
    name: 'Vladyslava Diachenko',
    background:
      'Completed BSc in Computer Science at the University of Toronto in 2020, and have been working as a Software Developer for 2 years',
    quote:
      '"I am grateful for the opportunity to be a part of this amazing and meaningful project and to work with the incredible people from all around the world "',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165644578-80fd40aa-cbe9-4644-8191-ed26534b9846.png',
    linkedinLink: 'https://www.linkedin.com/in/vladyslava-diachenko/',
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

  static readonly JacksonO: VolunteerContentChild = {
    name: 'Jackson Onyango',
    background:
      'Software Engineer with 6 years experience in full-stack web development (PREN, MERN, RoR, Python/Django/Flask, PHP/WordPress). Interested in  Machine Learning and AI',
    quote:
      'I am excited about combining technology with engineering to push boundaries. I have enjoyed working on the frontend of the TechRadar project it gave me a chance to put to use my UI knowledge and I also got to a learn new UI component library',
    imageSrc:
      'https://github.com/SDG-AI-Lab/Course-Images/blob/main/Jackson.jpeg?raw=true',
    linkedinLink: 'www.linkedin.com/in/jackson-o-08b9b9240',
    githubLink: 'https://github.com/jacksono'
  } as const;

  static readonly HakanA: VolunteerContentChild = {
    name: 'Hakan Aksuman',
    background:
      'Currently full stack developer previously civil engineer, participated in data driven web development projects for more than 1 year',
    quote:
      'As a data and web development enthusiast, this project broadened my horizon in terms of implementing up to date technologies with a great team effort.',
    imageSrc:
      'https://github.com/SDG-AI-Lab/Course-Images/blob/main/photoUnvHakanAksuman.jpg?raw=true',
    linkedinLink: 'www.linkedin.com/in/hakanaksuman',
    githubLink: 'https://github.com/haksuman'
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
      'Completed degree in Chemistry, PGD in Development Economics, and masters in view. Have been in the field of data science and M&E management for +12 years',
    quote:
      '"It has been a  valuable journey, working and learning from each other and same time contributing to impacting the vulnerable lives. I hope my contribution contributes to the execution of the right programmatic decisions."',
    imageSrc:
      'https://user-images.githubusercontent.com/28465079/165645425-5d67ccb7-f96e-4d89-8141-b5a14e5c8079.jpg',
    linkedinLink:
      'https://www.linkedin.com/in/mansur-muhammad-dambuwa-65a913113/',
    githubLink: ''
  } as const;

  static readonly VioletteH: VolunteerContentChild = {
    name: 'Violette Heron',
    background: 'She has actively supported the deployment of the project.',
    quote: '',
    imageSrc: '',
    linkedinLink: 'https://www.linkedin.com/',
    githubLink: 'https://github.com/ViolettaHeron'
  } as const;

  static readonly NajiA: VolunteerContentChild = {
    name: 'Naji Alhusami',
    background: 'He has actively supported the deployment of the project.',
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
  VolunteerContent.JacksonO,
  VolunteerContent.HakanA,

  VolunteerContent.BeniamS,
  VolunteerContent.AhmedA,
  VolunteerContent.CezmiO,
  VolunteerContent.MansurM,

  VolunteerContent.VioletteH,
  VolunteerContent.NajiA
];
