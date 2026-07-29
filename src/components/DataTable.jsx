import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

/**
 * Responsive DataTable
 *
 * - Desktop (>= md): HTML <table> with sticky header + horizontal scroll fallback
 * - Mobile (< md): Compact list rows (1 line: primary + price + chevron),
 *                  click to expand full details. Keep tappable height ≥ 44px
 *                  so scanning 100+ items doesn't feel like endless scrolling.
 *
 * Columns schema:
 *   { key, header, headerClassName?,
 *     cell(row) -> ReactNode,
 *     cardLabel?, cardPrimary?, hideOnCard? }
 *
 * `cardPrimary: true` marks the column that anchors the collapsed mobile row.
 * `hideOnCard: true` hides the column from both collapsed row AND expanded panel.
 *
 * Pass `keyOf(row)` to identify rows.
 * Pass `cardFooter(row)` to render an action row inside the collapsed row
 * (tap target separate from the row expand button via stopPropagation).
 */
export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = 'Chưa có dữ liệu.',
  keyOf = (row) => row.id,
  minWidth = 600,
  cardFooter,
}) {
  const [expandedKey, setExpandedKey] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isEmpty = !data || data.length === 0;

  const toggleRow = (key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop / Tablet - Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          style={{ minWidth: `${minWidth}px` }}
        >
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 bg-gray-50 ${col.headerClassName || ''}`}
                  scope="col"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-8 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyOf(row)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 align-middle">
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile - Compact expandable list */}
      <div className="md:hidden">
        {isEmpty ? (
          <div className="text-center p-8 text-gray-500">{emptyMessage}</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.map((row) => {
              const rowKey = keyOf(row);
              const primaryCol = columns.find((c) => c.cardPrimary);
              const detailCols = columns.filter(
                (c) => !c.cardPrimary && !c.hideOnCard,
              );
              const isExpanded = expandedKey === rowKey;

              return (
                <li key={rowKey} className="bg-white">
                  <div className="flex items-center gap-2 px-4 min-h-[52px]">
                    <button
                      type="button"
                      onClick={() => toggleRow(rowKey)}
                      aria-expanded={isExpanded}
                      className="flex-1 min-w-0 flex items-center gap-3 py-3 text-left active:bg-gray-50 transition-colors -ml-2 pl-2 pr-2 rounded-lg"
                    >
                      {primaryCol && (
                        <div className="flex-1 min-w-0">
                          {primaryCol.cell(row)}
                        </div>
                      )}
                    </button>
                    {cardFooter && (
                      <div className="flex items-center gap-1 shrink-0">
                        {cardFooter(row)}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleRow(rowKey)}
                      aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                      aria-expanded={isExpanded}
                      className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && detailCols.length > 0 && (
                    <dl className="px-4 pb-4 pt-1 bg-gray-50/50 border-t border-gray-100 space-y-2">
                      {detailCols.map((col) => (
                        <div
                          key={col.key}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <dt className="text-gray-500 text-xs uppercase font-medium pt-0.5 shrink-0">
                            {col.cardLabel || col.header}
                          </dt>
                          <dd className="text-right text-gray-900 flex-1 min-w-0">
                            {col.cell(row)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}