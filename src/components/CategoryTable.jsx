import DataTable from './DataTable';
import RowActions from './RowActions';

export default function CategoryTable({ categories, onEdit, onDelete }) {
  const columns = [
    {
      key: 'sort_order',
      header: 'Thứ tự',
      headerClassName: 'w-20',
      cardLabel: 'Thứ tự',
      cell: (c) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
          {c.sort_order ?? 0}
        </span>
      ),
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