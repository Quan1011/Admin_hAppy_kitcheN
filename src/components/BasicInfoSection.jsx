export default function BasicInfoSection({ formData, onChange }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Thông tin chung & Liên hệ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà hàng</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="mail"
            value={formData.mail || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá áp dụng từ ngày (Price Valid From)</label>
          <input
            type="text"
            name="price_valid_from"
            value={formData.price_valid_from || ''}
            onChange={onChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="VD: 01/01/2026"
          />
        </div>
      </div>
    </div>
  );
}
