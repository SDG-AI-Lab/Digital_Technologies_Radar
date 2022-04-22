// import Icon from '@mui/material/Icon/Icon';

export const ShowIcon: React.FC<{
  isOpen: boolean;
  isDisabled?: boolean;
  className?: string;
}> = ({ isOpen, isDisabled = false, className, ...props }) => (
  <svg
    viewBox='0 0 24 24'
    aria-hidden
    className={className}
    style={{
      opacity: isDisabled ? 0.4 : 1,
      transform: isOpen ? 'rotate(-180deg)' : undefined,
      transformOrigin: 'center',
      maxWidth: 20
    }}
    {...props}
  >
    <path
      fill='currentColor'
      d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
    />
  </svg>
);
