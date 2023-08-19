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
  updateModalTitle: string;
  deleteModalTitle: string;
  deleteModalText: string;
  deleteModalConfirmButtonLabel: string;
  deleteModalCancelButtonLabel: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  updateModalTitle,
  deleteModalTitle,
  deleteModalText,
  deleteModalConfirmButtonLabel,
  deleteModalCancelButtonLabel,
}) => (
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
            <ActionIconsGroup
              rowId={row.id}
              updateModalTitle={updateModalTitle}
              deleteModalTitle={deleteModalTitle}
              deleteModalText={deleteModalText}
              deleteModalConfirmButtonLabel={deleteModalConfirmButtonLabel}
              deleteModalCancelButtonLabel={deleteModalCancelButtonLabel}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </MantineTable>
);

export default CustomTable;
