import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { uploadToCloudinary } from '../config/cloudinary';
import {
  X, Check, Loader2, Image as ImageIcon, Upload, Check as CheckIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  item_number: '',
  category_id: '',
  dish_group_id: '',
  name_de: '',
  name_en: '',
  description_de: '',
  description_en: '',
  price: '',
  image_url: '',
  is_vegan: false,
  is_spicy: false,
  status: true,
};

export default function MenuModal({
  isOpen,
  onClose,
  editingItem,
  categories,
  dishGroups,
  allergens,
  additives,
  onSave,
  saving,
  uploadingImage,
  setUploadingImage,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedAdditives, setSelectedAdditives] = useState([]);
  const [activeTab, setActiveTab] = useState('de');

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setFormData({
        item_number: editingItem.item_number ?? '',
        category_id: editingItem.category_id ?? '',
        dish_group_id: editingItem.dish_group_id ?? '',
        name_de: editingItem.name_de ?? '',
        name_en: editingItem.name_en ?? '',
        description_de: editingItem.description_de ?? '',
        description_en: editingItem.description_en ?? '',
        price: editingItem.price ?? '',
        image_url: editingItem.image_url ?? '',
        is_vegan: !!editingItem.is_vegan,
        is_spicy: !!editingItem.is_spicy,
        status: editingItem.status ?? true,
      });
    } else {
      setFormData(EMPTY_FORM);
      setSelectedAllergens([]);
      setSelectedAdditives([]);
    }
  }, [isOpen, editingItem]);

  useEffect(() => {
    if (!isOpen || !editingItem?.item_number) {
      if (!isOpen) setSelectedAllergens([]);
      if (!isOpen) setSelectedAdditives([]);
      return;
    }
    let cancelled = false;
    Promise.all([
      supabase
        .from('menu_item_allergen')
        .select('allergen_code')
        .eq('item_number', editingItem.item_number),
      supabase
        .from('menu_item_additive')
        .select('additive_code')
        .eq('item_number', editingItem.item_number),
    ]).then(([aRes, addRes]) => {
      if (cancelled) return;
      setSelectedAllergens((aRes.data || []).map((r) => r.allergen_code));
      setSelectedAdditives((addRes.data || []).map((r) => r.additive_code));
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const filteredDishGroupsInModal = dishGroups.filter(
    (g) => !formData.category_id || g.category_id === parseInt(formData.category_id)
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
    } catch (error) {
      toast.error('Tải ảnh thất bại: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name_de) return toast.error('Vui lòng nhập tên món (Tiếng Đức)');
    onSave(formData, selectedAllergens, selectedAdditives);
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleAllergen = (code) => {
    setSelectedAllergens((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleAdditive = (code) => {
    setSelectedAdditives((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {editingItem ? 'Sửa món ăn' : 'Thêm món ăn mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form id="dish-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Ảnh món ăn */}
          <ImageUploadSection
            imageUrl={formData.image_url}
            uploading={uploadingImage}
            onImageChange={handleImageChange}
          />

          {/* Danh mục & Nhóm món & Số món */}
          <CategoryGroupSelector
            formData={formData}
            categories={categories}
            dishGroups={filteredDishGroupsInModal}
            onChange={updateFormData}
          />

          {/* Giá & Nhãn chay/cay */}
          <PriceAndTagsSection formData={formData} onChange={updateFormData} />

          {/* Đa ngôn ngữ (Tên & Mô tả) */}
          <MultilanguageSection
            formData={formData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onChange={updateFormData}
          />

          {/* Dị ứng (Allergens) */}
          {allergens.length > 0 && (
            <AllergenSelector
              allergens={allergens}
              selected={selectedAllergens}
              onToggle={toggleAllergen}
            />
          )}

          {/* Phụ gia (Additives) */}
          {additives.length > 0 && (
            <AdditiveSelector
              additives={additives}
              selected={selectedAdditives}
              onToggle={toggleAdditive}
            />
          )}
        </form>

        {/* Modal Footer */}
        <ModalFooter onClose={onClose} saving={saving} uploading={uploadingImage} />
      </div>
    </div>
  );
}

function ImageUploadSection({ imageUrl, uploading, onImageChange }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center relative">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-gray-400" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
        <Upload className="w-4 h-4" />
        <span>{uploading ? 'Đang tải...' : 'Chọn ảnh món'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={onImageChange} disabled={uploading} />
      </label>
    </div>
  );
}

function CategoryGroupSelector({ formData, categories, dishGroups, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Mã món (Item No)</label>
        <input
          type="text"
          value={formData.item_number}
          onChange={(e) => onChange({ item_number: e.target.value })}
          className="w-full p-2 border rounded-lg"
          placeholder="VD: 101, A1"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Danh mục lớn</label>
        <select
          value={formData.category_id}
          onChange={(e) => onChange({ category_id: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_de}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Nhóm món</label>
        <select
          value={formData.dish_group_id}
          onChange={(e) => onChange({ dish_group_id: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Chọn nhóm món --</option>
          {dishGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name_de}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PriceAndTagsSection({ formData, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Giá tiền (€)</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => onChange({ price: e.target.value })}
          className="w-full p-2 border rounded-lg"
          placeholder="12.50"
        />
      </div>
      <div className="flex items-center gap-4 pt-4 sm:col-span-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_vegan}
            onChange={(e) => onChange({ is_vegan: e.target.checked })}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Món chay</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_spicy}
            onChange={(e) => onChange({ is_spicy: e.target.checked })}
            className="w-4 h-4 text-red-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Món cay</span>
        </label>
      </div>
    </div>
  );
}

function MultilanguageSection({ formData, activeTab, onTabChange, onChange }) {
  return (
    <div className="border-t pt-3">
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onTabChange('de')}
          className={`px-3 py-1 rounded-md text-xs font-bold ${
            activeTab === 'de' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tiếng Đức
        </button>
        <button
          type="button"
          onClick={() => onTabChange('en')}
          className={`px-3 py-1 rounded-md text-xs font-bold ${
            activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tiếng Anh
        </button>
      </div>

      {activeTab === 'de' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên món (DE) *</label>
            <input
              type="text"
              required
              value={formData.name_de}
              onChange={(e) => onChange({ name_de: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả món (DE)</label>
            <textarea
              rows={2}
              value={formData.description_de}
              onChange={(e) => onChange({ description_de: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên món (EN)</label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => onChange({ name_en: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả món (EN)</label>
            <textarea
              rows={2}
              value={formData.description_en}
              onChange={(e) => onChange({ description_en: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AllergenSelector({ allergens, selected, onToggle }) {
  return (
    <div className="border-t pt-3">
      <label className="block text-xs font-semibold text-gray-700 mb-2">Chất gây dị ứng (Allergens)</label>
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1 bg-gray-50 rounded-lg border">
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
    <div className="border-t pt-3">
      <label className="block text-xs font-semibold text-gray-700 mb-2">Chất phụ gia (Additives)</label>
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1 bg-gray-50 rounded-lg border">
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

function ModalFooter({ onClose, saving, uploading }) {
  return (
    <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium"
      >
        Hủy
      </button>
      <button
        form="dish-form"
        type="submit"
        disabled={saving || uploading}
        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        <span>Lưu thông tin</span>
      </button>
    </div>
  );
}
