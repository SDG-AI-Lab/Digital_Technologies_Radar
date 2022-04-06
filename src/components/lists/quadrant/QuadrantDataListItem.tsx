import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

import { QuadrantItemList } from './QuadrantItemList';

interface QuadrantDataListItemProps {
  horizonName: string;
  quadrantBlips: BlipType[];
}

export const QuadrantDataListItem: React.FC<QuadrantDataListItemProps> = ({
  horizonName,
  quadrantBlips
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);
  return (
    <>
      <Box flex='1' textAlign='left' as='h5' onClick={toggleShow}>
        {horizonName}
      </Box>

      <Box display={show ? 'block' : 'none'}>
        <QuadrantItemList blips={quadrantBlips} />
      </Box>
    </>
  );

  // return (
  //   <>
  //     <Box>
  //       <AccordionButton>
  //         <Box flex='1' textAlign='left' as='h5'>
  //           {horizonName}
  //         </Box>
  //         <AccordionIcon />
  //       </AccordionButton>
  //     </Box>
  //     <AccordionPanel>
  //       <QuadrantItemList blips={quadrantBlips} />
  //     </AccordionPanel>
  //   </>
  // );
};
