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

import background from '../assets/landing/background.jpg';
import cbi2 from '../assets/landing/cbi2.png';
import SDGAI from '../assets/landing/sdg_ai_lab.png';
import UNDP from '../assets/landing/UNDP_logo.png';

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
            borderWidth='5px'
            borderRadius='lg'
            mt={{ base: 0, md: 2, lg: 4, xl: 10 }}
            color='white'
            p={{ base: 3, md: 10 }}
            backgroundColor='#00000075'
          >
            <VStack
              alignItems='flex-start'
              spacing={{ base: '10px', md: '20px' }}
            >
              <chakra.h2
                fontWeight='400'
                color='primary.800'
                opacity='0.8'
                lineHeight={1.5}
                fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
                textAlign={['center', 'center', 'left', 'left']}
              >
                Digital Technologies Radar for Disaster Risk Reduction (FTR4DD)
              </chakra.h2>

              <chakra.p
                fontWeight='400'
                color='primary.800'
                opacity='0.8'
                lineHeight={1.5}
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
            colorScheme='blue'
            size='md'
            borderRadius='0'
            borderColor='black'
            borderWidth='1px'
          >
            Launch Radar
          </Button>
        </MenuItem>
      </Stack>

      <Stack
        w={'full'}
        h={{ sm: '23%', md: '35%' }}
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

          <GridItem colSpan={3}>
            <Grid
              mt={{ base: '5', md: '20' }}
              mx={{ base: '10', md: '0' }}
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)'
              }}
              gap={{ base: '8', sm: '12', md: '16' }}
            >
              <GridItem colSpan={2}>
                <Image src={cbi2} w={{ base: '40%', md: '60%', lg: '40%' }} />
              </GridItem>
              <GridItem colSpan={1}>
                <Image
                  src={UNDP}
                  alt='undp logo'
                  w={{ base: '40%', md: '60%', lg: '40%' }}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Image
                  src={SDGAI}
                  alt='sdg_ai_lab_logo'
                  w={{ base: '40%', md: '60%', lg: '40%' }}
                />
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
      </Stack>
    </VStack>
  </Flex>
);
