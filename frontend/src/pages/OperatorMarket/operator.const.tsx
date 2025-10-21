import { Boxes } from "lucide-react";
import { OperatorI } from "./operator.model";

export const mapOperator = (op: OperatorI) => {
  return {
    ...op,
    icon: <Boxes className="w-5 h-5 text-gray-500" />,
  };
};
