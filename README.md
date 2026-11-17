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
The Writing index links to its RSS feed. It and the article pages share
`writing/reading-layout.css`, which loads Inter and sets the reading width.

To publish a post:

1. Copy `writing/post-template.txt` to `writing/your-post-slug.html`.
2. Replace the title, one-line summary, metadata description, volume label,
   canonical URL, and article text. Keep the shared `writing/article.css`
   stylesheet and put the title block inside the reading column. Keep the
   Home link and desktop table of contents together in `.writing-rail`. Give each
   section a stable ID and add it to both tables of contents.
   `writing/writing.js` marks the current section in the desktop guide and adds
   a back-to-top button that appears near the end of each article. Put
   a `.writing-citation__mark` beside the sentence it supports and link it to
   a `.writing-citation__note` in the numbered Notes list. On wide screens the
   script moves the note beside its marker. Give the marker its own ID so the
   endnote can link back. `writing.js` numbers each `<h2>` (01, 02) and `<h3>`
   (1.1, 1.2) in the body and in both tables of contents; add `data-unnumbered`
   to a heading to skip it. Keep `<strong>` for a few key phrases; the shared
   CSS renders it at medium weight in the darker text color.
   Draw charts as inline SVG with the shared `.wa-art` classes in
   `writing/article.css`: one `.wa-wide` (600 wide) and one `.wa-narrow`
   (340 wide) variant, direct labels instead of legends, an `aria-label` that
   states the plotted values, and `data-wa-animate` for a one-time draw-in that
   is skipped with reduced motion.
   Use `.writing-figure` for figures, with a numbered
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
   the Writing index and the article header. Volumes number the published essays
   consecutively in publication order, starting at Volume I: give each new
   article the next number after the highest volume in the latest index, and
   when an article is removed, renumber the remaining ones so there are no gaps.
   Keep the index newest-first. RSS dates
   still record when the article became available, and research/citation dates
   retain their factual meaning. Remove the "No posts yet" paragraph when publishing the
   first post. Add a `Cite this essay` block at the end of the article with a
   unique BibTeX key, its title, author, year, and canonical URL.
4. Preview the site locally, then commit and push when ready. The post will appear
   at `https://aryasomu.com/writing/your-post-slug` after GitHub Pages updates.
   Link to articles without the `.html` extension everywhere: in site links,
   canonical and Open Graph URLs, RSS links and GUIDs, the sitemap, and BibTeX.
   GitHub Pages serves `writing/your-post-slug.html` at that clean URL. Do not
   give an asset folder the same name as an article; use `your-post-slug-assets/`.
   A plain `python3 -m http.server` preview will not resolve extensionless links.

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
<li><a href="your-post-slug">Your post title</a><span>Volume I</span></li>
```
