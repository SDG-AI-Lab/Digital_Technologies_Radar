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
  const open = () => {
    if (!isOpen) setIsPopupOpen(!isPopupOpen);
  };
  const close = () => {
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
          style={{ height: 40, width: 40 }}
          onMouseOver={open}
          onMouseOut={close}
        >
          {!isOpen && type === IconType.SERVER && (
            <FaServer style={{ marginTop: -1, marginRight: -1 }} />
          )}
          {!isOpen && type === IconType.COG && (
            <FaCog style={{ marginTop: -1, marginRight: -1 }} />
          )}
          {isOpen && <FaCaretLeft style={{ marginTop: -1, marginRight: -1 }} />}
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
