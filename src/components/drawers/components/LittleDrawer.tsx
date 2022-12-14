import React from 'react';
import cx from 'classnames';

import { Box, Collapse, useDisclosure } from '@chakra-ui/react';
import './LittleDrawer.scss';

interface Props {
  height?: number;
  width?: number;
  icon: React.FC<{ onToggle: () => void; isOpen: boolean; label?: string }>;
}

export const LittleDrawer: React.FC<Props> = ({
  children,
  height = 400,
  width = 350,
  icon: Icon
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div className={cx('littleDrawer', { 'littleDrawer-open': isOpen })}>
      <Collapse in={isOpen} animateOpacity>
        <Box color='white' rounded='md' shadow='md' maxW={width} maxH={height}>
          <div className='littleDrawer-container'>
            <div className='littleDrawer-box'>{children}</div>
          </div>
        </Box>
      </Collapse>

      <div className='littleDrawer-iconContainer'>
        {<Icon onToggle={onToggle} isOpen={isOpen} />}
      </div>
    </div>
  );
};
