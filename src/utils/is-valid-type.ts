import type { Argument } from "~/utils/schemas-types";

export function isValidType(value: string, argument: Argument) {
  const argumentType = argument.type;
  //should be used for relation names
  if (argumentType === "String") {
    return !/^[0-9]/.test(value) && /^[A-Za-z0-9]*$/.test(value);
  }
  // check integer/float case
  if (argumentType === "Integer" || argumentType === "Float") { 
    // invalid number
    if (isNaN(+value)) {
      return false;
    }
    // invalid integer
    if (argumentType === "Integer" && !Number.isInteger(+value)) {
      return false;
    }
    return true;
  }
  if (argumentType === "Boolean") {
    return value === "true" || value === "false";
  }
  // case where argumentType is none of these
  return false;
}
