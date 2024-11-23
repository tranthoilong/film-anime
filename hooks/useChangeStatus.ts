import { useState } from 'react';
import { useToast } from './use-toast';

export const useChangeStatus = ()=> {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  const updateStatus = async ({ id, status, table }: { id: string; status: number; table: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/changeStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          table,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      toast({
        title: "Success",
        description: "Status updated successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        variant: "destructive", 
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};