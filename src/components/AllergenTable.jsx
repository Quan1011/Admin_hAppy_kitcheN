import DataTable from './DataTable';
import RowActions from './RowActions';

export default function AllergenTable({ items, activeTab, onEdit, onDelete }) {
  const isAllergen = activeTab === 'allergens';

  const codeBadge = (code) => (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
        isAllergen
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-purple-100 text-purple-800 border border-purple-300'
      }`}
    >
      [{code}]
    </span>
  );

  const columns = [
    {
      key: 'code',
      header: 'Mã (Code)',
      headerClassName: 'w-28',
      cardPrimary: true,
      cell: (item) => codeBadge(item.code),
    },
    {
      key: 'name_de',
      header: 'Tên tiếng Đức (DE)',
      cardLabel: 'Tiếng Đức',
      cell: (item) => (
        <span className="font-medium text-gray-900">{item.name_de || '—'}</span>
      ),
    },
    {
      key: 'name_en',
      header: 'Tên tiếng Anh (EN)',
      cardLabel: 'Tiếng Anh',
      cell: (item) => (
        <span className="text-gray-500">{item.name_en || '—'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      hideOnCard: true,
      cell: (item) => (
        <RowActions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="Chưa có dữ liệu nào."
      keyOf={(item) => item.code}
      minWidth={500}
      cardFooter={(item) => (
        <RowActions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          compact
        />
      )}
    />
  );
}