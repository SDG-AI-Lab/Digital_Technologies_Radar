import React from 'react';

import { aboutContentList } from './AboutContent';
import { AboutOrganization } from './AboutOrganization';
import { StackMui } from '../../ui/components/VStackMui';

export const About: React.VFC = () => {
  return (
    <StackMui direction='column'>
      {aboutContentList.map((aboutContentChild, index) => (
        <div className='about-content' key={index}>
          <AboutOrganization organizationContent={aboutContentChild} />
        </div>
      ))}
    </StackMui>
  );
};
