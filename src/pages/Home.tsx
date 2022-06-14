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
import radar from '../assets/landing/radar.png';
import cbi2 from '../assets/landing/cbi2.png';
import SDGAI from '../assets/landing/sdg_ai_lab.png';
import UNDP from '../assets/landing/UNDP_logo.png';

export const Home: React.FC = () => (
  <Flex
    w={'full'}
    h={'100vh'}
    backgroundImage={background}
    backgroundSize={'cover'}
    overflowY={'auto'}
  >
    <VStack>
      <Stack>
        <Grid
          templateRows='repeat(1, 1fr)'
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          <GridItem colSpan={1}>
            <Image
              src={radar}
              alt='radar'
              ml='5'
              mt='5'
              w={150}
              h={150}
              borderRadius='full'
            />
          </GridItem>

          <GridItem
            colSpan={3}
            borderWidth='5px'
            borderRadius='lg'
            mt='2'
            color='white'
            p='10'
            backgroundColor='#00000075'
          >
            <VStack alignItems='flex-start' spacing='20px'>
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
      <Stack>
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
        borderTopWidth='5px'
        borderRadius='0'
        mt='2'
        color='white'
        p='10'
        backgroundColor='#00000075'
      >
        <Grid
          templateRows='repeat(1, 1fr)'
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          <GridItem colSpan={1} />

          <GridItem colSpan={3}>
            <Grid
              mt='20'
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              }}
              gap={{ base: '8', sm: '12', md: '16' }}
            >
              <GridItem colSpan={2}>
                <Image src={cbi2} w={300} h={100} />
              </GridItem>
              <GridItem colSpan={1}>
                <Image src={UNDP} alt='undp logo' w={100} h={150} />
              </GridItem>
              <GridItem colSpan={1}>
                <Image src={SDGAI} alt='sdg_ai_lab_logo' w={150} h={150} />
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem rowSpan={2} colSpan={1} />
        </Grid>
      </Stack>
    </VStack>
  </Flex>
);
