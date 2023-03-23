import React from 'react';

import './GenericButton.scss';

interface Props {
  btnProps: {
    text: string;
    link: string;
    customStyle?: object | undefined;
  };
}

export const GenericButton: React.FC<Props> = ({ btnProps }) => {
  const { link, text, customStyle } = btnProps;
  return (
    <a className='genericButton' href={link} style={customStyle}>
      {text}
    </a>
  );
};
