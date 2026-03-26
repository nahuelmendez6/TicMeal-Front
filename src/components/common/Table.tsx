import React from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  renderRowActions?: (item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, renderRowActions }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            {renderRowActions && <th />}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.accessor}>{item[col.accessor]}</td>
              ))}
              {renderRowActions && (
                <td className="text-end">
                  {renderRowActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
