import React from 'react';

interface Props {
  array: string[];
  itemStyle?: React.CSSProperties | ((item: string) => React.CSSProperties);
  children?: (item: string) => React.ReactNode;
}

export const UnorderedList: React.FC<Props> = ({
  children,
  array,
  itemStyle
}) => {
  return (
    <ul
      style={{
        display: 'block',
        // textIndent: 0,
        listStyle: 'none',
        marginBlockStart: 0,
        marginInlineStart: 0,
        paddingInlineStart: 0
      }}
    >
      {array.map((item) => (
        <li
          key={item}
          style={itemStyle instanceof Function ? itemStyle(item) : itemStyle}
        >
          {children && children(item)}
          {!children && item}
        </li>
      ))}
    </ul>
  );
};
