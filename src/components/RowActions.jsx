import { Edit2, Trash2 } from 'lucide-react';

/**
 * Shared row action buttons (Edit / Delete).
 *
 * `compact` = icon-only circular buttons (used in mobile collapsed list rows
 *             where horizontal space is precious).
 * default  = stacked labeled buttons (used in mobile expanded panel) or
 *            icon buttons (desktop table).
 */
export default function RowActions({ onEdit, onDelete, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label="Chỉnh sửa"
            className="p-2 hover:bg-gray-100 text-blue-600 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            aria-label="Xóa"
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          aria-label="Chỉnh sửa"
          className="p-2 hover:bg-gray-100 text-blue-600 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Xóa"
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}