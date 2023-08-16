import { Table as MantineTable } from '@mantine/core';
import React from 'react';
import ActionIconsGroup from '../ActionIconGroup';

interface CustomTableColumn {
  key: string;
  title: string;
}

interface CustomTableRow {
  [key: string]: any;
}

interface CustomTableProps {
  columns: CustomTableColumn[];
  data: CustomTableRow[];
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data }) => (
  <MantineTable
    verticalSpacing="md"
    horizontalSpacing="md"
    fontSize="lg"
    my="md"
    mx="md"
    striped
    highlightOnHover
  >
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key}>{column.title}</th>
        ))}
        <th />
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
            <td key={column.key}>{row[column.key]}</td>
          ))}
          <td>
            <ActionIconsGroup rowId={row.id} />
          </td>
        </tr>
      ))}
    </tbody>
  </MantineTable>
);

export default CustomTable;
