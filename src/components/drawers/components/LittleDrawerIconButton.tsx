import {
  Portal,
  Button,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaCaretLeft, FaCog, FaServer } from 'react-icons/fa';
import './LittleDrawer.scss';

enum IconType {
  COG = 'COG',
  SERVER = 'SERVER'
}

interface Props {
  onToggle: () => void;
  isOpen: boolean;
  type: keyof typeof IconType;
  label?: string;
}

export const LittleDrawerIconButton: React.FC<Props> = ({
  onToggle,
  isOpen,
  type,
  label = null
}) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const open = (): void => {
    if (!isOpen) setIsPopupOpen(!isPopupOpen);
  };
  const close = (): void => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!isOpen) close();
  }, [isOpen]);

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isPopupOpen}
      onClose={close}
      placement='right'
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          onClick={onToggle}
          borderRadius={30}
          onMouseOver={open}
          onMouseOut={close}
          className='littleDrawerIconButton'
        >
          {!isOpen && type === IconType.SERVER && (
            <FaServer className='littleDrawerIconButton-adj' />
          )}
          {!isOpen && type === IconType.COG && (
            <FaCog className='littleDrawerIconButton-adj' />
          )}
          {isOpen && <FaCaretLeft className='littleDrawerIconButton-adj' />}
        </Button>
      </PopoverTrigger>
      {label !== null && (
        <Portal>
          <PopoverContent maxW={'min-content'}>
            <PopoverHeader fontWeight='semibold'>{label}</PopoverHeader>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
};
