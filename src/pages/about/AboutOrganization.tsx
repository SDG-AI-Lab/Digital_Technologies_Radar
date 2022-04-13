import Box from '@mui/material/Box/Box';
import Card from '@mui/material/Card/Card';
import Typography from '@mui/material/Typography/Typography';
import CardContent from '@mui/material/CardContent/CardContent';

import { AboutContentChild } from './AboutContent';

interface AboutOrganizationProps {
  organizationContent: AboutContentChild;
}

export const AboutOrganization: React.FC<AboutOrganizationProps> = (props) => (
  <Box sx={{ minWidth: 275 }}>
    <Card variant='outlined'>
      <>
        <CardContent>
          <div
            style={{ display: 'flex', alignItems: 'center', paddingBottom: 10 }}
          >
            <Typography variant='h3' fontSize='2xl'>
              {props.organizationContent.title}
            </Typography>
            <img
              // boxSize={16}
              style={{ objectFit: 'contain', maxWidth: 30, paddingLeft: 10 }}
              alt={props.organizationContent.title}
              src={props.organizationContent.imageSrc}
            />
          </div>
          <Typography fontSize='sm'>
            {props.organizationContent.description}
          </Typography>
        </CardContent>
      </>
    </Card>
  </Box>
);
