import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ListPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface RelationTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
}

/**
 * How this works: You rewrite the cell and all of the changes are stored in the
 * tableData state in `scallop-editor.tsx`. Once you're done making all your changes,
 * you click the "Confirm" button which updates the program.
 */
const RelationTable = <TData, TValue = unknown>({
  columns,
  data,
  setTableData,
}: RelationTableProps<TData, TValue>) => {
  const table = useReactTable<TData>({
    columns,
    data,
    defaultColumn: {
      cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
        const initialValue = getValue() as string;
        const [value, setValue] = useState(initialValue);

        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        return (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() =>
              table.options.meta?.updateData(index, id, value as TData)
            }
          />
        );
      },
    },

    getCoreRowModel: getCoreRowModel(),

    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip page index reset until after next rerender
        return setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },

      addRow: () => {
        const newRow: Record<string, string> = {};
        newRow.tag = "";

        columns.map((_, index) => {
          const key = index === 0 ? "tag" : `arg${index - 1}`;
          newRow[key] = "";
        });

        const newData = [...data, newRow as unknown as TData];

        setTableData(newData);
      },

      removeRow: (rowIndex: number) => {
        const newData = (old: TData[]) =>
          old.filter((_, index: number) => index !== rowIndex);

        setTableData(newData);
      },
    },
  });

  return (
    <>
      <Table className="border-b-[1.5px] border-border">
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <div>
                  <Button
                    onClick={() => {
                      table.options.meta?.removeRow(row.index);
                    }}
                    variant="destructive"
                  >
                    <X
                      className=""
                      size={16}
                    />
                  </Button>
                </div>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center font-mono text-muted-foreground"
              >
                No facts have been defined for this relation.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="p-2.5">
        <Button
          className="w-full"
          onClick={table.options.meta?.addRow}
          variant="outline"
        >
          <ListPlus
            className="mr-1.5"
            size={16}
          />{" "}
          Add new row
        </Button>
      </div>
    </>
  );
};

export { RelationTable };
