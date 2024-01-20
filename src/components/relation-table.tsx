import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  TableBody,
  Table as TableCell,
  TableCell as TableCellComp,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { Button } from "./ui/button";
import { X } from "lucide-react";

interface RelationTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
  }
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
      cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue);

        const onBlur = () => {
          table.options.meta?.updateData(index, id, value);
        };

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        return (
          <input
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
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
        columns.map((column, index) => {
          const key = index === 0 ? "tag" : `arg${index - 1}`;
          newRow[key] = "";
        });

        const newData = [...data, newRow as unknown as TData];
        setTableData(newData);
      },
      removeRow: (rowIndex: number) => {
        const newData = (old : TData[]) => 
          old.filter((_row: TData, index : number) => index !== rowIndex);
        setTableData(newData);
      }
    },
  });

  const FooterCell = () => {
    const meta = table.options.meta;
    return (
      <div className="w-full p-2">
        <Button
          className="w-full"
          onClick={meta?.addRow}
          variant="outline"
        >
          Add Row
        </Button>
      </div>
    );
  };

  return (
    <div>
      <TableCell>
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
                <div className="">
                  <Button
                    onClick={() => {table.options.meta?.removeRow(row.index)}}
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
              <TableCellComp
                colSpan={columns.length}
                className="text-center"
              >
                No facts have been defined for this relation.
              </TableCellComp>
            </TableRow>
          )}
        </TableBody>
      </TableCell>
      <FooterCell/>
    </div>
  );
};

export { RelationTable };
