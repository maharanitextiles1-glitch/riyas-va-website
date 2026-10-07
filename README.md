# Riyas V. A. Website — Flask + MongoDB CMS

This version keeps the existing public design and adds a MongoDB-backed admin CMS.

## CMS
- `/admin` password-protected dashboard
- Update hero, About, Family and brand images/logos
- Add/edit/delete/reorder Awards & Achievements
- Add/edit/delete/reorder YouTube, Facebook, Instagram and other media stories
- MongoDB Atlas for content
- MongoDB GridFS for uploaded images

## SEO & performance
- Server-rendered HTML
- Canonical URL
- Meta description
- Open Graph and Twitter cards
- Person JSON-LD
- `/sitemap.xml`
- `/robots.txt`
- Lazy-loaded media
- Deferred JavaScript
- Long browser cache for static assets
- Cache headers for uploaded images
- Flask-Compress

## Local setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Edit `.env` first and provide:
- `MONGO_URI`
- `SECRET_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SITE_URL`

Open:
- Website: `http://127.0.0.1:5000`
- CMS: `http://127.0.0.1:5000/admin`

The first local `python app.py` run seeds the default award/media records when MongoDB is empty.

## MongoDB Atlas

Use a connection string with database name `riyasva`.

Collections:
- `awards`
- `media`
- `site_photos`
- GridFS: `fs.files`, `fs.chunks`

## Deployment

Because this now has a Python backend, deploy it to Render, Railway, Fly.io or a VPS. Netlify alone is not the right host for this Flask app.

### Render
1. Push this entire project to GitHub.
2. Render → New → Web Service → select the repository.
3. Build: `pip install -r requirements.txt`
4. Start: `gunicorn app:app --workers 2 --threads 4 --timeout 120`
5. Add environment variables from `.env.example`.
6. Deploy.
7. Visit `/admin`.
8. Connect `riyasva.com`.

Important: never commit `.env`.
