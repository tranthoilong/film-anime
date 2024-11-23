import { FilterConfig } from '@/lib/types/table';
import { Search } from 'lucide-react';

interface TableFilterProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export const TableFilter: React.FC<TableFilterProps> = ({
  filters,
  values,
  onChange,
}) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="flex gap-4 mb-6">
      {filters.map((filter) => {
        switch (filter.type) {
          case 'text':
            return (
              <div key={filter.key} className="relative">
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  value={values[filter.key] || ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            );
          case 'select':
            return (
              <select
                key={filter.key}
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">{filter.placeholder}</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}; 