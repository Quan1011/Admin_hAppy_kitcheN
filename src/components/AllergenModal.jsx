import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';

const EMPTY_FORM = {
  code: '',
  name_de: '',
  name_en: '',
};

export default function AllergenModal({
  isOpen,
  onClose,
  editingData,
  activeTab,
  onSave,
  saving,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    if (editingData) {
      setFormData({
        code: editingData.code ?? '',
        name_de: editingData.name_de ?? '',
        name_en: editingData.name_en ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen, editingData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isAllergen = activeTab === 'allergens';
  const itemName = isAllergen ? 'Dị ứng' : 'Phụ gia';
  const placeholderCode = isAllergen ? 'Ví dụ: A, B, GL...' : 'Ví dụ: 1, 2, 3...';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editingData
              ? `Sửa ${itemName} [${editingData.code}]`
              : `Thêm ${itemName} mới`}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mã nhận diện (Code) *
            </label>
            <input
              type="text"
              required
              disabled={!!editingData}
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder={placeholderCode}
              className="w-full p-2.5 border rounded-lg text-sm font-mono uppercase disabled:bg-gray-100"
            />
            {editingData && (
              <p className="text-[11px] text-gray-400 mt-1">
                Mã khóa chính không thể sửa sau khi tạo.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên tiếng Đức (DE) *
            </label>
            <input
              type="text"
              required
              value={formData.name_de}
              onChange={(e) => handleChange('name_de', e.target.value)}
              placeholder="Ví dụ: Glutenhaltiges Getreide"
              className="w-full p-2.5 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên tiếng Anh (EN)
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => handleChange('name_en', e.target.value)}
              placeholder="Ví dụ: Cereals containing gluten"
              className="w-full p-2.5 border rounded-lg text-sm"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Lưu dữ liệu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
