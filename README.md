aryasomu.com

## Writing

The Writing tab points to `/writing/` on this site. Posts are plain HTML files in
`writing/`, so they can be edited locally or in GitHub without a separate service.

To publish a post:

1. Copy `writing/post-template.txt` to `writing/your-post-slug.html`.
2. Replace the title, description, date, canonical URL, and article text. Keep
   the shared `writing-post` classes to retain the same fonts, width, and spacing.
   Set the `<body>` class to `writing-page`, `writing-page article-color-blue`, or
   `writing-page article-color-rust` to choose an accent. The default is teal.
3. Add a matching entry at the top of `.writing-list` in `writing/index.html`, then
   remove the "No posts yet" paragraph when publishing the first post.
4. Preview the site locally, then commit and push when ready. The post will appear
   at `https://aryasomu.com/writing/your-post-slug.html` after GitHub Pages updates.

The template stays a `.txt` file so it is not published as a post.
`writing/_article-preview.html` shows the layout with sample copy and lets you
compare the three accent colors locally. GitHub Pages excludes the underscore
file from the published site, and it must not be added to the Writing index.
For another color, keep `<body class="writing-page">` and add this after the shared
stylesheet in that post's `<head>`:

```html
<style>
  .writing-page { --article-accent: #286f78; }
  html.dark .writing-page { --article-accent: #8acbd2; }
</style>
```

Change the two hex values to readable light and dark accents. The shared CSS
continues to control typography and layout.

Example index entry:

```html
<article class="writing-entry">
  <time datetime="2026-10-03">October 3, 2026</time>
  <h2><a href="your-post-slug.html">Your post title</a></h2>
  <p>A short description of the post.</p>
</article>
```
