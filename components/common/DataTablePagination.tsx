import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-end px-2">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => onPageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              page === currentPage - 2 ||
              page === currentPage + 2
            ) {
              return <PaginationEllipsis key={page} />;
            }
            return null;
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
} 