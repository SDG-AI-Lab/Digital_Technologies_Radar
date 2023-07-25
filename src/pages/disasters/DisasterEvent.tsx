import { PageDetails } from 'components/pageDetails/PageDetails';

const DUMMY_TEXT =
  'Lorem ipsum odor amet, consectetuer adipiscing elit. Sem litora montes sociosqu sociosqu neque sagittis habitasse. Ac vehicula ad hendrerit cubilia sodales id; faucibus varius. Fringilla adipiscing enim fames erat donec lobortis ante commodo parturient. Ultrices rhoncus inceptos conubia praesent nostra luctus fermentum aliquam. Consequat rhoncus ipsum inceptos senectus; nascetur nullam aliquam.';

export const DisasterEvent: React.FC = () => {
  const item = {
    sections: [
      'overview',
      'impact',
      'how to help',
      'resources',
      'solutions',
      'data',
      'contacts'
    ],
    description:
      'An application programming interface (API) is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build or use such a connection or interface is called an API specification. A computer system that meets this standard is said to implement or expose an API. The term API may refer either to the specification or to the implementation.',
    img_url:
      'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
    name: 'Application Programming Interface',
    slug: 'application-programming-interface',
    source: 'https://www.google.com',
    overview: DUMMY_TEXT,
    impact: DUMMY_TEXT,
    'how to help': DUMMY_TEXT,
    resources: DUMMY_TEXT,
    solutions: DUMMY_TEXT,
    data: DUMMY_TEXT,
    contacts: DUMMY_TEXT
  };

  return <PageDetails item={item} />;
};
