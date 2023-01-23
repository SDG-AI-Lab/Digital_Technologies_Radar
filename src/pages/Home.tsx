import {
  Flex,
  chakra,
  Image,
  Stack,
  VStack,
  useBreakpointValue,
  Button
} from '@chakra-ui/react';

import { ROUTES } from '../navigation/routes';
import { MenuItem } from '../components/navbar/components/MenuItem';

import background from '../assets/landing/background2.jpg';
import UNDPLogo from '../assets/landing/UNDP-Logo-Blue-Small.png';
import UNDPDRTLogo from '../assets/landing/UNDP_DRT.png';
import CBILogo from '../assets/landing/cbi_logo.png';
import SDGAILabLogo from '../assets/landing/sdg_ai_lab.png';
import cx from 'classnames';

import './Home.scss';
import { useMediaQuery } from '@mui/material';

export const Home: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:767px)');
  return (
    <Flex w={'full'} h={'100vh'} overflowY={'auto'} flexDirection={'row'}>
      <Flex w={useBreakpointValue({ base: '0', md: '30vw' })} h={'100vh'}>
        <VStack justify={'space-between'}>
          <chakra.p
            fontWeight='500'
            color='#334683'
            padding={'0 10px'}
            lineHeight={1.5}
            fontSize={useBreakpointValue({ base: '1xl', md: '2xl' })}
            textAlign={'center'}
            letterSpacing='3px'
            marginTop='200px'
            className={cx({ hideTitleCopy: isMobile })}
          >
            FRONTIER TECHNOLOGY RADAR FOR DISASTER RISK REDUCTION (FTR4DRR)
          </chakra.p>
          <Stack>
            <MenuItem to={ROUTES.RADAR}>
              <Button
                size='lg'
                borderRadius='8px'
                borderWidth='2px'
                marginTop={'-60px'}
                colorScheme='blue'
                className='launchBtnDesktop'
              >
                Launch Radar
              </Button>
            </MenuItem>
          </Stack>
          <div className='partnersList'>
            <Image
              src={UNDPDRTLogo}
              alt='UNDP DRT Logo'
              className='UNDPDRTLogo'
            />
            <Image
              src={SDGAILabLogo}
              alt='SDG AI Lab Logo'
              className='SDGAILogo'
            />
            <Image src={CBILogo} alt='CBI Logo' className='CBILogo' />
          </div>
        </VStack>
      </Flex>
      <Flex
        w={useBreakpointValue({ base: '100vw', md: '70vw' })}
        h={'100vh'}
        backgroundImage={background}
        backgroundPosition={'center'}
        backgroundRepeat='no-repeat'
        backgroundSize={'cover'}
        flexDirection={'column'}
      >
        <Image
          src={UNDPLogo}
          alt='UNDP Logo'
          className='UNDPLogo'
          onClick={() => window.open('https://www.undp.org/', '_newtab')}
        />
        <div className='launchBtnMobile'>
          <MenuItem to={ROUTES.RADAR}>
            <Button
              size='lg'
              borderRadius='8px'
              borderWidth='2px'
              colorScheme='blue'
            >
              Launch Radar
            </Button>
          </MenuItem>
        </div>
      </Flex>
    </Flex>
  );
};
