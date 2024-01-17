import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { send } from "process";

import React from "react";
import { useEffect, useState } from "react";
import { set } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import type { NodeTableProps, Table as RelTable } from "~/utils/relation-button";


interface RelationTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTableData: (data: TData[]) => void;
}

const RelationTable = <TData, TValue>({
  columns,
  data,
  setTableData
}: RelationTableProps<TData, TValue>) => {

  // ==================================== HOW THIS WORKS ====================================
  // You rewrite the cell and all of the changes are stored in the tableData state in scallop
  // -editor.tsx. Once you're done making all your changes, you click the "Confirm" button which
  // updates the program.

  const defaultColumn: Partial<ColumnDef<TData, unknown>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [value, setValue] = useState(initialValue);

      return (
        <input
          value={value as string}
          onChange={((e) => {
            setValue(e.target.value);

            const newData = data;
            if (newData && newData[index]) {
              // magic
              (newData[index] as Record<string, unknown>)[id] = e.target.value;
              setTableData(newData);
            }
          })}
        >
        </input>
      )
    },
  }

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
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
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
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
