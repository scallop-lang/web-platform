import type { Argument } from "~/utils/schemas-types";

export function isValidType(value: string, argument: Argument) {
  const argumentType = argument.type;
  if (argumentType === "String") {
    return !/^[0-9]/.test(value) && /^[A-Za-z0-9]*$/.test(value);
    //should be used for relation names
  }
  if (argumentType === "Integer" || argumentType === "Float") {
    // check integer/float case
    if (isNaN(+value)) {
      return false;
    } // invalid number
    if (argumentType === "Integer" && !Number.isInteger(+value)) {
      return false;
    } // invalid Integer
    return true;
  }
  if (argumentType === "Boolean") {
    return value === "true" || value === "false";
  }
  return false;
  // case where argumentType is none of these
}
