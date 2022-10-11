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
import logos from '../assets/landing/logos.png';
import UNDP from '../assets/landing/UNDP-Logo-Blue-Small.png';

export const Home: React.FC = () => (
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
        >
          FRONTIER TECHNOLOGY RADAR FOR DISASTER RISK REDUCTION (FTR4DRR)
        </chakra.p>
        <Stack
          position={useBreakpointValue({ base: 'absolute', md: 'inherit' })}
        >
          <MenuItem to={ROUTES.RADAR}>
            <Button
              size='lg'
              borderRadius='8px'
              borderWidth='2px'
              marginTop={'-60px'}
              colorScheme='blue'
            >
              Launch Radar
            </Button>
          </MenuItem>
        </Stack>
        <Image src={logos} alt='Logos' style={{ padding: '0 10px 20px' }} />
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
        src={UNDP}
        alt='UNDP Logo'
        style={{
          width: useBreakpointValue({ base: '0', md: '100px' }),
          marginTop: '-15px',
          cursor: 'pointer',
          right: '-10px',
          position: 'absolute'
        }}
        onClick={() => window.open('https://www.undp.org/', '_newtab')}
      />
      <div
        style={{
          alignSelf: 'center',
          marginTop: '50vh',
          visibility: useBreakpointValue({ base: 'initial', md: 'hidden' })
        }}
      >
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
