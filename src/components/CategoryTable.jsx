import DataTable from './DataTable';
import RowActions from './RowActions';

export default function CategoryTable({ categories, onEdit, onDelete }) {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      headerClassName: 'w-16',
      cardLabel: 'ID',
      cell: (c) => <span className="font-mono text-gray-500">#{c.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên danh mục (DE / EN)',
      cardPrimary: true,
      cell: (c) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate text-sm">
            {c.name_de || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 truncate">{c.name_en}</div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Mô tả (DE)',
      cardLabel: 'Mô tả',
      cell: (c) => (
        <span className="text-gray-600 max-w-xs truncate block">
          {c.description_de || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      hideOnCard: true,
      cell: (c) => (
        <RowActions onEdit={() => onEdit(c)} onDelete={() => onDelete(c.id)} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      emptyMessage="Chưa có danh mục nào."
      keyOf={(c) => c.id}
      minWidth={600}
      cardFooter={(c) => (
        <RowActions
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c.id)}
          compact
        />
      )}
    />
  );
}