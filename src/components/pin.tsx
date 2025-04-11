import React from "react";
import { Rate } from "antd";

interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Pin = ({ checked, onCheckedChange, ...restProps }: PinProps) => {
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      //because onCheckedChange is optional. so it may be undefined, so we need to use ? to indicate that it's optional for below function
      onChange={(num) => onCheckedChange?.(!!num)}
      {...restProps}
    />
  );
};
