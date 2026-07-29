import { Flame, Leaf } from 'lucide-react';
import DataTable from './DataTable';
import RowActions from './RowActions';

const TraitsCell = ({ isVegan, isSpicy }) => (
  <div className="flex gap-1.5 justify-end sm:justify-start">
    {isVegan && (
      <span className="p-1 bg-green-100 text-green-700 rounded" title="Chay">
        <Leaf className="w-4 h-4" />
      </span>
    )}
    {isSpicy && (
      <span className="p-1 bg-red-100 text-red-600 rounded" title="Cay">
        <Flame className="w-4 h-4" />
      </span>
    )}
    {!isVegan && !isSpicy && <span className="text-gray-400">—</span>}
  </div>
);

export default function DishGroupTable({ groups, categories, onEdit, onDelete }) {
  const findCategory = (g) => categories.find((c) => c.id === g.category_id);

  const columns = [
    {
      key: 'id',
      header: 'ID',
      headerClassName: 'w-16',
      cardLabel: 'ID',
      cell: (g) => <span className="font-mono text-gray-500">#{g.id}</span>,
    },
    {
      key: 'category',
      header: 'Thuộc danh mục',
      cardLabel: 'Danh mục',
      cell: (g) => {
        const parent = findCategory(g);
        return (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full inline-block">
            {parent ? parent.name_de : 'Chưa phân loại'}
          </span>
        );
      },
    },
    {
      key: 'name',
      header: 'Tên nhóm món (DE / EN)',
      cardPrimary: true,
      cell: (g) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate text-sm">
            {g.name_de || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 truncate">{g.name_en}</div>
        </div>
      ),
    },
    {
      key: 'base_price',
      header: 'Giá nền',
      cardLabel: 'Giá nền',
      cell: (g) => (
        <span className="font-semibold text-blue-600">
          {g.base_price ? `${parseFloat(g.base_price).toFixed(2)} €` : '—'}
        </span>
      ),
    },
    {
      key: 'traits',
      header: 'Đặc tính',
      cardLabel: 'Đặc tính',
      cell: (g) => <TraitsCell isVegan={g.is_vegan} isSpicy={g.is_spicy} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      hideOnCard: true,
      cell: (g) => (
        <RowActions onEdit={() => onEdit(g)} onDelete={() => onDelete(g.id)} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={groups}
      emptyMessage="Chưa có nhóm món nào."
      keyOf={(g) => g.id}
      minWidth={700}
      cardFooter={(g) => (
        <RowActions
          onEdit={() => onEdit(g)}
          onDelete={() => onDelete(g.id)}
          compact
        />
      )}
    />
  );
}