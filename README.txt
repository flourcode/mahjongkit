MAHJONGCENTER.COM - HOW THIS WEBSITE WORKS
==========================================

This folder is the complete website: plain HTML, CSS and JavaScript.
Nothing to install, compile or build. Upload it and it works.

------------------------------------------------------------
1. PREVIEW ON YOUR COMPUTER
------------------------------------------------------------
Double-click index.html. Every page, the menu, search and Flower Match
work straight from the folder. (When opened from a folder, links point to
".../index.html". On the live site visitors see clean addresses such as
/rules/joker-rules/.) The only page that does not preview well from a
folder is 404.html, because it is designed to be shown at any address.

------------------------------------------------------------
2. DEPLOY (GitHub + AWS Amplify)
------------------------------------------------------------
1. Create a GitHub repository and upload EVERYTHING in this folder
   (index.html must be at the top level, not inside a subfolder).
2. In AWS Amplify choose "Host web app", connect the repository and branch.
3. Build settings: leave the build command EMPTY. Base/output directory: /
4. Deploy, then connect mahjongkit.com under "Domain management".
5. Custom 404: in Amplify open "Rewrites and redirects" and add
      Source address:  /<*>
      Target address:  /404.html
      Type:            404 (Rewrite)
6. Add the site to Google Search Console and submit
      https://mahjongkit.com/sitemap.xml

------------------------------------------------------------
3. PLACEHOLDERS TO FILL IN (search all files for these)
------------------------------------------------------------
  [CONTACT EMAIL]     contact/, privacy/, terms/, affiliate-disclosure/
  [SITE OWNER NAME]   privacy/, terms/
  [JURISDICTION]      terms/

Search for "VERIFY CURRENT INFO" (HTML comments) before each update of
  community/play-american-mahjong-online/
  community/find-local-mahjong/
  gear/best-american-mahjong-sets/
  gear/best-mahjong-mats/
These mark platform, product and price claims that change over time.

------------------------------------------------------------
4. THINGS TO ADD LATER (search for these comments)
------------------------------------------------------------
  <!-- ADSENSE SITE VERIFICATION / AUTO ADS CODE GOES HERE AFTER ACCOUNT SETUP -->
      In the <head> of every page. Paste Google's code here once you have
      it, then create /ads.txt with the exact line Google gives you.
  <!-- GOOGLE CONSENT MANAGEMENT PLATFORM (CMP) CODE GOES HERE ... -->
      Needed for visitors in the EEA/UK/Switzerland once ads are on.
      Use Google's own CMP or another Google-certified CMP.
  <!-- GOOGLE ANALYTICS CODE GOES HERE IF ENABLED -->
  <!-- REPLACE WITH FINAL SOCIAL SHARE IMAGE -->
      Currently assets/images/og-default.png (1200 x 630). Replace the
      file with your own image and keep the name.
  <!-- AFFILIATE LINK GOES HERE AFTER APPROVAL -->
      On gear pages, inside each product block. A ready-made button is in
      the comment: fill in the URL, remove the comment marks, and keep
      rel="sponsored noopener".

The <head> is identical on every page apart from titles and URLs, so use
"find and replace in files" (e.g. in VS Code) to paste code into all of
them in one step.

Ad placement: after approval, use Google Auto Ads, or place at most one
responsive unit after an early section and one later in long articles.
Never put an ad inside or next to the Flower Match board.

------------------------------------------------------------
5. FILE MAP
------------------------------------------------------------
  index.html                 Homepage
  404.html                   "Page not found"
  robots.txt, sitemap.xml    For search engines
  assets/css/styles.css      All styling (one file). Material 3 colour,
                             shape, type and motion tokens are at the top.
  assets/js/main.js          Menu drawer, table of contents, folder preview
  assets/js/search.js        Search logic (runs in the browser, no server)
  assets/js/search-index.js  The list of pages search can find
  assets/js/flower-match.js  The Flower Match game (flowers drawn in code)
  assets/images/             Favicon, logo mark, social share image, printable previews
  assets/downloads/          The free printable PDF (mahjong-table-companion.pdf)
  learn/ rules/ strategy/ gear/ community/ play/   Guides and sections
  about/ contact/ editorial-policy/ privacy/ terms/ affiliate-disclosure/
  search/                    Search page (not indexed by Google)

------------------------------------------------------------
6. ADDING A NEW ARTICLE
------------------------------------------------------------
1. Copy an existing article folder at the SAME depth (e.g. rules/dead-hand/)
   and rename it. Links such as ../../assets/css/styles.css depend on depth:
   one "../" per folder level below the site root.
2. In the new index.html update: <title>, meta description, canonical URL,
   og:title, og:description, og:url, the two JSON-LD blocks, breadcrumb,
   H1, standfirst and the body.
3. Add the URL to sitemap.xml.
4. Add an entry to assets/js/search-index.js.
5. Link to it from its section page (e.g. rules/index.html) and 1-2 guides.

------------------------------------------------------------
7. SEEING YOUR CHANGES (browser cache)
------------------------------------------------------------
Pages load styles.css and the .js files with a version tag, e.g.
  assets/css/styles.css?v=4
After editing styles.css or a .js file, change the tag in every .html
file (find "?v=4", replace with "?v=7") so visitors get the new version.

------------------------------------------------------------
8. DESIGN SYSTEM (Material Design 3, Expressive)
------------------------------------------------------------
Colours are Material "colour roles" defined once at the top of styles.css
(--md-sys-color-primary, -secondary-container, -surface-container, ...).
The canvas is pure white. Bubblegum pink (#C13B7A, pale #FFD9E8) is the
primary role: buttons, selected navigation, links, quick answers. Powder
blue (#4C6D91, pale #D8ECFF) is the secondary role: tonal buttons, tips,
gear/community labels, the game board tint. Soft lilac (#EEE5FF) is an
occasional tertiary accent (Flower Match cards). Every text/background
pairing meets WCAG AA. A dark version switches on automatically with the
visitor's system setting; to force light only, add data-theme="light" to
the <html> tag of every page. Always use the variables in new CSS.

Roughly 70% white, 15% pale pink, 10% pale blue, 5% saturated accents.
No green, ivory, gold or heritage styling: this is a contemporary
lifestyle site, not a club website.

Navigation follows Material window sizes:
  Phones/tablets (under 840px): white bottom navigation bar
    (Home, Learn, Rules, Play, Menu); the selected tab sits in a pale
    pink capsule. Menu opens the navigation drawer.
  Desktops (840px and up): horizontal navigation in the top app bar,
    with a pale blue search field.

Components: top app bar, navigation bar, modal navigation drawer,
filled / tonal / outlined / text buttons, chips, outlined white cards
plus pink / blue / lilac container cards (no heavy shadows), lists,
search bar, expandable table of contents, FAQ accordions. Icons are
Material Symbols drawn inline as SVG.

The Mahjong tile motif (white tile with a chunky bubblegum-pink bottom
and one simple symbol) is original artwork drawn with CSS and SVG.

Fonts: the system font stack. No request is made to Google Fonts.
Body text is 17-18px for comfortable reading on phones; buttons and
tap targets are at least 48px tall.
