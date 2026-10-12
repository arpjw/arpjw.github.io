aryasomu.com

## Writing

The Writing tab points to `/writing/` on this site. Posts are plain HTML files in
`writing/`, so they can be edited locally or in GitHub without a separate service.
The Writing footer links to its RSS feed; the homepage Substack button remains
a separate external link.

To publish a post:

1. Copy `writing/post-template.txt` to `writing/your-post-slug.html`.
2. Replace the title, description, date, canonical URL, and article text. Keep
   the shared `writing-post` classes for the title, reading column, section
   navigation, and mobile layout. Give each section a stable ID and add it to
   both tables of contents. `writing/writing.js` marks the current section in
   the desktop guide. Put source references beside the sentence they support
   with a `.writing-citation` marker and `.writing-citation__note`. The note
   appears in the right margin on wide screens and inline on smaller screens.
   Give each note a unique ID, and link the marker to it.
   Keep `writing-page writing-article-page` on `<body>`, and optionally add
   `article-color-blue` or `article-color-rust` to choose an accent. The default
   is teal.
3. Add a matching entry to `.writing-list` in `writing/index.html`, an item
   to `writing/feed.xml`, and the canonical URL to `sitemap.xml`. Keep each RSS
   `<guid>` equal to the article's canonical URL, and set `<pubDate>` to its
   actual publication time on this site in RFC 822 format. The Writing index may
   use an editorial date; the feed date should tell subscribers when the article
   became available. Remove the "No posts yet" paragraph when publishing the
   first post.
4. Preview the site locally, then commit and push when ready. The post will appear
   at `https://aryasomu.com/writing/your-post-slug.html` after GitHub Pages updates.

The template stays a `.txt` file so it is not published as a post.
`writing/_article-preview.html` shows the reading layout with sample copy and
lets you compare the three accent colors locally. GitHub Pages excludes the
underscore file from the published site, and it must not be added to the
Writing index.
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
  <time datetime="2026-10-03">Oct 3, 2026</time>
  <div class="writing-entry__content">
    <h2><a href="your-post-slug.html">Your post title</a></h2>
    <p>Arya Somu</p>
  </div>
</article>
```
