import React from "react";
import { Link } from "react-router-dom";

interface Props {
  isLast?: boolean;
  to: string;
}

export const MenuItem: React.FC<Props> = ({ children, to = "/" }) => {
  return <Link to={to}>{children}</Link>;
};
