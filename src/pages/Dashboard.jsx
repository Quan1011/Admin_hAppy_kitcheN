import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { UtensilsCrossed, FolderTree, Eye, EyeOff, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMenuItems: 0,
    visibleItems: 0,
    hiddenItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch categories count
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Fetch menu items count
      const { count: menuCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true });

      // Fetch visible items
      const { count: visibleCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_visible', true);

      // Fetch hidden items
      const { count: hiddenCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_visible', false);

      setStats({
        totalCategories: categoriesCount || 0,
        totalMenuItems: menuCount || 0,
        visibleItems: visibleCount || 0,
        hiddenItems: hiddenCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Xem thông số và quản lý nhà hàng của bạn</p>
      </div>

      {/* Vercel Analytics Notice */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Vercel Analytics
              <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
                Đã kích hoạt
              </span>
            </h3>
            <p className="text-gray-300 mt-1 mb-3">
              Dữ liệu traffic đang được theo dõi. Xem chi tiết analytics trên Vercel Dashboard.
            </p>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Mở Vercel Dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FolderTree className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Danh mục</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalCategories}</p>
        </div>

        {/* Total Menu Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <UtensilsCrossed className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Tổng món ăn</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalMenuItems}</p>
        </div>

        {/* Visible Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Đang hiển thị</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.visibleItems}</p>
        </div>

        {/* Hidden Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <EyeOff className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Đã ẩn</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.hiddenItems}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/menu"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Quản lý Menu</p>
              <p className="text-sm text-gray-500">Thêm, sửa, xóa món ăn</p>
            </div>
          </a>
          <a
            href="/categories"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <FolderTree className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Cấu trúc Danh mục</p>
              <p className="text-sm text-gray-500">Tổ chức nhóm món ăn</p>
            </div>
          </a>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-amber-800">
            <strong>Lưu ý:</strong> Dữ liệu analytics chi tiết (pageviews, visitors, top pages...) được theo dõi bởi Vercel Analytics. 
            Truy cập <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">Vercel Dashboard</a> để xem báo cáo đầy đủ.
          </p>
        </div>
      </div>
    </div>
  );
}
