export default function OpeningHoursSection({ formData, onChange }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Giờ mở cửa</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thứ 2 - Thứ 6 (trừ T4)</label>
          <input
            type="text"
            name="open_mon_fri"
            value={formData.open_mon_fri || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg border-gray-300"
            placeholder="VD: 11:00 - 22:00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thứ 4</label>
          <input
            type="text"
            name="open_wed"
            value={formData.open_wed || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg border-gray-300"
            placeholder="VD: Đóng cửa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thứ 7 - Chủ Nhật</label>
          <input
            type="text"
            name="open_sat_sun"
            value={formData.open_sat_sun || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg border-gray-300"
            placeholder="VD: 10:00 - 23:00"
          />
        </div>
      </div>
    </div>
  );
}
