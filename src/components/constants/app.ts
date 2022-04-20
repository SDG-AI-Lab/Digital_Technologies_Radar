// Lorem Ipsum from https://fatihtelis.github.io/react-lorem-ipsum/
import { loremIpsum } from 'react-lorem-ipsum';
import { Utilities } from '@undp_sdg_ai_lab/undp-radar';

export type TechDescriptionType = string[];

export class AppConst {
  private static getContent = () =>
    loremIpsum({
      p: 2,
      avgSentencesPerParagraph: 10,
      avgWordsPerSentence: 8
    });

  static readonly technologyDescriptions: Map<string, TechDescriptionType> =
    new Map([
      [
        Utilities.createSlug('Machine Learning'),
        [
          'Machine Learning (ML) as the computerized approach of Artificial Narrow Intelligence and will thus treat it as a sub-field of AI. Note that ML further encompasses the more traditional probabilistic modelling approaches as well as the rapidly developing field of Deep Learning that involves the use of Neural Networks.',
          'Within ML, we can further consider two different applications – supervised ML and unsupervised ML. The first uses labelled data (examples of what we want the machine to recognize) to map the input to outputs. The second uses unstructured data, for instance the text of a whole document or a set of images without descriptions to find underlying patterns with only minimal human supervision.',
          'An example use case of Machine Learning is predicting the likelihood that a disastrous event will occur.'
        ]
      ],
      [
        Utilities.createSlug('Artificial Intelligence'),
        [
          'An early definition for AI comes from Bellman in 1978 and defines AI as "The automation of activities that we associate with human thinking, activities such as decision making, problem-solving, learning." There are countless approaches to define AI, some more technical, some more elaborative, some more practical and some even philosophical. ',
          'The unprecedented rise of AI can mostly be attributed to two factors: i) the availability, size, and amount of a multitude of data sources describing our lives and the world around us and ii) the increase in computational power.',
          'What we are currently experiencing is a world that runs on Artificial Narrow Intelligence: Machines that are specialized in one area. This may be recommending new products to customers, playing a game of chess, recognize objects in images, Google-translating text for us or predict the likelihood of a disastrous event to occur.'
        ]
      ],
      [
        Utilities.createSlug('Geographical Information Systems'),
        [
          'The cornerstones of Geographical Information Systems(GIS) were laid down with the advent of modern computer systems in the 1980s that enabled the processing of larger amounts of spatial information. Together with the digitalization of spatial data during that period, GIS made similar leaps forward like other types of information technology.',
          'GIS provide the necessary software tools to store, distribute, analyse, and create spatial information of any kind. GIS is a true cross-cutting discipline involving computer science, geodesy, geomatics, geography, statistics and more recently ML.',
          'This multi-disciplinary nature becomes clearer looking at the typical lifecycle of a GIS project. Data and information gathering (Information Management) often depend largely on remote sensing systems such as satellites, plane, or drone imagery. Storage and processing can be approached either with traditional storage solutions or, more recently, with cloud computing solutions. Geospatial Analysis and Predictive Analytics draw heavily from data science methods and are more and more influenced by modern algorithms for data analysis like ML.',
          'An example use case of Geographical Information Systems is processing satellite images to assess losses and damages after a disastrous event. '
        ]
      ],
      [
        Utilities.createSlug('Data Collection'),
        [
          'Data collection is the process of gathering and measuring information on targeted variables in an established system, which then enables one to answer relevant questions and evaluate outcomes. Data collection is a research component in all study fields, including physical and social sciences, humanities, and business.',
          ''
        ]
      ],
      [
        Utilities.createSlug('Computer Vision'),
        [
          'Computer vision is an interdisciplinary scientific field that deals with how computers can gain high-level understanding from digital images or videos. he image data can take many forms, such as video sequences, views from multiple cameras, multi-dimensional data from a 3D scanner, or medical scanning device. The technological discipline of computer vision seeks to apply its theories and models to the construction of computer vision systems.',
          'The goal for all data collection is to capture quality evidence that allows analysis to lead to the formulation of convincing and credible answers to the questions that have been posed.',
          'Data can be collected with different approaches such as interviews, questionnaires, surveys. Furthermore, data can be collected with methods without relying on human feedback by using APIs, programmes and tools.'
        ]
      ],
      [
        Utilities.createSlug('Natural Language Processing'),
        [
          'Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data. The goal is a computer capable of "understanding" the contents of documents, including the contextual nuances of the language within them. The technology can then accurately extract information and insights contained in the documents as well as categorize and organize the documents themselves.',
          'An example use case of NLP is analyzing the existing articles, project document etc. to gather meaningful information in disaster management'
        ]
      ],
      [
        Utilities.createSlug('Remote Sensing'),
        [
          'Remote Sensing, throughout its different definitions, follows one central concept: Gathering data from a distance. More specifically, Remote Sensing is concerned with collecting information from distant objects without being in contact with them, usually by measuring propagated signals such as electromagnetic radiation allowing us to obtain a global perspective and monitor the current and future state of the world.',
          'Common examples are sonar sensors and satellite imagery that are used to map out the ocean’s ground, changes in temperature of the oceans, tracking of clouds or monitoring seismic activities. More contemporary use cases include observing the growth of a city and changes in farmland or forests over time.',
          'An example use case of Remote Sensing is measuring seismic or volcanic activity and if certain thresholds are reached activate early warning systems.'
        ]
      ],
      [
        Utilities.createSlug('Blockchain'),
        [
          'Blockchain promises a system that will make intermediates between transactions obsolete and shifts the power to an individual by replacing powerful institutions with collaboration and clever code. A blockchain is a form of distributed ledger technology (DLT) that is speculated to have the disruptive power to change the way our societies interact and trade.',
          'The mathematical complexity behind the systems is highly technical and it is best explained by outlining the core principles of why the technology was developed: Blockchain provides the technical tools that allow different parties and entities to interact and exchange certain values without involving and relying on a trusted third party such as a financial institution.',
          'Moreover, transactions that flow in the blockchain allow full process transparency and provide integrity-protected data storage systems.42 It is important to note that all kinds of different information from personal data to intellectual property can be stored on a blockchain.',
          'An example use case of Blockchain is  monitoring resource allocation and spending habits after a disastrous event without touching privacy issues. '
        ]
      ],
      [
        Utilities.createSlug('Social Media'),
        [
          'Social Media is a relatively recent phenomenon but has significantly changed the way we interact with and distribute information in society. Currently, it is estimated that 3.6 billion people are using at least one sort of social media platform. This colossal number alone underlines the importance of technology. Commonly, social media is associated with various digital platforms such as Facebook, Twitter, YouTube, WhatsApp, Telegram, or Instagram, but can be more generally defined as technologies that emphasize contents and interactions created by individual users.',
          'An example use case of Social Media is gathering information about damaged areas and disastrous sub-events through analysing social media posts. '
        ]
      ],
      [
        Utilities.createSlug('Internet of Things'),
        [
          'As it is the case for many other emerging technologies, the Internet of Things (IoT), sometimes also referred to as the Internet of Objects, lacks a clear definition that depicts what it encompasses. Commonly, it describes the networked interconnection of physical, often everyday objects through the wireless connection. These objects are equipped with sensors that absorb and collect information about the world around them, including them in our interactions and further increasing the already omnipresent nature of the Internet.81 Whereas some definitions emphasize the individual objects involved and other definitions focus on the Internet and connectivity aspect of IoT, the central concept remains unchanged: By turning physical information into digital data, IoT promises to make everyday devices, everyday processing and everyday communication smarter and more informative.',
          'IoT also comes with a high degree of interconnection with other technologies. Sensors are used for collecting and measuring information, cloud architectures for processing and storing data and AI applications for automatization, analytics and adding the “smart” aspect.',
          'The benefits that IoT promises, in the humanitarian context, are summed up by the International Telecommunication Union (ITU) as i) improving situational awareness, ii) better means to measure and monitor objects and processes and iii) expand communication to a multilateral connected “everything-to-everything” system. ',
          'An example use case of Internet of Things(IoT) is connecting the data collected from multiple sensors in real-time.'
        ]
      ],
      [
        Utilities.createSlug('Drones'),
        [
          'Drones - also commonly referred to as unmanned aerial vehicles (UAVs) - are remotely controlled or programmed vehicles that can operate and fly without a pilot. In the past, drones have started to gain attention mostly through their use in armed conflicts but have now entered our everyday lives as a readily available product for end-users and are even under consideration by Amazon to bring a paradigm-shift in the online-delivery market',
          'Drones come in various sizes, operating power, capacities, and prices. The use case and sizes range from the size of a hand and the ability to fly a few meters over the ground to take videos and pictures for personal purposes up to the 24m long Ravn X to launch satellites.',
          'An example use case of Drones is flying over a damaged area to take high-resolution pictures for assessment. '
        ]
      ],
      [
        Utilities.createSlug('Cyber Physical Systems'),
        [
          'Even though CPS was first introduced in 2006 the foundations were laid much earlier with the emerge of cybernetics and the study of human and computer interaction. CPS have a physical and a cyber component and the focus is put on the interaction of those two. An example is autonomous cars in which the physical and cyber components are in a constant feedback loop without human intervention but rather monitored and controlled by algorithms. This is the key to understand CPS – we have systems that are controlled by algorithms and not humans.',
          'It is further important to not only understand the distinct elements of the system but their interaction. Regarding the other technologies in the focus of this research, IoT and CPS are sometimes mistaken for each other and indeed share a similar vision. There is no common agreement yet on how and to what degree the two are different. For the sake of simplicity, we propose to see CPS as a mechanism that is monitored and controlled by algorithms and IoT as a network of connected devices.',
          'An example use case of Cyber Physical Systems is interconnected systems that are monitored and controlled by algorithms. Examples may be smart cities/houses that proactively respond (for instance by turning off potentially dangerous electric outlets) to certain parameters indicating a possible disaster.  '
        ]
      ],
      [
        Utilities.createSlug('Augmented Reality/Virtual Reality'),
        [
          'AR is based on a combination of hard- and software. A camera is used to ingest real-world data which is then combined with virtual information into one perception. VR is a simulation process in which computer graphics are employed to build a realistic, virtual world.',
          'AR and VR are not new technologies as early work began in the 1960s. However, only recently AR and VR technologies became more available. For example, AR and VR are used to simulate different levels of manufacturing processes before they are carried out to produce the final product.35 Moreover, AR is effectively used to simulate training. This is especially useful in training people on otherwise costly or dangerous tasks. One example is practising work on high-voltage electric power installations.',
          'An example use case of Augmented Reality/Virtual Reality is simulating different environments to prepare people for real disasters.'
        ]
      ],
      [
        Utilities.createSlug('Crowdsourcing'),
        [
          'Crowdsourcing behaves as a distinct enabler for various digital solutions. Most definitions of crowdsourcing put a strong emphasis on the Internet as the underlying medium. Following this, we can think of crowdsourcing as leveraging the collective intelligence of multiple actors to serve a common goal whereas the processes are usually arranged in online platforms. 56  While there are also commercial applications such as Amazon Mechanical Turk, it is important to note that crowdsourcing commonly refers to the pursuit of an organisational goal that is concerned with the social good. ',
          'An example use case of Crowdsourcing is engaging people to manually label image data – tag houses, infrastructures, landscapes. '
        ]
      ],
      [
        Utilities.createSlug('Data Mining'),
        [
          'Data mining is a process of extracting and discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems.',
          'Data mining is an interdisciplinary subfield of computer science and statistics with an overall goal of extracting information (with intelligent methods) from a data set and transform the information into a comprehensible structure for further use.',
          'Data mining is the analysis step of the "knowledge discovery in databases" process. Aside from the raw analysis step, it also involves database and data management aspects, data pre-processing, model and inference considerations, interestingness metrics, complexity considerations, post-processing of discovered structures, visualization, and online updating.',
          'An example use case of Data Mining is detecting terrorist threats through analysis of computer networks, social networks, fusion of sensor data for nuclear threat detection, face recognition at crowded settings, etc. Data Mining and Machine Learning could be combined with static data  to monitor changing conditions and their impact on static features of the community.'
        ]
      ],
      [
        Utilities.createSlug('Data Extraction'),
        [
          'Data extraction is the act or process of retrieving data out of (usually unstructured or poorly structured) data sources for further data processing or data storage (data migration).',
          'Typical unstructured data sources include web pages, emails, documents, PDFs, scanned text, mainframe reports, spool files, classifieds, etc. which is further used for sales or marketing leads. Extracting data from these unstructured sources has grown into a considerable technical challenge where as historically data extraction has had to deal with changes in physical hardware formats, the majority of current data extraction deals with extracting data from these unstructured data sources, and from different software formats. This growing process of data extraction from the web is referred to as "Web data extraction" or "Web scraping".',
          'An example use case of Data Extraction is  extracting hazard-related information from social media, including volume, unstructured data sources, signal-to-noise ratio even the geographical tags'
        ]
      ],
      [
        Utilities.createSlug('Data Analysis'),
        [
          "Data analysis is a process of inspecting, cleansing, transforming, and modelling data with the goal of discovering useful information, informing conclusions, and supporting decision-making. Data analysis has multiple facets and approaches, encompassing diverse techniques under a variety of names, and is used in different business, science, and social science domains. In today's business world, data analysis plays a role in making decisions more scientific and helping businesses operate more effectively."
        ]
      ],
      [
        Utilities.createSlug('Big Data'),
        [
          'Big data is a field that treats ways to analyze, systematically extract information from, or otherwise deal with data sets that are too large or complex to be dealt with by traditional data-processing application software.',
          'Big data was originally associated with three key concepts: volume, variety, and velocity. The analysis of big data presents challenges in sampling, and thus previously allowing for only observations and sampling. Therefore, big data often includes data with sizes that exceed the capacity of traditional software to process within an acceptable time and value.',
          'Current usage of the term big data tends to refer to the use of predictive analytics, user behavior analytics, or certain other advanced data analytics methods that extract value from big data, and seldom to a particular size of data set.'
        ]
      ],
      [
        Utilities.createSlug('Data Collection and Analysis'),
        ['Will be merged in to Data Analysis, data extraction and analysis']
      ],
      [
        Utilities.createSlug('Mobile App'),
        [
          'A mobile application or app is a computer program or software application designed to run on a mobile device such as a phone, tablet, or watch. Mobile applications often stand in contrast to desktop applications which are designed to run on desktop computers, and web applications which run in mobile web browsers rather than directly on the mobile device.',
          'An example use case of Mobile App is developing a mobile application that matches requests and donations during a disaster scenario'
        ]
      ],
      [
        Utilities.createSlug('Application Programming Interface'),
        [
          'An application programming interface (API) is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build or use such a connection or interface is called an API specification. A computer system that meets this standard is said to implement or expose an API. The term API may refer either to the specification or to the implementation.'
        ]
      ],
      [
        Utilities.createSlug('Cloud Computing'),
        [
          'Cloud technology, and cloud computing as a sub-field, allows access and use of physical services such as servers, storage, and graphical processor over the internet (the “cloud”). This decentralized or distributed approach also allows users to only pay for what they use without adding costs for the local resources. Both the increase in computing power and the better accessibility make cloud computing a powerful enabler of other technologies. For instance, it helps to achieve some of the greatest advancements in the field of AI and enabled individual researchers and developers to compete with large corporations and establish their solutions. ',
          'Both the increase in computing power and the better accessibility make cloud computing a powerful enabler of other technologies. For instance, it helps to achieve some of the greatest advancements in the field of AI and enabled individual researchers and developers to compete with large corporations and establish their solutions. ',
          'An example use case of Crowdsourcing is processing and access large amounts of data in real-time independent of possessing the physical infrastructure.'
        ]
      ],
      [
        Utilities.createSlug('Voice Recognition'),
        [
          'Speech recognition/Voice Recognition is an interdisciplinary subfield of computer science and computational linguistics that develops methodologies and technologies that enable the recognition and translation of spoken language into text by computers with the main benefit of searchability.',
          'An example use case of Voice Recognition is detecting the disaster victim during or after a disaster scenario'
        ]
      ],
      [
        Utilities.createSlug('Web Mapping'),
        [
          'A Web mapping or an online mapping is the process of using the maps delivered by geographic information systems (GIS) on the Internet.',
          'A web map or an online map is both served and consumed, thus web mapping is more than just web cartography, it is a service by which consumers may choose what the map will show. Web GIS emphasizes geodata processing aspects more involved with design aspects such as data acquisition and server software architecture such as data storage and algorithms, than it does the end-user reports themselves.'
        ]
      ],
      [Utilities.createSlug('Image Recognition'), ['Under the compute vision']],
      [
        Utilities.createSlug('Deep Learning'),
        [
          'Deep learning (DL) is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Within DL, we can further consider two different applications – supervised DL and unsupervised DL. The first uses labelled data (examples of what we want the machine to recognize) to map the input to outputs. The second uses unstructured data, for instance the text of a whole document or a set of images without descriptions to find underlying patterns with only minimal human supervision.',
          'An example use case of Deep Learning is predicting the likelihood that a disastrous event will occur.'
        ]
      ],
      [
        Utilities.createSlug('Chatbot'),
        [
          'A chatbot or chatterbot is a software application used to conduct an on-line chat conversation via text or text-to-speech, in lieu of providing direct contact with a live human agent.',
          'Chatbots are used in dialog systems for various purposes including customer service, request routing, or information gathering. While some chatbot applications use extensive word-classification processes, natural language processors, and sophisticated AI, others simply scan for general keywords and generate responses using common phrases obtained from an associated library or database.',
          'Most chatbots are accessed on-line via website popups or through virtual assistants. A chatbot can be used a virtual informative assistant in or after a disaster scenario'
        ]
      ]
    ]);
}
