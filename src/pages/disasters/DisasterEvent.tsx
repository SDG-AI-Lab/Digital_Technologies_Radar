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
    description: DUMMY_TEXT,
    img_url:
      'https://images.unsplash.com/photo-1677233860259-ce1a8e0f8498?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    name: '2023 Turkey/Syria Earthquake',
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
