MAHJONGKIT.COM - HOW THIS WEBSITE WORKS
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
SITE STRUCTURE (rebuilt 22 Sept 2026)
------------------------------------------------------------
  learn/      Beginner path: how to play, tiles, what you need,
              beginner strategy, Charleston, defense, find a game
  practice/   Practice hub, Solo Practice Hand, Tile Trainer
              (?mode=dragons, ?mode=numbers), Flower Match, play online
  printables/ Free printables (was learn/mahjong-cheat-sheet/)
  teach/      Teaching hub, lessons guide, teach a beginner, game night
  rules/      Reference guides

Old URLs (community/, gear/, strategy/, play/, learn/mahjong-cheat-sheet/)
contain small redirect pages. For proper 301 redirects, paste
amplify-redirects.json (in the bundle, next to the site folder) into Amplify > Hosting > Rewrites and redirects >
Manage redirects > Open text editor, replacing the existing rules
(it already includes the www and 404 rules, in the right order).

------------------------------------------------------------
3. PLACEHOLDERS TO FILL IN (search all files for these)
------------------------------------------------------------
  Mark   privacy/, terms/
  United States      terms/

Contact email: hello@mahjongkit.com (contact/, privacy/, terms/,
affiliate-disclosure/). Set up that mailbox before launch.

Pages avoid prices and dated claims on purpose, so nothing goes stale.
If you add prices later, re-check them whenever you update the page.

------------------------------------------------------------
4. THINGS TO ADD LATER (search for these comments)
------------------------------------------------------------
  <!-- ADSENSE SITE VERIFICATION / AUTO ADS CODE GOES HERE AFTER ACCOUNT SETUP -->
      In the <head> of every page. Paste Google's code here once you have
      it, then create /ads.txt with the exact line Google gives you.
  <!-- GOOGLE CONSENT MANAGEMENT PLATFORM (CMP) CODE GOES HERE ... -->
      Needed for visitors in the EEA/UK/Switzerland once ads are on.
      Use Google's own CMP or another Google-certified CMP.
  Social share image:
      assets/images/og-default.png (1200 x 630, white / bubblegum pink /
      powder blue MahjongKit card) is already wired into every page. Replace that file later if you want a new share design;
      keep the same filename and no HTML changes are needed.
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
4A. GOOGLE ANALYTICS - ONE FILE ONLY
------------------------------------------------------------
Every page already loads the single root file:

  analytics.js

GA4 is ON. The Measurement ID G-XDQNL7NSLN is set in analytics.js
(the GA_MEASUREMENT_ID line). To change it, edit that one line.
Do not paste Analytics code into each HTML page.

The filename analytics.js is just this site's local filename; it does
NOT use Google's retired legacy analytics.js library.

------------------------------------------------------------
4B. AI / AGENT DISCOVERY
------------------------------------------------------------
The root file:

  llms.txt

contains a concise map of the site's best guides for AI agents. Every
HTML page also includes rel="describedby" pointing to llms.txt.

robots.txt already allows public crawling and blocks only /search/.
llms.txt is supplemental discovery metadata; robots.txt remains the
actual crawler-access control file.

------------------------------------------------------------
5. FILE MAP
------------------------------------------------------------
  index.html                 Homepage
  404.html                   "Page not found"
  robots.txt, sitemap.xml    For search engines
  llms.txt                   AI/agent-friendly site map
  analytics.js              One-file GA4 setup (paste Measurement ID once)
  assets/css/styles.css      All styling (one file). Material 3 colour,
                             shape, type and motion tokens are at the top.
  assets/js/main.js          Menu drawer, table of contents, folder preview
  assets/js/search.js        Search logic (runs in the browser, no server)
  assets/js/search-index.js  The list of pages search can find
  assets/js/flower-match.js  The Flower Match game (flowers drawn in code)
  assets/images/             Favicon, logo mark, social share image, printable previews
  assets/downloads/          Free printable PDFs (letter size):
                               mahjong-table-companion.pdf       2 pp landscape
                               mahjong-scoring-payouts-card.pdf  1 p portrait
                               mahjong-etiquette-house-rules.pdf 2 pp portrait
                               mahjong-charleston-card.pdf       1 p portrait
                               mahjong-dead-hands-defense-card.pdf 1 p portrait
                               mahjong-teaching-kit.pdf          2 pp landscape
                             All are listed on learn/mahjong-cheat-sheet/. Preview
                             images are assets/images/table-companion-*.jpg and
                             printable-*.jpg. If you replace a PDF, keep the same
                             filename and regenerate its preview image.
  learn/ rules/ strategy/ gear/ community/   Guides and sections
  learn/american-mahjong-tiles/         Tile guide (tile art drawn inline as SVG)
  rules/mahjong-scoring-payouts/        Scoring and payouts
  rules/mahjong-etiquette/              Etiquette
  community/teach-mahjong-lessons/      Teaching lessons (course, pricing, venues)
  strategy/mahjong-defense/             Defense and the endgame
  assets/images/mahjong-wall-diagram.svg  Wall diagram used on rules/table-setup/
  play/flower-match/         Flower Match. Every "Play" link goes here.
  play/tile-match/           Tile Match: practice game with real tile faces
  play/dragon-match/         Dragon Match: pair each Dragon with its suit
  play/number-match/         Number Match: same number, different suit (9 or 16 tiles)
  play/practice-hand/        Solo Practice Hand (assets/js/practice-hand.js; the rules
                             engine at the top of that file runs under Node for testing;
                             tile art in assets/js/tile-faces.js)
                             (assets/js/tile-match.js, generated from the
                             Flower Match engine plus the printables' tile art)
  play/index.html            Redirect only: sends old /play/ links to
                             Flower Match (not in the sitemap).
                             Real online Mahjong platforms, with links,
                             live in community/play-american-mahjong-online/
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

Logo and icons: the mark is the "Pink scallop" flower tile from Flower
Match (12-petal pink flower, orange ring, white face, pink base). It is
inlined as SVG in every page header, drawer and footer, and saved as:
  assets/images/logo-mark.svg        full mark (40x40)
  assets/images/logo-mark-512.png    raster logo used in Organization schema
  assets/images/favicon.svg          tighter crop for browser tabs
  assets/images/favicon-32.png       PNG fallback for older browsers
  assets/images/apple-touch-icon.png iPhone/iPad home screen (180x180)
  assets/images/icon-192.png, icon-512.png   app-style icons
  favicon.ico (site root)            for tools that request /favicon.ico

Fonts: the system font stack. No request is made to Google Fonts.
Body text is 17-18px for comfortable reading on phones; buttons and
tap targets are at least 48px tall.
