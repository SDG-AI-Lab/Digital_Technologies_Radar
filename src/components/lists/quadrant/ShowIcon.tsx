import cx from 'classnames';

export const ShowIcon: React.FC<{
  isOpen: boolean;
  isDisabled?: boolean;
  className?: string;
  // eslint-disable-next-line react/prop-types
}> = ({ isOpen, isDisabled = false, ...props }) => (
  <svg
    viewBox='0 0 24 24'
    aria-hidden
    className={cx('quadrantShowIcon', {
      'quadrantShowIcon-opacity': isDisabled,
      'quadrantShowIcon-transform': isOpen
    })}
    {...props}
  >
    <path
      fill='currentColor'
      d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
    />
  </svg>
);
