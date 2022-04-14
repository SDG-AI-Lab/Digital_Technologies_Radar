import Badge from '@mui/material/Badge/Badge';
import Box from '@mui/material/Box/Box';
import Paper from '@mui/material/Paper/Paper';
import Typography from '@mui/material/Typography/Typography';
import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import React from 'react';
import { StackMui } from '../ui/components/VStackMui';

import './PopOver.scss';

const badgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  margin: 1,
  padding: '5px 4px',
  borderRadius: 50,
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: 15
};

/**
 * @impl example of PopOver
 */
export const PopOver: React.FC = () => {
  const {
    state: { hoveredItem: item }
  } = useRadarState();
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  return React.useMemo(
    () => (
      <>
        {item && (
          <Paper
            style={{
              boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.25)',
              borderRadius: 10,
              padding: 5,
              maxWidth: 300
            }}
          >
            <Box>
              <Typography fontSize={18} className={'popOverTitle'}>
                {item[titleKey]}
              </Typography>
            </Box>

            <Typography fontSize={15} className={'popOverDescription'}>
              {item['Description']}
            </Typography>

            <StackMui style={{ margin: 0, padding: 0, paddingTop: 2 }}>
              <StackMui
                direction='column'
                style={{
                  alignItems: 'stretch',
                  flex: 1,
                  margin: 0,
                  padding: 0
                }}
              >
                <Badge
                  style={{ ...badgeStyle, backgroundColor: 'purple' }}
                  className={'popBadge'}
                >
                  <div>📍</div>
                  <div>{item['Country of Implementation']}</div>
                </Badge>
                <Badge
                  style={{ ...badgeStyle, backgroundColor: 'green' }}
                  className={'popBadge'}
                >
                  <div>🎯</div>
                  <div>{item['SDG']?.join(', ')}</div>
                </Badge>
              </StackMui>
              <StackMui
                direction='column'
                style={{
                  alignItems: 'stretch',
                  flex: 1,
                  margin: 0,
                  padding: 0
                }}
              >
                <Badge
                  style={{ ...badgeStyle, backgroundColor: 'black' }}
                  className={'popBadge'}
                >
                  <div>🏠</div>
                  <div>{item['Status/Maturity']}</div>
                </Badge>
                <Badge
                  style={{ ...badgeStyle, backgroundColor: '#2B6CB0' }}
                  className={'popBadge'}
                >
                  <div>🌋</div>
                  <div>{item['Disaster Cycle']}</div>
                </Badge>
              </StackMui>
            </StackMui>
          </Paper>
        )}
      </>
    ),
    [item, titleKey]
  );
};
