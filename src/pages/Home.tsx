import {
  Flex,
  Grid,
  GridItem,
  chakra,
  Image,
  Stack,
  VStack,
  useBreakpointValue,
  Button
} from '@chakra-ui/react';

import { ROUTES } from '../navigation/routes';
import { MenuItem } from '../components/navbar/components/MenuItem';

import background from '../assets/landing/background_blur.png';
import cbi2 from '../assets/landing/cbi_logo_2.png';
import SDGAI from '../assets/landing/sdgailab_white.png';
import UNDP from '../assets/landing/UNDP-Logo-Blue-Small.png';

export const Home: React.FC = () => (
  <Flex
    w={'full'}
    h={'100vh'}
    mt={{ base: 20, md: 0 }}
    mb={{ base: 19, md: 0 }}
    backgroundImage={background}
    backgroundSize={'cover'}
    backgroundPosition={'center'}
    overflowY={'auto'}
  >
    <VStack>
      <Stack>
        <Grid
          templateRows='repeat(1, 1fr)'
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          <GridItem colSpan={1} />

          <GridItem
            colSpan={3}
            ml={{ base: '7px', sm: '5px', md: '15px' }}
            mr={{ md: '5px' }}
            mt={5}
            borderWidth='5px'
            borderRadius='xl'
            color='white'
            p={{ base: 3, md: 10 }}
            backgroundColor='rgb(0,0,0, 0.6)'
          >
            <VStack
              alignItems='flex-start'
              spacing={{ base: '10px', md: '20px' }}
            >
              <chakra.h2
                fontWeight='400'
                color='primary.800'
                lineHeight={1.5}
                fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
                textAlign={['center', 'center', 'left', 'left']}
                sx={{}}
              >
                Digital Technologies Radar for Disaster Risk Reduction (FTR4DRR)
              </chakra.h2>

              <chakra.p
                fontWeight='400'
                color='primary.800'
                lineHeight={1.5}
                fontSize={'md'}
                textAlign={['center', 'center', 'left', 'left']}
              >
                The Frontier Technology Radar for Disaster Risk Reduction
                (FTR4DRR) aims to highlight the potential of technological
                solutions in disaster contexts to those working in the fields of
                risk reduction, response and recovery. It supports development
                stakeholders to navigate the variety of existing and emerging
                technologies and their possible use cases.
              </chakra.p>
            </VStack>
          </GridItem>
          <GridItem rowSpan={2} colSpan={1} />
        </Grid>
      </Stack>
      <Stack top={{ base: '75%', sm: '55%', md: '56%' }} position='absolute'>
        <MenuItem to={ROUTES.RADAR}>
          <Button
            mt={{ base: '-20px', lg: '20px', xl: '0px' }}
            backgroundColor='rgb(255,255,255, 0.6)'
            size='lg'
            borderRadius='8px'
            borderColor='rgb(255,255,255, 0.6)'
            borderWidth='2px'
          >
            Launch Radar
          </Button>
        </MenuItem>
      </Stack>

      <Stack
        w={'full'}
        h={'20%'}
        borderTopWidth='5px'
        borderRadius='0'
        backgroundColor='#00000075'
        bottom={{ sm: 63, md: 0 }}
        position='fixed'
        display={{ base: 'none', sm: 'block' }}
        zIndex='1'
      >
        <Grid
          templateRows='repeat(1, 1fr)'
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          <GridItem colSpan={1} />

          <GridItem
            style={{ display: 'flex', justifyContent: 'center' }}
            marginTop={{ sm: '50px', md: '60px' }}
            colSpan={3}
          >
            <Image
              src={cbi2}
              alt='CBI Logo'
              style={{ height: '40px', marginRight: '32px', marginTop: '2px' }}
            />

            <Image
              src={UNDP}
              alt='UNDP Logo'
              style={{
                height: '100px',
                marginTop: '-30px',
                marginRight: '30px'
              }}
            />

            <Image
              src={SDGAI}
              alt='SDG AI Lab Logo'
              style={{ height: '40px' }}
            />
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
      </Stack>
    </VStack>
  </Flex>
);
