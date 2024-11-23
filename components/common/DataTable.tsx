import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TableConfig } from '@/lib/types/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface DataTableProps {
  config: TableConfig;
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  config,
  filters,
  onFiltersChange,
}) => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${config.apiEndpoint}?${queryParams}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!config.deleteEndpoint) return;
    
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${config.deleteEndpoint}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      {config.createLink && (
        <div className="mb-4">
          <Link
            href={config.createLink}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create New
          </Link>
        </div>
      )}

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              {config.columns.map((column) => (
                <th key={column.key} className="py-3 px-6 text-left">
                  {column.title}
                </th>
              ))}
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                {config.columns.map((column) => (
                  <td key={column.key} className="py-3 px-6 text-left">
                    {column.render ? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
                  </td>
                ))}
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center gap-2">
                    {config.editLink && (
                      <Link href={`${config.editLink}/${item.id}`}>
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </Link>
                    )}
                    {config.deleteEndpoint && (
                      <button onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
