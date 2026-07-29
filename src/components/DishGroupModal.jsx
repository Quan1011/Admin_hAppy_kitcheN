import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { X, Check, Loader2 } from 'lucide-react';

const EMPTY_FORM = {
  category_id: '',
  name_de: '',
  name_en: '',
  base_price: '',
  is_vegan: false,
  is_spicy: false,
};

export default function DishGroupModal({
  isOpen,
  onClose,
  editingData,
  categories,
  allergens,
  additives,
  onSave,
  saving,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedAdditives, setSelectedAdditives] = useState([]);
  const [langTab, setLangTab] = useState('de');

  useEffect(() => {
    if (!isOpen) return;
    if (editingData) {
      setFormData({
        category_id: editingData.category_id ?? '',
        name_de: editingData.name_de ?? '',
        name_en: editingData.name_en ?? '',
        base_price: editingData.base_price ?? '',
        is_vegan: !!editingData.is_vegan,
        is_spicy: !!editingData.is_spicy,
      });
      let cancelled = false;
      Promise.all([
        supabase
          .from('dish_group_allergen')
          .select('allergen_code')
          .eq('dish_group_id', editingData.id),
        supabase
          .from('dish_group_additive')
          .select('additive_code')
          .eq('dish_group_id', editingData.id),
      ]).then(([aRes, addRes]) => {
        if (cancelled) return;
        setSelectedAllergens((aRes.data || []).map((r) => r.allergen_code));
        setSelectedAdditives((addRes.data || []).map((r) => r.additive_code));
      });
      return () => {
        cancelled = true;
      };
    } else {
      setFormData(EMPTY_FORM);
      setSelectedAllergens([]);
      setSelectedAdditives([]);
      setLangTab('de');
    }
  }, [isOpen, editingData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, selectedAllergens, selectedAdditives);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editingData ? 'Sửa Nhóm món' : 'Thêm Nhóm món mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form id="group-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Thuộc danh mục lớn *</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_de} / {c.name_en}
                </option>
              ))}
            </select>
          </div>

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
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tên nhóm món (DE) *</label>
              <input
                type="text"
                required
                value={formData.name_de}
                onChange={(e) => handleChange('name_de', e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tên nhóm món (EN)</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => handleChange('name_en', e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm"
              />
            </div>
          )}

          <div className="space-y-4 pt-2 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Giá nền (Base Price €)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => handleChange('base_price', e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_vegan}
                    onChange={(e) => handleChange('is_vegan', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-xs font-medium text-gray-700">Món chay</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_spicy}
                    onChange={(e) => handleChange('is_spicy', e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-xs font-medium text-gray-700">Món cay</span>
                </label>
              </div>
            </div>

            {allergens.length > 0 && (
              <AllergenSelector
                allergens={allergens}
                selected={selectedAllergens}
                onToggle={(code) =>
                  setSelectedAllergens((prev) =>
                    prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
                  )
                }
              />
            )}

            {additives.length > 0 && (
              <AdditiveSelector
                additives={additives}
                selected={selectedAdditives}
                onToggle={(code) =>
                  setSelectedAdditives((prev) =>
                    prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
                  )
                }
              />
            )}
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
              form="group-form"
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

function AllergenSelector({ allergens, selected, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">Chất gây dị ứng mặc định</label>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border max-h-24 overflow-y-auto">
        {allergens.map((a) => {
          const isChecked = selected.includes(a.code);
          return (
            <button
              type="button"
              key={a.code}
              onClick={() => onToggle(a.code)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                isChecked ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              [{a.code}] {a.name_de || a.name_en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdditiveSelector({ additives, selected, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">Chất phụ gia mặc định</label>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border max-h-24 overflow-y-auto">
        {additives.map((add) => {
          const isChecked = selected.includes(add.code);
          return (
            <button
              type="button"
              key={add.code}
              onClick={() => onToggle(add.code)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                isChecked ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              [{add.code}] {add.name_de || add.name_en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
