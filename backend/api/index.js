import handler from '../vercel-adapter.js';

export default function (req, res) {
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};