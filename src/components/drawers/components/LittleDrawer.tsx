import React from 'react';

import { Box, Collapse, useDisclosure } from '@chakra-ui/react';

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
    <div
      style={{
        position: 'relative',
        width: isOpen ? width : 42,
        height: isOpen ? height : 40,
        transition: 'all 0.5s',
        marginBottom: 10
      }}
    >
      <Collapse in={isOpen} animateOpacity>
        <Box color='white' rounded='md' shadow='md' maxW={width} maxH={height}>
          <div style={{ padding: 20, paddingLeft: 50, height }}>
            <div
              style={{
                height: '100%',
                overflow: 'auto',
                color: 'black',
                paddingRight: 5
              }}
            >
              {children}
            </div>
          </div>
        </Box>
      </Collapse>

      <div style={{ position: 'absolute', top: 0 }}>
        {<Icon onToggle={onToggle} isOpen={isOpen} />}
      </div>
    </div>
  );
};
