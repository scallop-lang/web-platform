import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell as TableCellComp,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface RelationTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
}

const RelationTable = <TData, TValue = unknown>({
  columns,
  data,
  setTableData,
}: RelationTableProps<TData, TValue>) => {
  // ==================================== HOW THIS WORKS ====================================
  // You rewrite the cell and all of the changes are stored in the tableData state in scallop
  // -editor.tsx. Once you're done making all your changes, you click the "Confirm" button which
  // updates the program.

  const table = useReactTable<TData>({
    columns,
    data,
    defaultColumn: {
      cell: ({ getValue, row: { index }, column: { id } }) => {
        const initialValue = getValue();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue);

        return (
          <input
            value={value as string}
            onChange={(e) => {
              setValue(e.target.value);

              const newData = data;
              if (newData?.[index]) {
                // magic
                (newData[index] as Record<string, unknown>)[id] =
                  e.target.value;
                setTableData(newData);
              }
            }}
          />
        );
      },
    },
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
              {row.getVisibleCells().map((cell) => (
                <TableCellComp key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCellComp>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCellComp
              colSpan={columns.length}
              className="text-center"
            >
              No facts have been defined for this relation.
            </TableCellComp>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { RelationTable };
