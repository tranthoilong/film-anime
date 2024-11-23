'use client';

import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFilterDataTableProps {
  value: string;
  onValueChange: (value: string) => void;
  data: { id: string; name: string; }[];
  placeholder: string;
  width: string;
}

export const SelectFilterDataTable = ({
  value,
  onValueChange,
  data,
  placeholder,
  width
}: SelectFilterDataTableProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-[${width}]`}>
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        {data.map(item => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
