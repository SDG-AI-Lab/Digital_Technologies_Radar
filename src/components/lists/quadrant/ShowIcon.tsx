import { cx } from '@chakra-ui/utils';
import { IconProps, SystemStyleObject, Icon } from '@chakra-ui/react';

export const ShowIcon: React.FC<
  IconProps & { isOpen: boolean; isDisabled?: boolean }
> = ({ isOpen, isDisabled = false, ...props }) => {
  const _className = cx('chakra-accordion__icon', props.className);

  const iconStyles: SystemStyleObject = {
    opacity: isDisabled ? 0.4 : 1,
    transform: isOpen ? 'rotate(-180deg)' : undefined,
    transformOrigin: 'center'
  };

  return (
    <Icon
      viewBox='0 0 24 24'
      aria-hidden
      className={_className}
      __css={iconStyles}
      {...props}
    >
      <path
        fill='currentColor'
        d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
      />
    </Icon>
  );
};
