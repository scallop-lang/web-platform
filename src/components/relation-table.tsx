import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Image from "next/image";
import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface RelationTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const RelationTable = <TData, TValue>({
  columns,
  data,
}: RelationTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-secondary">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="font-mono"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => {
                const cellValue = cell.getValue();
                const parsed = z.coerce.string().url().safeParse(cellValue);

                return (
                  <TableCell key={cell.id}>
                    {flexRender(
                      parsed.success ? (
                        <Image
                          src={parsed.data}
                          alt={`Image located at ${parsed.data}`}
                          width={1920}
                          height={1080}
                          style={{ height: "auto" }}
                        />
                      ) : (
                        cell.column.columnDef.cell
                      ),
                      cell.getContext(),
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center"
            >
              No facts have been defined for this relation.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { RelationTable };
