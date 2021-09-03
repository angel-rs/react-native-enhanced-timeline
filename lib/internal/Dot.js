import * as React from "react";
import Svg, { Circle } from "react-native-svg";

export function Dot({
  height = 24,
  width = 24,
  color = "#0EA02E",
  fill = "white",
  r: _r,
  svgProps = {},
  ...props
}) {
  const r = _r || height / 2 - 1;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={fill}
      {...svgProps}
    >
      <Circle
        cx={width / 2}
        cy={height / 2}
        stroke={color}
        strokeWidth={2}
        r={r}
        {...props}
      />
    </Svg>
  );
}
