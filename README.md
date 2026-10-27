aryasomu.com

## Projects

`projects/index.html` lists public repositories by project type. Each entry links
directly to its repository and has a short description based on its README or
source. Keep research, prototypes, and testnet work described at their actual
scope. The profile README, websites, and documentation repositories are omitted.

The category branches are decorative SVG paths drawn by `projects/projects.js`
from the rendered text positions. On small screens, CSS uses a vertical tree.
The full project list remains readable without JavaScript.

## Writing

The Writing tab points to `/writing/` on this site. Posts are plain HTML files in
`writing/`, so they can be edited locally or in GitHub without a separate service.
The Writing footer links to its RSS feed; the homepage Substack button remains
a separate external link.

To publish a post:

1. Copy `writing/post-template.txt` to `writing/your-post-slug.html`.
2. Replace the title, description, volume label, canonical URL, and article text. Keep
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
   actual publication time on this site in RFC 822 format. Visible publication
   labels use Roman-numeral volumes instead of dates. Keep the same volume on
   the Writing index and the article header. Existing volumes follow the original
   editorial date order and remain fixed; assign each new article the next unused
   volume after checking the latest index. Keep the index newest-first. RSS dates
   still record when the article became available, and research/citation dates
   retain their factual meaning. Remove the "No posts yet" paragraph when publishing the
   first post. Add a `Cite this essay` block at the end of the article with a
   unique BibTeX key, its title, author, year, and canonical URL.
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
  <span class="writing-entry__volume">Volume I</span>
  <div class="writing-entry__content">
    <h2><a href="your-post-slug.html">Your post title</a></h2>
    <p>Arya Somu</p>
  </div>
</article>
```
