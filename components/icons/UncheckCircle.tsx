import * as React from 'react';
import { IconProps } from 'types';

export const UncheckCircleIcon: React.FC<IconProps> = ({ size = 4.5 }) => {
  return (
    <svg
      width={`${size * 4}px`}
      height={`${size * 4}px`}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.5">
        <circle cx="9" cy="9" r="8" fill="white" />
        <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.1" />
      </g>
    </svg>
  );
};
