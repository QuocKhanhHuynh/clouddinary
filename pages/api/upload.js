import cloudinary from '../../public/lib/cloudinary';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: true });

  const files = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve(files.files);
    });
  });

  const uploaded = [];

  const fileArray = Array.isArray(files) ? files : [files];

  for (let file of fileArray) {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'pod',
    });
    uploaded.push({ id: result.public_id, url: result.secure_url });
  }

  res.status(200).json({ images: uploaded });
}
