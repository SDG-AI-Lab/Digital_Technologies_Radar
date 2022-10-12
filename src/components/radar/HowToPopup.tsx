import React from 'react';
import { AiOutlineAim } from 'react-icons/ai';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Image,
  Button
} from '@chakra-ui/react';
import './HowToPopup.scss';
import Blip from '../../../src/assets/components/Blips.png';
import TechnologiesFilter from '../../../src/assets/components/Technologies.png';
import DisasterDropdown from '../../../src/assets/components/Disaster_type.png';
import QuadrantTitle from '../../../src/assets/components/Quadrant.png';

export const HowToPopup: React.FC = () => {
  return (
    <div>
      <Popover trigger={'hover'} variant={'max70PercentHeight'}>
        <PopoverTrigger>
          <Button
            position={'absolute'}
            right={30}
            m={7}
            px={25}
            colorScheme='blue'
            rightIcon={<AiOutlineAim />}
            borderRadius={'0'}
            className='how-to-button'
          >
            How to use
          </Button>
        </PopoverTrigger>
        <PopoverContent className='popoverContent' overflow={'auto'}>
          <PopoverHeader color={'DarkSlateGray'}>
            <h1>How to use the DRR Technology Radar</h1>
          </PopoverHeader>
          <PopoverBody overflow={'auto'}>
            <div className='timeline-container'>
              <div className='timeline'>
                <div className='container'>
                  <div className='content'>
                    <h2 className='timeline-boundary'>On radar</h2>
                    <Image m={5} src={Blip} />
                    <p>
                      Click (or hover) on the rounded blips on the radar to view
                      the summary of each technology item.
                    </p>
                  </div>
                </div>
                <div className='container'>
                  <div className='content'>
                    <h2>Filtering</h2>
                    <Image m={5} src={TechnologiesFilter} />
                    <p>
                      Click on the technology names to filter the blips on the
                      radar and learn more about the technology.
                    </p>
                    <Image m={5} src={DisasterDropdown} />
                    <p>
                      Click on the dropdown lists in different specifications
                      and select options to filter the radar further.
                    </p>
                  </div>
                </div>
                <div className='container'>
                  <div className='content'>
                    <h2>Reviewing Radar Quadrants</h2>
                    <Image m={5} src={QuadrantTitle} />
                    <p>
                      Click on each of the phases on each corner of the radar to
                      focus on them.
                    </p>
                  </div>
                </div>
                <div className='container'>
                  <div className='content'>
                    <h2 className='timeline-boundary'>Feedback</h2>
                    <p>
                      Got any further questions or comments?{' '}
                      <a
                        href='mailto:ftr4drr@undp.org'
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        Contact out us via e-mail.
                      </a>
                    </p>
                  </div>
                </div>
                <div className='container'>
                  <div className='content'>
                    <div className='timeline-boundary'></div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};
