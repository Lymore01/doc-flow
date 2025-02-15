/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import React from "react";

interface SelectionProps {
  label: string;
  items: string[];
  onValueChange: (value: string) => void;
}

const Selection = React.forwardRef<HTMLSelectElement, SelectionProps>(
  ({ label, items, onValueChange }, ref) => {
    return (
      <div>
        <Select onValueChange={(value) => onValueChange(value.toUpperCase())} defaultValue="">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {items.map((item) => (
                <SelectItem value={item.toUpperCase()} key={item}>
                  {item.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

Selection.displayName = "Selection";

export default Selection;


