'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataItem {
  id: string;
  title: string;
}

interface SelectDataProps {
  endpoint: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
}

export const SelectData = ({ endpoint, onSelect, placeholder = "Chọn..." }: SelectDataProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (result.statusCode === 200) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        {value
          ? data.find((item) => item.id === value)?.title
          : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute mt-2 w-full rounded-md border bg-white shadow-lg z-50">
          <input
            className="w-full px-3 py-2 border-b"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-60 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-gray-500">Đang tải...</div>
            ) : filteredData.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">Không tìm thấy kết quả.</div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100",
                    value === item.id && "bg-gray-100"
                  )}
                  onClick={() => {
                    const newValue = item.id === value ? "" : item.id;
                    setValue(newValue);
                    onSelect?.(newValue);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.title}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
