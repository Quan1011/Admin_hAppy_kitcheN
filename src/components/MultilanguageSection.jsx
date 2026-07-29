export default function MultilanguageSection({ formData, onChange }) {
  const isDe = formData.activeTab === 'de';

  const handleTabChange = (tab) => {
    onChange({ target: { name: 'activeTab', value: tab } });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Nội dung hiển thị (Đa ngôn ngữ)</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg text-sm">
          <button
            type="button"
            onClick={() => handleTabChange('de')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              isDe ? 'bg-white shadow text-blue-600' : 'text-gray-600'
            }`}
          >
            Tiếng Đức
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('en')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              !isDe ? 'bg-white shadow text-blue-600' : 'text-gray-600'
            }`}
          >
            Tiếng Anh
          </button>
        </div>
      </div>

      {/* Công tắc Bật/Tắt Thông báo */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="show_announcement"
          name="show_announcement"
          checked={formData.show_announcement || false}
          onChange={onChange}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="show_announcement" className="text-sm font-medium text-gray-700 cursor-pointer">
          Hiển thị thông báo đặc biệt trên Website (Announcement)
        </label>
      </div>

      {/* Tab Tiếng Đức */}
      {isDe && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan (DE)</label>
            <input
              type="text"
              name="slogan_de"
              value={formData.slogan_de || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung thông báo (DE)</label>
            <textarea
              name="announcement_de"
              rows={2}
              value={formData.announcement_de || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề đặt bàn (Reserve Title DE)</label>
            <input
              type="text"
              name="reserveTitle_de"
              value={formData.reserveTitle_de || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú chung (General Notes DE)</label>
            <textarea
              name="general_notes_de"
              rows={3}
              value={formData.general_notes_de || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách thanh toán (Payment Policy DE)</label>
            <textarea
              name="payment_policy_de"
              rows={2}
              value={formData.payment_policy_de || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
        </div>
      )}

      {/* Tab Tiếng Anh */}
      {!isDe && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan (EN)</label>
            <input
              type="text"
              name="slogan_en"
              value={formData.slogan_en || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung thông báo (EN)</label>
            <textarea
              name="announcement_en"
              rows={2}
              value={formData.announcement_en || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề đặt bàn (Reserve Title EN)</label>
            <input
              type="text"
              name="reserveTitle_en"
              value={formData.reserveTitle_en || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú chung (General Notes EN)</label>
            <textarea
              name="general_notes_en"
              rows={3}
              value={formData.general_notes_en || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách thanh toán (Payment Policy EN)</label>
            <textarea
              name="payment_policy_en"
              rows={2}
              value={formData.payment_policy_en || ''}
              onChange={onChange}
              className="w-full p-2.5 border rounded-lg border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
