import { colors } from "./colors";

const colorStr = "(" + colors.join(" | ") + ")";
export const colorRegEx = new RegExp(colorStr, "ig");

export const shapesRegEx = new RegExp(
  "( square | rectangle | circle | ball | triangle )",
  "ig"
);

export const commandsRegEx = new RegExp(
  "( color | move | increase | decrease | duplicate | queue | execute )",
  "ig"
);

export const directionsRegEx = new RegExp("( up | down | left | right )", "ig");
