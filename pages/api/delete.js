import cloudinary from '../../public/lib/cloudinary';

export default async function handler(req, res) {
  const { ids } = req.body;
  const results = await Promise.all(ids.map(id => cloudinary.uploader.destroy(id)));
  res.json({ status: 'ok', results });
}
