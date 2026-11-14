aryasomu.com

The homepage links to each section and carries the social profiles. Interior
pages use one `← Home` link above the content, without a site navigation bar
or footer. A table of contents can help readers move within a long page.

## Projects

`projects/index.html` lists public repositories and deployed projects by project
type. Each entry links directly to its repository, or to its deployed site when
it has no repository, and has a short description based on its README, source,
or interface. Keep research, prototypes, and testnet work described at their
actual scope. Profile READMEs, organization websites, and documentation
repositories are omitted.

The catalog puts project names and descriptions side by side on desktop and
stacks them on phones. Keep the category jump links in the same order as the
sections, and distinguish links to code, model weights, sites, apps, and demos.
The catalog and its jump links work without JavaScript.

## Writing

The homepage's Writings heading points to `/writing/`. Posts are plain HTML files in
`writing/`, so they can be edited locally or in GitHub without a separate service.
The Writing index links to its RSS feed.

To publish a post:

1. Copy `writing/post-template.txt` to `writing/your-post-slug.html`.
2. Replace the title, one-line summary, metadata description, volume label,
   canonical URL, and article text. Keep the shared `writing/article.css`
   stylesheet and put the title block inside the reading column. Give each
   section a stable ID and add it to both tables of contents.
   `writing/writing.js` marks the current section in the desktop guide. Put
   a `.writing-citation__mark` beside the sentence it supports and link it to
   a `.writing-citation__note` in the numbered Notes list. On wide screens the
   script moves the note beside its marker. Give the marker its own ID so the
   endnote can link back. Use `.writing-figure` for figures, with a numbered
   `.writing-figure__head` and a caption where needed.
   Keep `writing-page writing-article-page` on `<body>`, and optionally add
   `article-color-blue` or `article-color-rust` to choose an accent. The default
   is teal.
3. Add matching entries to the homepage's `.home-writings` list and
   `.writing-list` in `writing/index.html`, an item to `writing/feed.xml`, and
   the canonical URL to `sitemap.xml`. Keep each RSS
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
</style>
```

Choose an accent with enough contrast against the light article background.
The shared CSS continues to control typography and layout.

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
