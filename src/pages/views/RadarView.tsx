import React from 'react';

import { Radar } from '@undp_sdg_ai_lab/undp-radar';

import { TechDescription } from '../../radar/tech/TechDescription';
import { WaitingForRadar } from '../../radar/components';
import { PopOverView } from './PopOverView';

import { BlipListMui } from '../../components/lists/components/BlipListMui';
import { Box, Tab, Tabs, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export const RadarView: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // <div style={{ backgroundColor: 'red', flex: 0.6, height: 1200 }}></div>
  //     <div style={{ backgroundColor: 'green' }}></div>

  return (
    <>
      <div style={{ padding: 10 }}>
        {/* <div> */}
        <Typography fontSize={30} color='DarkSlateGray' textAlign='center'>
          Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Typography>
        {loading && <WaitingForRadar size='620px' />}
        {!loading && <Radar />}
        <PopOverView />
      </div>
      <div
        style={{
          flex: 0.75,
          borderColor: 'gray.200',
          borderWidth: 2,
          padding: 10,
          maxWidth: '500px'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab label='Stages' {...a11yProps(0)} />
              <Tab label='Technologies' {...a11yProps(1)} />
              <Tab label='Project' {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <BlipListMui />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TechDescription />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <p>three!</p>
          </TabPanel>
        </Box>
      </div>
    </>
  );
};
