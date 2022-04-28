import React from 'react';
import { SelectionState } from '@undp_sdg_ai_lab/undp-radar';
import { IconButton } from '@chakra-ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../navigation/routes';

enum BackTo {
  RADAR = 'RADAR',
  QUADRANT = 'QUADRANT',
  ABOUT = 'ABOUT'
}

interface Props {
  to: keyof typeof BackTo;
}

export const BackButton: React.FC<Props> = ({ to }) => {
  const nav = useNavigate();
  return (
    <SelectionState>
      {({
        selectedQuadrant,
        logic: { setSelectedQuadrant, setSelectedItem }
      }): JSX.Element => (
        <IconButton
          aria-label=''
          marginLeft={1}
          background='white'
          color='DodgerBlue'
          icon={<FaArrowLeft />}
          onClick={() => {
            switch (to) {
              case 'QUADRANT':
                setSelectedItem(null);
                if (selectedQuadrant)
                  nav(`${ROUTES.QUADRANT}/${selectedQuadrant}`);
                break;
              case 'ABOUT':
                nav(ROUTES.ABOUT);
                break;
              case 'RADAR': // 'RADAR' is the same as default
              default:
                setSelectedQuadrant(null);
                setSelectedItem(null);
                nav(ROUTES.RADAR);
                break;
            }
          }}
        >
          Back
        </IconButton>
      )}
    </SelectionState>
  );
};
