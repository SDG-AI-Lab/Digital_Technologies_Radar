import { Button } from "@chakra-ui/react";
import React from "react";
import { FaCaretLeft, FaCog, FaServer } from "react-icons/fa";

enum IconType {
  COG = "COG",
  SERVER = "SERVER",
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
  label,
}) => (
  <Button
    onClick={onToggle}
    borderRadius={30}
    style={{ height: 40, width: 40 }}
  >
    {!isOpen && type === IconType.SERVER && (
      <FaServer
        style={{ marginTop: -1, marginRight: -1, transform: "rotate(90deg)" }}
      />
    )}
    {!isOpen && type === IconType.COG && (
      <FaCog
        style={{ marginTop: -1, marginRight: -1, transform: "rotate(90deg)" }}
      />
    )}
    {isOpen && (
      <FaCaretLeft
        style={{ marginTop: -1, marginRight: -1, transform: "rotate(90deg)" }}
      />
    )}
  </Button>
);
