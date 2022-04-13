import React from 'react';
import { FcAbout } from 'react-icons/fc';
import { FiTarget } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import Button from '@mui/material/Button/Button';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from '../../navigation/routes';
import { StackMui } from '../../ui/components/VStackMui';

interface Props {
  isOpen: boolean;
}

export const MenuLinks: React.FC<Props> = ({ isOpen }) => (
  <>
    <div />
    <div style={{ display: isOpen ? 'block' : 'none', alignSelf: 'center' }}>
      <StackMui direction='column'>
        <MenuItem to={ROUTES.RADAR}>
          <Button
            style={{
              borderRadius: 10,
              // colorScheme: 'blue',
              padding: '7px 1px',
              width: '100%'
            }}
          >
            <FiTarget size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.ABOUT}>
          <Button
            style={{
              borderRadius: 10,
              // colorScheme: 'blue',
              padding: '7px 1px',
              width: '100%'
            }}
          >
            <FcAbout size={40} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.SEARCH}>
          <Button
            style={{
              borderRadius: 10,
              // colorScheme: 'blue',
              padding: '7px 1px',
              width: '100%'
            }}
          >
            <FaSearch size={30} />
          </Button>
        </MenuItem>
      </StackMui>
    </div>
    <div />
  </>
);
