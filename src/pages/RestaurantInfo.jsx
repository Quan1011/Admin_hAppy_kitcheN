import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import HeroImageSection from '../components/HeroImageSection';
import BasicInfoSection from '../components/BasicInfoSection';
import OpeningHoursSection from '../components/OpeningHoursSection';
import MultilanguageSection from '../components/MultilanguageSection';

export default function RestaurantInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('de');

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    address: '',
    phone_number: '',
    mail: '',
    whatsapp: '',
    open_mon_fri: '',
    open_wed: '',
    open_sat_sun: '',
    hero_image_url: '',
    show_announcement: false,
    announcement_de: '',
    announcement_en: '',
    slogan_de: '',
    slogan_en: '',
    reserveTitle_de: '',
    reserveTitle_en: '',
    general_notes_de: '',
    general_notes_en: '',
    payment_policy_de: '',
    payment_policy_en: '',
    price_valid_from: '',
    activeTab: 'de',
  });

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurant_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({ ...data, activeTab: 'de' });
        setActiveTab('de');
      }
    } catch (error) {
      toast.error('Lỗi tải dữ liệu nhà hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'activeTab') {
      setActiveTab(value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleHeroImageChange = (url) => {
    setFormData((prev) => ({ ...prev, hero_image_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const { activeTab: _, ...dataToSave } = formData;
      let error;

      if (formData.id) {
        const res = await supabase
          .from('restaurant_info')
          .update(dataToSave)
          .eq('id', formData.id);
        error = res.error;
      } else {
        const res = await supabase
          .from('restaurant_info')
          .insert([dataToSave])
          .select()
          .single();
        if (res.data) {
          setFormData((prev) => ({ ...prev, id: res.data.id }));
        }
        error = res.error;
      }

      if (error) throw error;
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Lưu thất bại: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Tiêu đề & Nút Lưu */}
      <HeaderSection onSave={handleSubmit} saving={saving} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <HeroImageSection
          imageUrl={formData.hero_image_url}
          onChange={handleHeroImageChange}
        />
        <BasicInfoSection formData={formData} onChange={handleChange} />
        <OpeningHoursSection formData={formData} onChange={handleChange} />
        <MultilanguageSection formData={formData} onChange={handleChange} />
      </form>
    </div>
  );
}

function HeaderSection({ onSave, saving }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình nhà hàng</h1>
        <p className="text-sm text-gray-500">Chỉnh sửa thông tin liên hệ, giờ mở cửa và ngôn ngữ</p>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        <span>Lưu thay đổi</span>
      </button>
    </div>
  );
}
