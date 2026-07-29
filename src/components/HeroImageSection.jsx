import { useState } from 'react';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../config/cloudinary';
import toast from 'react-hot-toast';

export default function HeroImageSection({ imageUrl, onChange }) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (error) {
      toast.error('Tải ảnh thất bại: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Ảnh bìa (Hero Image)</h2>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="w-full sm:w-64 h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
          {imageUrl ? (
            <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-1">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">Chưa có ảnh</span>
            </div>
          )}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          <span>{uploadingImage ? 'Đang tải lên...' : 'Tải ảnh mới'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={uploadingImage}
          />
        </label>
      </div>
    </div>
  );
}
