# Blog Content

This folder stores the public blog catalog data for the static Cloudflare copy.

## Add a New Blog Post

1. Create a new folder at `site-copy/blog/your-post-slug/`.
2. Copy the structure from an existing post page into `site-copy/blog/your-post-slug/index.html`.
3. Add the post metadata to `site-copy/blog/content/posts.json`.
4. Put local blog images in `site-copy/blog/images/` and reference them as `/blog/images/file-name.webp`.
5. Add the final URL to `site-copy/sitemap.xml`.

The public URL pattern is:

`/blog/[post-name]/`
