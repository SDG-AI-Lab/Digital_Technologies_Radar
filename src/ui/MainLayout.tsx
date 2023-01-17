import React from 'react';
import cx from 'classnames';
import { Flex } from '@chakra-ui/react';
import './MainLayout.scss';
import { useLocation } from 'react-router-dom';

export const MainLayout: React.FC = ({ children }) => (
  <Flex
    flex={1}
    direction={'column'}
    className={cx({
      centerLayout: !(useLocation().pathname === '/')
    })}
  >
    {children}
  </Flex>
);
