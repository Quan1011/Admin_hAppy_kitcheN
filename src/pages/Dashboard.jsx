import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { UtensilsCrossed, FolderTree, Eye, EyeOff, ExternalLink, TrendingUp, AlertCircle, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getCountryFlag = (countryCode) => {
  if (!countryCode || countryCode === 'Unknown') return '🌐';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🌐';
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMenuItems: 0,
    visibleItems: 0,
    hiddenItems: 0,
  });
  const [analyticsTimeSeries, setAnalyticsTimeSeries] = useState([]);
  const [analyticsCountries, setAnalyticsCountries] = useState([]);
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

      // Fetch Vercel Analytics from Supabase Edge Function
      let fetchedTimeSeries = [];
      let fetchedCountries = [];
      try {
        const { data, error } = await supabase.functions.invoke('hyper-service');
        if (error) {
          console.error('Lỗi lấy dữ liệu Analytics:', error);
        } else {
          if (data?.error) {
            console.error('Chi tiết lỗi từ Edge Function:', data.error);
          } else {
            console.log('🔥 DỮ LIỆU TỪ EDGE FUNCTION TRẢ VỀ:', data);
            fetchedTimeSeries = data?.timeSeries || [];
            fetchedCountries = data?.countries || [];
          }
        }
      } catch (err) {
        console.error('Lỗi invoke edge function:', err);
      }

      setStats({
        totalCategories: categoriesCount || 0,
        totalMenuItems: menuCount || 0,
        visibleItems: visibleCount || 0,
        hiddenItems: hiddenCount || 0,
      });
      setAnalyticsTimeSeries(fetchedTimeSeries);
      setAnalyticsCountries(fetchedCountries);
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

      {/* Vercel Analytics Chart Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Lưu lượng truy cập
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Thống kê lượng khách truy cập website
            </p>
          </div>
          {/* <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Vercel Dashboard
            <ExternalLink className="w-4 h-4" />
          </a> */}
        </div>
        
        {analyticsTimeSeries && analyticsTimeSeries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsTimeSeries}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dx={-10}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    name="Pageviews (Lượt xem)"
                    dataKey="pageviews" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPageviews)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Area 
                    type="monotone" 
                    name="Visitors (Khách)"
                    dataKey="visitors" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVisitors)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Top Quốc Gia
              </h3>
              <div className="space-y-4">
                {analyticsCountries && analyticsCountries.length > 0 ? (
                  [...analyticsCountries].sort((a, b) => b.visitors - a.visitors).slice(0, 5).map((countryData, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="">{getCountryFlag(countryData.country)}</span>
                        <span className="text-sm font-medium text-gray-700">{countryData.country}</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{countryData.visitors.toLocaleString()} <span className="text-xs font-normal text-gray-500">khách</span></span>
                        {countryData.pageviews > 0 && (
                          <span className="text-xs font-medium text-gray-400">{countryData.pageviews.toLocaleString()} views</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <TrendingUp className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Chưa có dữ liệu Analytics</p>
            <p className="text-sm text-gray-400 mt-1">Đang chờ hệ thống thu thập hoặc kiểm tra lại kết nối Edge Function.</p>
          </div>
        )}
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
    </div>
  );
}
