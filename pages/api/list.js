import cloudinary from '../../public/lib/cloudinary';

export default async function handler(req, res) {
  const { resources } = await cloudinary.search
    .expression('folder:pod')
    .sort_by('created_at', 'desc')
    //.max_results(100)
    .execute();

  res.json({
    images: resources.map(i => ({
      url: i.secure_url,
      id: i.public_id,
    })),
  });
}
