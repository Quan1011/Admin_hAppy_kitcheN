import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuTable from '../components/MenuTable';
import MenuModal from '../components/MenuModal';

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dishGroups, setDishGroups] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [additives, setAdditives] = useState([]);
  const [itemAllergens, setItemAllergens] = useState({}); // { itemNumber: ['A', 'B'] }
  const [itemAdditives, setItemAdditives] = useState({}); // { itemNumber: ['1', '2'] }

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [catRes, groupRes, allergenRes, additiveRes, itemsRes, itemAllergenRes, itemAdditiveRes] =
        await Promise.all([
          supabase.from('categories').select('*').order('id'),
          supabase.from('dish_groups').select('*').order('id'),
          supabase.from('allergens').select('*'),
          supabase.from('additives').select('*'),
          supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
          supabase.from('menu_item_allergen').select('item_number, allergen_code'),
          supabase.from('menu_item_additive').select('item_number, additive_code'),
        ]);

      if (catRes.data) setCategories(catRes.data);
      if (groupRes.data) setDishGroups(groupRes.data);
      if (allergenRes.data) setAllergens(allergenRes.data);
      if (additiveRes.data) setAdditives(additiveRes.data);
      if (itemsRes.data) setItems(itemsRes.data);

      // Build allergen map: { itemNumber: [code1, code2] }
      const allergenMap = {};
      if (itemAllergenRes.data) {
        itemAllergenRes.data.forEach((row) => {
          if (!allergenMap[row.item_number]) allergenMap[row.item_number] = [];
          allergenMap[row.item_number].push(row.allergen_code);
        });
      }
      setItemAllergens(allergenMap);

      // Build additive map: { itemNumber: [code1, code2] }
      const additiveMap = {};
      if (itemAdditiveRes.data) {
        itemAdditiveRes.data.forEach((row) => {
          if (!additiveMap[row.item_number]) additiveMap[row.item_number] = [];
          additiveMap[row.item_number].push(row.additive_code);
        });
      }
      setItemAdditives(additiveMap);
    } catch (error) {
      toast.error('Lỗi tải dữ liệu thực đơn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.status;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));

    const { error } = await supabase
      .from('menu_items')
      .update({ status: newStatus })
      .eq('id', item.id);

    if (error) {
      toast.error('Không thể đổi trạng thái: ' + error.message);
      loadAllData();
    }
  };

  const handleDelete = async (id, itemNumber) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món này?')) return;

    try {
      if (itemNumber) {
        await supabase.from('menu_item_allergen').delete().eq('item_number', itemNumber);
        await supabase.from('menu_item_additive').delete().eq('item_number', itemNumber);
      }
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;

      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Đã xóa món ăn thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleOpenModal = async (item = null) => {
    if (item) {
      setEditingItem(item);
      if (item.item_number) {
        const [aRes, addRes] = await Promise.all([
          supabase.from('menu_item_allergen').select('allergen_code').eq('item_number', item.item_number),
          supabase.from('menu_item_additive').select('additive_code').eq('item_number', item.item_number),
        ]);
      }
    } else {
      setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (formData, selectedAllergens, selectedAdditives) => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        dish_group_id: formData.dish_group_id ? parseInt(formData.dish_group_id) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
      };

      let currentItemNumber = payload.item_number;

      if (editingItem) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('menu_items').insert([payload]).select().single();
        if (error) throw error;
        if (data) currentItemNumber = data.item_number;
      }

      if (currentItemNumber) {
        await supabase.from('menu_item_allergen').delete().eq('item_number', currentItemNumber);
        await supabase.from('menu_item_additive').delete().eq('item_number', currentItemNumber);

        if (selectedAllergens.length > 0) {
          const aData = selectedAllergens.map((code) => ({ item_number: currentItemNumber, allergen_code: code }));
          await supabase.from('menu_item_allergen').insert(aData);
        }
        if (selectedAdditives.length > 0) {
          const addData = selectedAdditives.map((code) => ({ item_number: currentItemNumber, additive_code: code }));
          await supabase.from('menu_item_additive').insert(addData);
        }
      }

      handleCloseModal();
      toast.success(editingItem ? 'Cập nhật món ăn thành công!' : 'Thêm món ăn mới thành công!');
      loadAllData();
    } catch (error) {
      toast.error('Lưu thất bại: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Sắp xếp items theo item_number
  const sortedItems = [...items].sort((a, b) => {
    const codeA = (a.item_number || '').toString().toLowerCase();
    const codeB = (b.item_number || '').toString().toLowerCase();
    return codeA.localeCompare(codeB, undefined, { numeric: true });
  });

  const filteredItems = sortedItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category_id === parseInt(selectedCategory);
    const matchesSearch =
      (item.name_de || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.name_en || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.item_number || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Món ăn</h1>
          <p className="text-sm text-gray-500">Tổng số món: {filteredItems.length}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm món mới</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* DANH SÁCH MÓN ĂN (TABLE) */}
      <MenuTable
        items={filteredItems}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        itemAllergens={itemAllergens}
        itemAdditives={itemAdditives}
        loading={loading}
      />

      {/* MODAL THÊM / SỬA MÓN */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
        categories={categories}
        dishGroups={dishGroups}
        allergens={allergens}
        additives={additives}
        onSave={handleSave}
        saving={saving}
        uploadingImage={uploadingImage}
        setUploadingImage={setUploadingImage}
      />
    </div>
  );
}

function FilterBar({ search, onSearchChange, categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo mã món (VD: A1) hoặc tên món..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="ALL">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_de} / {c.name_en}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
