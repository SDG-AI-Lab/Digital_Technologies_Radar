import React from 'react';
import cx from 'classnames';
import './Blip.scss';

export const Title: React.FC<{
  label: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  center?: boolean;
}> = ({ label, type = 'h3', center = true }) => {
  switch (type) {
    case 'h1':
      return (
        <h1
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </h2>
      );
    case 'h3':
      return (
        <h3
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </h3>
      );
    case 'h4':
      return (
        <h4
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </h4>
      );
    case 'h5':
      return (
        <h5
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </h5>
      );
    default:
      return (
        <p
          className={cx('blipList-title', { 'blipList-title--center': center })}
        >
          {label}
        </p>
      );
  }
};
