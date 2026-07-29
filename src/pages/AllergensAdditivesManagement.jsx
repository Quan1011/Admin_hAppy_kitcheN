import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Plus, Search, Loader2, ShieldAlert, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';
import AllergenTable from '../components/AllergenTable';
import AllergenModal from '../components/AllergenModal';

export default function AllergensAdditivesManagement() {
  const [activeTab, setActiveTab] = useState('allergens');
  const [loading, setLoading] = useState(true);

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
      const [allergenRes, additiveRes] = await Promise.all([
        supabase.from('allergens').select('*').order('code'),
        supabase.from('additives').select('*').order('code'),
      ]);

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

  const handleDelete = async (item) => {
    const isAllergen = activeTab === 'allergens';
    const targetName = isAllergen ? 'Chất gây dị ứng' : 'Phụ gia';

    if (!window.confirm(`Bạn có chắc muốn xóa ${targetName} [${item.code}] này?`)) return;

    try {
      const table = isAllergen ? 'allergens' : 'additives';
      const { error } = await supabase.from(table).delete().eq('code', item.code);
      if (error) throw error;

      toast.success(`Đã xóa ${targetName} [${item.code}] thành công!`);
      fetchData();
    } catch (error) {
      toast.error(`Không thể xóa ${targetName} này (có thể đang được liên kết với món ăn): ` + error.message);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const isAllergen = activeTab === 'allergens';
      const table = isAllergen ? 'allergens' : 'additives';

      if (editingData) {
        const { error } = await supabase
          .from(table)
          .update({
            name_de: formData.name_de,
            name_en: formData.name_en,
          })
          .eq('code', editingData.code);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([formData]);
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

  const currentList = activeTab === 'allergens' ? allergens : additives;
  const filteredList = currentList.filter(
    (item) =>
      (item.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.name_de || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.name_en || '').toLowerCase().includes(search.toLowerCase())
  );

  const isAllergenTab = activeTab === 'allergens';

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Dị ứng & Phụ gia</h1>
          <p className="text-sm text-gray-500">Khai báo mã dị ứng (A, B, C...) và phụ gia (1, 2, 3...) theo quy định</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{isAllergenTab ? 'Thêm Dị ứng mới' : 'Thêm Phụ gia mới'}</span>
        </button>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex bg-gray-200/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('allergens')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isAllergenTab ? 'bg-white shadow text-amber-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Chất gây dị ứng ({allergens.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('additives')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !isAllergenTab ? 'bg-white shadow text-purple-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Chất phụ gia ({additives.length})</span>
          </button>
        </div>

        <SearchBar search={search} onSearchChange={setSearch} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <AllergenTable
          items={filteredList}
          activeTab={activeTab}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {/* MODAL */}
      <AllergenModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingData={editingData}
        activeTab={activeTab}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}

function SearchBar({ search, onSearchChange }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm theo mã hoặc tên..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
