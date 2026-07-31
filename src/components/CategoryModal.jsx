import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';

const EMPTY_FORM = {
  name_de: '',
  name_en: '',
  description_de: '',
  description_en: '',
  sort_order: 0,
};

export default function CategoryModal({
  isOpen,
  onClose,
  editingData,
  onSave,
  saving,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [langTab, setLangTab] = useState('de');

  useEffect(() => {
    if (!isOpen) return;
    if (editingData) {
      setFormData({
        name_de: editingData.name_de ?? '',
        name_en: editingData.name_en ?? '',
        description_de: editingData.description_de ?? '',
        description_en: editingData.description_en ?? '',
        sort_order: editingData.sort_order ?? 0,
      });
    } else {
      setFormData(EMPTY_FORM);
      setLangTab('de');
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editingData ? 'Sửa Danh mục' : 'Thêm Danh mục mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form id="cat-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="flex gap-2 border-b pb-2">
            <button
              type="button"
              onClick={() => setLangTab('de')}
              className={`px-3 py-1 rounded text-xs font-bold ${
                langTab === 'de' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tiếng Đức
            </button>
            <button
              type="button"
              onClick={() => setLangTab('en')}
              className={`px-3 py-1 rounded text-xs font-bold ${
                langTab === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tiếng Anh
            </button>
          </div>

          {langTab === 'de' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tên danh mục (DE) *</label>
                <input
                  type="text"
                  required
                  value={formData.name_de}
                  onChange={(e) => handleChange('name_de', e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả (DE)</label>
                <textarea
                  rows={2}
                  value={formData.description_de}
                  onChange={(e) => handleChange('description_de', e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tên danh mục (EN)</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => handleChange('name_en', e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả (EN)</label>
                <textarea
                  rows={2}
                  value={formData.description_en}
                  onChange={(e) => handleChange('description_en', e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border rounded-lg text-sm"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước</p>
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
              form="cat-form"
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
