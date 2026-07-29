import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Plus, Search, FolderTree, Layers, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CategoryTable from '../components/CategoryTable';
import DishGroupTable from '../components/DishGroupTable';
import CategoryModal from '../components/CategoryModal';
import DishGroupModal from '../components/DishGroupModal';

export default function CategoriesManagement() {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [dishGroups, setDishGroups] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [additives, setAdditives] = useState([]);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, groupRes, allergenRes, additiveRes] = await Promise.all([
        supabase.from('categories').select('*').order('id'),
        supabase.from('dish_groups').select('*').order('id'),
        supabase.from('allergens').select('*'),
        supabase.from('additives').select('*'),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (groupRes.data) setDishGroups(groupRes.data);
      if (allergenRes.data) setAllergens(allergenRes.data);
      if (additiveRes.data) setAdditives(additiveRes.data);
    } catch (error) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (data = null) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleDelete = async (id) => {
    const targetName = activeTab === 'categories' ? 'Danh mục' : 'Nhóm món';
    if (!window.confirm(`Bạn có chắc muốn xóa ${targetName} này?`)) return;

    try {
      if (activeTab === 'groups') {
        await supabase.from('dish_group_allergen').delete().eq('dish_group_id', id);
        await supabase.from('dish_group_additive').delete().eq('dish_group_id', id);
      }

      const table = activeTab === 'categories' ? 'categories' : 'dish_groups';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      toast.success(`Đã xóa ${targetName} thành công!`);
      fetchData();
    } catch (error) {
      toast.error(`Không thể xóa ${targetName} này (Có thể đang chứa dữ liệu liên kết): ` + error.message);
    }
  };

  const handleSaveCategory = async (formData) => {
    try {
      setSaving(true);
      if (editingData) {
        const { error } = await supabase.from('categories').update(formData).eq('id', editingData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert([formData]);
        if (error) throw error;
      }

      handleCloseModal();
      toast.success(editingData ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      fetchData();
    } catch (error) {
      toast.error('Lưu thất bại: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDishGroup = async (formData, selectedAllergens, selectedAdditives) => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        base_price: formData.base_price ? parseFloat(formData.base_price) : 0,
      };

      let currentGroupId = editingData?.id;

      if (editingData) {
        const { error } = await supabase.from('dish_groups').update(payload).eq('id', editingData.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('dish_groups').insert([payload]).select().single();
        if (error) throw error;
        if (data) currentGroupId = data.id;
      }

      if (currentGroupId) {
        await supabase.from('dish_group_allergen').delete().eq('dish_group_id', currentGroupId);
        await supabase.from('dish_group_additive').delete().eq('dish_group_id', currentGroupId);

        if (selectedAllergens.length > 0) {
          const aData = selectedAllergens.map((code) => ({
            dish_group_id: currentGroupId,
            allergen_code: code,
          }));
          await supabase.from('dish_group_allergen').insert(aData);
        }
        if (selectedAdditives.length > 0) {
          const addData = selectedAdditives.map((code) => ({
            dish_group_id: currentGroupId,
            additive_code: code,
          }));
          await supabase.from('dish_group_additive').insert(addData);
        }
      }

      handleCloseModal();
      toast.success(editingData ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      fetchData();
    } catch (error) {
      toast.error('Lưu thất bại: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      (c.name_de || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.name_en || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = dishGroups.filter(
    (g) =>
      (g.name_de || '').toLowerCase().includes(search.toLowerCase()) ||
      (g.name_en || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cấu trúc Thực đơn</h1>
          <p className="text-sm text-gray-500">Quản lý Danh mục lớn và các Nhóm món chi tiết</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'categories' ? 'Thêm danh mục' : 'Thêm nhóm món'}</span>
        </button>
      </div>

      {/* TABS CHUYỂN ĐỔI & TÌM KIẾM */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex bg-gray-200/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Danh mục lớn ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'groups'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Nhóm món ({dishGroups.length})</span>
          </button>
        </div>

        <SearchBar search={search} onSearchChange={setSearch} />
      </div>

      {/* TABLES */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : activeTab === 'categories' ? (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      ) : (
        <DishGroupTable
          groups={filteredGroups}
          categories={categories}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {/* MODALS */}
      {activeTab === 'categories' ? (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingData={editingData}
          onSave={handleSaveCategory}
          saving={saving}
        />
      ) : (
        <DishGroupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingData={editingData}
          categories={categories}
          allergens={allergens}
          additives={additives}
          onSave={handleSaveDishGroup}
          saving={saving}
        />
      )}
    </div>
  );
}

function SearchBar({ search, onSearchChange }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
