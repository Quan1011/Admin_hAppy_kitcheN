import {
  Image as ImageIcon,
  Flame,
  Leaf,
} from 'lucide-react';
import DataTable from './DataTable';
import RowActions from './RowActions';

const ItemThumbnail = ({ url, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  return (
    <div
      className={`${dim} bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center shrink-0`}
    >
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <ImageIcon className="w-4 h-4 text-gray-400" />
      )}
    </div>
  );
};

const TraitsInline = ({ isVegan, isSpicy }) => (
  <span className="inline-flex items-center gap-1">
    {isVegan && (
      <span className="p-0.5 bg-green-100 text-green-700 rounded" title="Chay">
        <Leaf className="w-3 h-3" />
      </span>
    )}
    {isSpicy && (
      <span className="p-0.5 bg-red-100 text-red-600 rounded" title="Cay">
        <Flame className="w-3 h-3" />
      </span>
    )}
  </span>
);

const TraitsFull = ({ isVegan, isSpicy }) => (
  <div className="flex gap-1.5">
    {isVegan && (
      <span className="p-1 bg-green-100 text-green-700 rounded" title="Món Chay">
        <Leaf className="w-4 h-4" />
      </span>
    )}
    {isSpicy && (
      <span className="p-1 bg-red-100 text-red-600 rounded" title="Món Cay">
        <Flame className="w-4 h-4" />
      </span>
    )}
    {!isVegan && !isSpicy && <span className="text-gray-400">—</span>}
  </div>
);

const AllergenChips = ({ itemNumber, itemAllergens, itemAdditives }) => {
  const allergens = itemAllergens[itemNumber] || [];
  const additives = itemAdditives[itemNumber] || [];
  if (!allergens.length && !additives.length) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {allergens.map((code) => (
        <span
          key={`a-${code}`}
          className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded"
          title={`Dị ứng: ${code}`}
        >
          {code}
        </span>
      ))}
      {additives.map((code) => (
        <span
          key={`add-${code}`}
          className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded"
          title={`Phụ gia: ${code}`}
        >
          {code}
        </span>
      ))}
    </div>
  );
};

export default function MenuTable({
  items,
  onEdit,
  onDelete,
  itemAllergens = {},
  itemAdditives = {},
  loading,
}) {
  const columns = [
    {
      key: 'image',
      header: 'Hình ảnh',
      headerClassName: 'w-20',
      hideOnCard: true,
      cell: (item) => <ItemThumbnail url={item.image_url} size="lg" />,
    },
    {
      key: 'name',
      header: 'Tên món (DE / EN)',
      cardPrimary: true,
      cell: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="md:hidden">
            <ItemThumbnail url={item.image_url} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate text-sm">
              {item.name_de || 'N/A'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {item.name_en}
              {item.item_number ? ` · #${item.item_number}` : ''}
            </div>
          </div>
          <div className="md:hidden shrink-0">
            <TraitsInline isVegan={item.is_vegan} isSpicy={item.is_spicy} />
          </div>
        </div>
      ),
    },
    {
      key: 'item_number',
      header: 'Mã',
      headerClassName: 'w-20',
      cardLabel: 'Mã',
      cell: (item) => (
        <span className="font-bold text-gray-700">{item.item_number || '—'}</span>
      ),
    },
    {
      key: 'name_en_sub',
      header: '',
      hideOnCard: true,
      cell: (item) => <span className="text-xs text-gray-500">{item.name_en}</span>,
    },
    {
      key: 'price',
      header: 'Giá tiền',
      cardLabel: 'Giá tiền',
      cell: (item) => (
        <span className="font-semibold text-blue-600">
          {item.price ? `${parseFloat(item.price).toFixed(2)}€` : '—'}
        </span>
      ),
    },
    {
      key: 'traits',
      header: 'Đặc tính',
      cardLabel: 'Đặc tính',
      cell: (item) => <TraitsFull isVegan={item.is_vegan} isSpicy={item.is_spicy} />,
    },
    {
      key: 'allergens',
      header: 'Dị ứng/Phụ gia',
      cardLabel: 'Dị ứng/Phụ gia',
      cell: (item) => (
        <AllergenChips
          itemNumber={item.item_number}
          itemAllergens={itemAllergens}
          itemAdditives={itemAdditives}
        />
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
          onDelete={() => onDelete(item.id, item.item_number)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      loading={loading}
      emptyMessage="Không tìm thấy món ăn nào."
      keyOf={(item) => item.id}
      minWidth={700}
      cardFooter={(item) => (
        <RowActions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id, item.item_number)}
          compact
        />
      )}
    />
  );
}