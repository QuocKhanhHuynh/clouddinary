import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/list').then(res => setImages(res.data.images));
  }, []);

  const handleUpload = async (e) => {
    const form = new FormData();
    for (let file of e.target.files) form.append('files', file);
    const res = await axios.post('/api/upload', form);
    setImages([...res.data.images, ...images]);
  };

  const handleDelete = async () => {
    await axios.post('/api/delete', { ids: selected });
    setImages(images.filter(img => !selected.includes(img.id)));
    setSelected([]);
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = search ? images.filter(i => i.id.includes(search)) : images;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quản lý ảnh với Cloudinary</h1>

      <div className="mb-4">
  <label
    htmlFor="file-upload"
    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded cursor-pointer transition"
  >
    📤 Chọn ảnh để upload
  </label>
  <input
    id="file-upload"
    type="file"
    multiple
    onChange={handleUpload}
    className="hidden"
  />
</div>


      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo ID ảnh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1"
        />
        {selected.length > 0 && (
          <button onClick={handleDelete} className="ml-4 bg-red-500 text-white px-4 py-1 rounded">
            Xoá ({selected.length}) ảnh
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {filtered.map(img => (
          <div key={img.id} className="relative">
            <img src={img.url} alt="img" className="w-full h-40 object-cover rounded" />
            <input
              type="checkbox"
              checked={selected.includes(img.id)}
              onChange={() => toggleSelect(img.id)}
              className="absolute top-2 left-2 scale-150"
            />
            <div className="text-xs mt-1 break-words">{img.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
