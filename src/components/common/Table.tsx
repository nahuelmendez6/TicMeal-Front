import React from 'react';

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => React.ReactNode;
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
            <tr key={item.id || index}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.render 
                    ? col.render(item[col.accessor], item) 
                    : item[col.accessor]}
                </td>
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
