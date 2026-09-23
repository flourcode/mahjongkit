/* MahjongKit — flower-match.js
   Flower Match: a calm, Mahjong-inspired matching game.
   Every board has exactly one identical pair. Find it, the tiles flip to their pink backs, and a fresh board deals face-up.
   All flower art is drawn in code as SVG (no image files, nothing copied).
   Works entirely in the browser: no accounts, no tracking, no timers.
*/
(function () {
  'use strict';

  /* ---------- Retro palette ---------- */
  var C = {
    pink: '#F4A7C2', rose: '#E86A97', orange: '#F0672E', red: '#D9432F', brown: '#7E4527',
    green: '#3B9A45', leaf: '#2C7A38', blue: '#2F55A6', mustard: '#D3912C', cream: '#F8ECD4',
    lilac: '#B08AC8', teal: '#2E8C86', cocoa: '#5B3A2A'
  };

  /* ---------- Flower designs (each is visually distinct) ---------- */
  /* ---------- Real American Mahjong tile faces (same art as the printables) ---------- */
  var DESIGNS = [{"name": "1 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">1</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">一</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "2 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">2</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">二</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "3 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">3</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">三</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "4 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">4</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">四</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "5 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">5</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">五</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "6 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">6</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">六</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "7 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">7</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">七</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "8 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">8</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">八</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "9 Crak", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#D94083\">9</text><text x=\"50\" y=\"66\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#211A1E\">九</text><text x=\"50\" y=\"112\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#D94083\">萬</text></svg>", "suit": "Craks"}, {"name": "1 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">1</text><circle cx=\"50\" cy=\"72\" r=\"26\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"72\" r=\"16.1\" fill=\"#fff\"/><circle cx=\"50\" cy=\"72\" r=\"10.9\" fill=\"#EE8FB6\"/><circle cx=\"50\" cy=\"72\" r=\"4.2\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "2 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">2</text><circle cx=\"50\" cy=\"44\" r=\"17\" fill=\"#EE8FB6\"/><circle cx=\"50\" cy=\"44\" r=\"6.1\" fill=\"#fff\"/><circle cx=\"50\" cy=\"100\" r=\"17\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"100\" r=\"6.1\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "3 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">3</text><circle cx=\"28\" cy=\"40\" r=\"14\" fill=\"#EE8FB6\"/><circle cx=\"28\" cy=\"40\" r=\"5.0\" fill=\"#fff\"/><circle cx=\"50\" cy=\"72\" r=\"14\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"72\" r=\"5.0\" fill=\"#fff\"/><circle cx=\"72\" cy=\"104\" r=\"14\" fill=\"#EE8FB6\"/><circle cx=\"72\" cy=\"104\" r=\"5.0\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "4 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">4</text><circle cx=\"32\" cy=\"46\" r=\"14\" fill=\"#EE8FB6\"/><circle cx=\"32\" cy=\"46\" r=\"5.0\" fill=\"#fff\"/><circle cx=\"68\" cy=\"46\" r=\"14\" fill=\"#7FA7D4\"/><circle cx=\"68\" cy=\"46\" r=\"5.0\" fill=\"#fff\"/><circle cx=\"32\" cy=\"98\" r=\"14\" fill=\"#EE8FB6\"/><circle cx=\"32\" cy=\"98\" r=\"5.0\" fill=\"#fff\"/><circle cx=\"68\" cy=\"98\" r=\"14\" fill=\"#7FA7D4\"/><circle cx=\"68\" cy=\"98\" r=\"5.0\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "5 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">5</text><circle cx=\"30\" cy=\"42\" r=\"13\" fill=\"#EE8FB6\"/><circle cx=\"30\" cy=\"42\" r=\"4.7\" fill=\"#fff\"/><circle cx=\"70\" cy=\"42\" r=\"13\" fill=\"#7FA7D4\"/><circle cx=\"70\" cy=\"42\" r=\"4.7\" fill=\"#fff\"/><circle cx=\"50\" cy=\"72\" r=\"13\" fill=\"#EE8FB6\"/><circle cx=\"50\" cy=\"72\" r=\"4.7\" fill=\"#fff\"/><circle cx=\"30\" cy=\"102\" r=\"13\" fill=\"#7FA7D4\"/><circle cx=\"30\" cy=\"102\" r=\"4.7\" fill=\"#fff\"/><circle cx=\"70\" cy=\"102\" r=\"13\" fill=\"#EE8FB6\"/><circle cx=\"70\" cy=\"102\" r=\"4.7\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "6 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">6</text><circle cx=\"33\" cy=\"38\" r=\"12\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"38\" r=\"4.3\" fill=\"#fff\"/><circle cx=\"67\" cy=\"38\" r=\"12\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"38\" r=\"4.3\" fill=\"#fff\"/><circle cx=\"33\" cy=\"72\" r=\"12\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"72\" r=\"4.3\" fill=\"#fff\"/><circle cx=\"67\" cy=\"72\" r=\"12\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"72\" r=\"4.3\" fill=\"#fff\"/><circle cx=\"33\" cy=\"106\" r=\"12\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"106\" r=\"4.3\" fill=\"#fff\"/><circle cx=\"67\" cy=\"106\" r=\"12\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"106\" r=\"4.3\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "7 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">7</text><circle cx=\"32\" cy=\"42\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"32\" cy=\"42\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"50\" cy=\"55\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"55\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"68\" cy=\"68\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"68\" cy=\"68\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"33\" cy=\"92\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"33\" cy=\"92\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"92\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"67\" cy=\"92\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"33\" cy=\"115\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"33\" cy=\"115\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"115\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"67\" cy=\"115\" r=\"3.6\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "8 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">8</text><circle cx=\"33\" cy=\"42\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"42\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"42\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"42\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"33\" cy=\"66\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"66\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"66\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"66\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"33\" cy=\"90\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"90\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"90\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"90\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"33\" cy=\"114\" r=\"10\" fill=\"#EE8FB6\"/><circle cx=\"33\" cy=\"114\" r=\"3.6\" fill=\"#fff\"/><circle cx=\"67\" cy=\"114\" r=\"10\" fill=\"#7FA7D4\"/><circle cx=\"67\" cy=\"114\" r=\"3.6\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "9 Dot", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">9</text><circle cx=\"26\" cy=\"40\" r=\"10.5\" fill=\"#EE8FB6\"/><circle cx=\"26\" cy=\"40\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"50\" cy=\"40\" r=\"10.5\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"40\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"74\" cy=\"40\" r=\"10.5\" fill=\"#EE8FB6\"/><circle cx=\"74\" cy=\"40\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"26\" cy=\"72\" r=\"10.5\" fill=\"#7FA7D4\"/><circle cx=\"26\" cy=\"72\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"50\" cy=\"72\" r=\"10.5\" fill=\"#EE8FB6\"/><circle cx=\"50\" cy=\"72\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"74\" cy=\"72\" r=\"10.5\" fill=\"#7FA7D4\"/><circle cx=\"74\" cy=\"72\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"26\" cy=\"104\" r=\"10.5\" fill=\"#EE8FB6\"/><circle cx=\"26\" cy=\"104\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"50\" cy=\"104\" r=\"10.5\" fill=\"#7FA7D4\"/><circle cx=\"50\" cy=\"104\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"74\" cy=\"104\" r=\"10.5\" fill=\"#EE8FB6\"/><circle cx=\"74\" cy=\"104\" r=\"3.8\" fill=\"#fff\"/></svg>", "suit": "Dots"}, {"name": "1 Bam (the bird)", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">1</text><g transform=\"translate(0 6)\"><ellipse cx=\"50\" cy=\"74\" rx=\"24\" ry=\"20\" fill=\"#EE8FB6\"/><circle cx=\"66\" cy=\"50\" r=\"13\" fill=\"#EE8FB6\"/><path d=\"M78 48 L90 52 L78 56Z\" fill=\"#F0672E\"/><circle cx=\"69\" cy=\"47\" r=\"2.6\" fill=\"#211A1E\"/><path d=\"M30 70 C38 60 54 62 60 74 C50 80 38 80 30 70Z\" fill=\"#7FA7D4\"/><path d=\"M28 78 L10 70 L14 86 Z\" fill=\"#4D7096\"/><path d=\"M44 94 L42 106 M56 94 L58 106\" stroke=\"#4D7096\" stroke-width=\"3.5\" stroke-linecap=\"round\"/></g></svg>", "suit": "Bams"}, {"name": "2 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">2</text><rect x=\"44.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "3 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">3</text><rect x=\"44.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"28.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"25.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"25.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"60.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"57.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"57.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "4 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">4</text><rect x=\"28.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"25.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"25.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"60.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"57.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"57.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"28.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"25.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"25.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"60.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"57.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"57.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "5 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">5</text><rect x=\"24.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"21.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"21.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"64.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"61.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"61.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"55\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"67.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"82.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"24.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"21.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"21.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"64.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"61.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"61.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "6 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">6</text><rect x=\"22.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"19.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"19.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"66.0\" y=\"30\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"63.5\" y=\"42.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"63.5\" y=\"57.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"22.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"19.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"19.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"66.0\" y=\"80\" width=\"12\" height=\"44\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"63.5\" y=\"92.9\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"63.5\" y=\"107.4\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "7 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">7</text><rect x=\"44.0\" y=\"32\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"39.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"47.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"22.0\" y=\"62\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"19.5\" y=\"69.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"19.5\" y=\"77.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"62\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"69.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"77.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"66.0\" y=\"62\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"63.5\" y=\"69.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"63.5\" y=\"77.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"22.0\" y=\"92\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"19.5\" y=\"99.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"19.5\" y=\"107.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"44.0\" y=\"92\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"41.5\" y=\"99.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"41.5\" y=\"107.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"66.0\" y=\"92\" width=\"12\" height=\"26\" rx=\"6.0\" fill=\"#3F8A6B\"/><rect x=\"63.5\" y=\"99.0\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"63.5\" y=\"107.6\" width=\"17\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "8 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">8</text><rect x=\"19.0\" y=\"30\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"16.5\" y=\"42.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"16.5\" y=\"57.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"37.0\" y=\"30\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"34.5\" y=\"42.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"34.5\" y=\"57.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"53.0\" y=\"30\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"50.5\" y=\"42.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"50.5\" y=\"57.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"71.0\" y=\"30\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"68.5\" y=\"42.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"68.5\" y=\"57.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"19.0\" y=\"80\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"16.5\" y=\"92.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"16.5\" y=\"107.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"37.0\" y=\"80\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"34.5\" y=\"92.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"34.5\" y=\"107.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"53.0\" y=\"80\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"50.5\" y=\"92.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"50.5\" y=\"107.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"71.0\" y=\"80\" width=\"10\" height=\"44\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"68.5\" y=\"92.9\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"68.5\" y=\"107.4\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "9 Bam", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#3F8A6B\">9</text><rect x=\"23.0\" y=\"32\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"20.5\" y=\"39.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"20.5\" y=\"47.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"45.0\" y=\"32\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"42.5\" y=\"39.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"42.5\" y=\"47.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"67.0\" y=\"32\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"64.5\" y=\"39.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"64.5\" y=\"47.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"23.0\" y=\"62\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"20.5\" y=\"69.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"20.5\" y=\"77.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"45.0\" y=\"62\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"42.5\" y=\"69.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"42.5\" y=\"77.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"67.0\" y=\"62\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"64.5\" y=\"69.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"64.5\" y=\"77.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"23.0\" y=\"92\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"20.5\" y=\"99.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"20.5\" y=\"107.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"45.0\" y=\"92\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"42.5\" y=\"99.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"42.5\" y=\"107.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"67.0\" y=\"92\" width=\"10\" height=\"26\" rx=\"5.0\" fill=\"#3F8A6B\"/><rect x=\"64.5\" y=\"99.0\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/><rect x=\"64.5\" y=\"107.6\" width=\"15\" height=\"3.2\" rx=\"1.6\" fill=\"#fff\"/></svg>", "suit": "Bams"}, {"name": "North Wind", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">N</text><text x=\"50\" y=\"92\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"52\" font-weight=\"700\" fill=\"#211A1E\">北</text></svg>"}, {"name": "East Wind", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">E</text><text x=\"50\" y=\"92\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"52\" font-weight=\"700\" fill=\"#211A1E\">東</text></svg>"}, {"name": "West Wind", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">W</text><text x=\"50\" y=\"92\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"52\" font-weight=\"700\" fill=\"#211A1E\">西</text></svg>"}, {"name": "South Wind", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"13\" y=\"24\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"17\" font-weight=\"800\" fill=\"#4D7096\">S</text><text x=\"50\" y=\"92\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"52\" font-weight=\"700\" fill=\"#211A1E\">南</text></svg>"}, {"name": "Flower", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><g transform=\"translate(50 70) scale(.78)\"><path d=\"M-10.42 -38.87A11.5 11.5 0 1 1 10.42 -38.87A11.5 11.5 0 1 1 28.46 -28.46A11.5 11.5 0 1 1 38.87 -10.42A11.5 11.5 0 1 1 38.87 10.42A11.5 11.5 0 1 1 28.46 28.46A11.5 11.5 0 1 1 10.42 38.87A11.5 11.5 0 1 1 -10.42 38.87A11.5 11.5 0 1 1 -28.46 28.46A11.5 11.5 0 1 1 -38.87 10.42A11.5 11.5 0 1 1 -38.87 -10.42A11.5 11.5 0 1 1 -28.46 -28.46A11.5 11.5 0 1 1 -10.42 -38.87Z\" fill=\"#F4A7C2\"/><circle r=\"21\" fill=\"#F0672E\"/><circle r=\"8.5\" fill=\"#F4A7C2\"/></g></svg>"}, {"name": "Joker", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><path transform=\"translate(50 52) scale(2.1)\" d=\"M0 -10 C1.6 -2.2 2.2 -1.6 10 0 C2.2 1.6 1.6 2.2 0 10 C-1.6 2.2 -2.2 1.6 -10 0 C-2.2 -1.6 -1.6 -2.2 0 -10Z\" fill=\"#EE8FB6\"/><path transform=\"translate(72 34) scale(0.9)\" d=\"M0 -10 C1.6 -2.2 2.2 -1.6 10 0 C2.2 1.6 1.6 2.2 0 10 C-1.6 2.2 -2.2 1.6 -10 0 C-2.2 -1.6 -1.6 -2.2 0 -10Z\" fill=\"#7FA7D4\"/><path transform=\"translate(29 72) scale(0.7)\" d=\"M0 -10 C1.6 -2.2 2.2 -1.6 10 0 C2.2 1.6 1.6 2.2 0 10 C-1.6 2.2 -2.2 1.6 -10 0 C-2.2 -1.6 -1.6 -2.2 0 -10Z\" fill=\"#7FA7D4\"/><text x=\"50\" y=\"108\" text-anchor=\"middle\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif\" font-size=\"16.5\" font-weight=\"800\" letter-spacing=\"1\" fill=\"#6B5D91\">JOKER</text></svg>"}, {"name": "Red Dragon", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"50\" y=\"90\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"56\" font-weight=\"800\" fill=\"#C8324F\">中</text></svg>", "dragon": "Craks"}, {"name": "Green Dragon", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><text x=\"50\" y=\"90\" text-anchor=\"middle\" font-family=\"'PingFang SC','Hiragino Sans','Microsoft YaHei','Noto Sans CJK SC','Noto Sans SC',sans-serif\" font-size=\"52\" font-weight=\"800\" fill=\"#3F8A6B\">發</text></svg>", "dragon": "Bams"}, {"name": "Soap (White Dragon)", "svg": "<svg viewBox=\"0 0 100 136\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"24\" y=\"30\" width=\"52\" height=\"76\" rx=\"8\" fill=\"none\" stroke=\"#7FA7D4\" stroke-width=\"6\"/><rect x=\"33\" y=\"39\" width=\"34\" height=\"58\" rx=\"4\" fill=\"none\" stroke=\"#4D7096\" stroke-width=\"3\"/></svg>", "dragon": "Dots"}];

  function polar(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function draw(d) { return d.svg; }


  /* ---------- Game state ---------- */
  var board = document.getElementById('board');
  if (!board) return;
  var pairsEl = document.getElementById('pairs-count');
  var sizeLabel = document.getElementById('size-label');
  var hintBtn = document.getElementById('hint-btn');
  var newBtn = document.getElementById('new-board-btn');
  var doneBox = document.getElementById('game-done');
  var doneText = document.getElementById('done-text');
  var againBtn = document.getElementById('again-btn');
  var sizeBtns = document.querySelectorAll('[data-size]');
  var live = document.getElementById('game-live');

  var ROUND_LENGTH = 10;
  var size = 16, cols = 4;
  var tiles = [], picked = null, pairs = 0, inRound = 0, locked = false, pairIndex = -1;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  /* ---------- Tile backs and flip animation ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FLIP_MS = 380, STEP_MS = 45, HOLD_MS = 140, POP_MS = 520;

  // Pink tile back: a white scalloped flower, like the MahjongKit logo.
  var BACK = (function () {
    var s = '', i, p;
    for (i = 0; i < 12; i++) { p = polar(50, 50, 33, i * 30); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="11.5"/>'; }
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="#FFFFFF">' + s +
      '<circle cx="50" cy="50" r="34"/></g><circle cx="50" cy="50" r="21" fill="#EE8FB6"/><circle cx="50" cy="50" r="8.5" fill="#FFFFFF"/></svg>';
  })();

  function tileEls() { return Array.prototype.slice.call(board.querySelectorAll('.ftile')); }

  // Delay for each tile so the flip ripples outward from one tile.
  function rippleDelay(i, origin) {
    if (origin == null || origin < 0) origin = 0;
    var r = Math.floor(i / cols), c = i % cols, orr = Math.floor(origin / cols), oc = origin % cols;
    return Math.round(Math.sqrt((r - orr) * (r - orr) + (c - oc) * (c - oc)) * STEP_MS);
  }

  // Flip every tile face-down (down = true) or face-up, then call done.
  function flipAll(down, origin, done) {
    var els = tileEls(), maxDelay = 0;
    els.forEach(function (el, i) {
      var d = rippleDelay(i, origin);
      if (d > maxDelay) maxDelay = d;
      el.style.setProperty('--flip-delay', d + 'ms');
      el.classList.remove('is-picked', 'is-matched', 'is-hint', 'is-wrong');
      el.classList.toggle('is-down', down);
      el.tabIndex = down ? -1 : 0;
    });
    setTimeout(done || function () {}, maxDelay + FLIP_MS);
  }

  function makeTile(d, i, faceDown) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ftile' + (faceDown ? ' is-down' : '');
    b.dataset.i = String(i);
    b.setAttribute('aria-label', d.name + ' tile');
    b.innerHTML = '<span class="ftile__inner"><span class="ftile__face">' + draw(d) +
      '</span><span class="ftile__back">' + BACK + '</span></span>';
    return b;
  }

  // Dragon Match: exactly one Dragon and exactly one tile from its suit, so
  // every board has one right answer. Everything else comes from the other two
  // suits or from Winds, Flowers and Jokers.
  var currentSuit = null;
  var DRAGON_WHY = { Craks: 'Red Dragon goes with Craks', Bams: 'Green Dragon goes with Bams', Dots: 'Soap goes with Dots' };
  function newList() {
    var dragons = DESIGNS.filter(function (d) { return d.dragon; });
    var dr = dragons[Math.floor(Math.random() * dragons.length)];
    currentSuit = dr.dragon;
    var partners = DESIGNS.filter(function (d) { return d.suit === currentSuit; });
    var partner = partners[Math.floor(Math.random() * partners.length)];
    var others = shuffle(DESIGNS.filter(function (d) { return !d.dragon && d.suit !== currentSuit; })).slice(0, size - 2);
    return shuffle([dr, partner].concat(others));
  }
  function isPair(a, b) { return (a.dragon && b.suit === a.dragon) || (b.dragon && a.suit === b.dragon); }
  function guide(a, b) {
    var d = a.dragon ? a : (b.dragon ? b : null), o = d === a ? b : a;
    if (!d) return '';
    return o.suit ? d.name.replace(' (White Dragon)', '') + ' goes with ' + d.dragon + ', not ' + o.suit : d.name.replace(' (White Dragon)', '') + ' goes with ' + d.dragon;
  }
  function showCap(t) {
    var cap = document.getElementById('match-name');
    if (cap) { cap.textContent = t; cap.classList.remove('is-shown'); void cap.offsetWidth; cap.classList.add('is-shown'); }
  }

  // Deal a board. With animate, the current tiles flip to their pink backs,
  // the new flowers go in face-down, and the board flips up again.
  function deal(animate, origin) {
    picked = null;
    resetHint();
    var list = newList();
    var existing = tileEls();
    var canAnimate = animate && !reduceMotion.matches && existing.length === list.length;

    function place(faceDown) {
      tiles = list;
      board.style.setProperty('--board-cols', cols);
      board.innerHTML = '';
      list.forEach(function (d, i) { board.appendChild(makeTile(d, i, faceDown)); });
    }

    if (!canAnimate) {
      place(false);
      locked = false;
      board.removeAttribute('aria-busy');
      announce('New board dealt. ' + size + ' tiles.');
      return;
    }

    locked = true;
    board.setAttribute('aria-busy', 'true');
    var alreadyDown = existing.every(function (el) { return el.classList.contains('is-down'); });
    function flipUp() {
      place(true);
      void board.offsetWidth;           // let the face-down tiles render before flipping
      setTimeout(function () {
        flipAll(false, origin, function () {
          locked = false;
          board.removeAttribute('aria-busy');
        });
        announce('New board dealt. ' + size + ' tiles.');
      }, HOLD_MS);
    }
    if (alreadyDown) flipUp(); else flipAll(true, origin, flipUp);
  }

  function announce(msg) { if (live) live.textContent = msg; }

  // A small burst of petals from the centre of a tile.
  var PETALS = ['#F4A7C2', '#EE8FB6', '#A9CDF0', '#F0672E', '#FFD9E8'];
  function burst(el) {
    if (reduceMotion.matches) return;
    var wrap = board.parentNode, wr = wrap.getBoundingClientRect(), r = el.getBoundingClientRect();
    var cx = r.left - wr.left + r.width / 2, cy = r.top - wr.top + r.height / 2;
    for (var k = 0; k < 12; k++) {
      var p = document.createElement('span');
      var ang = (k / 12) * Math.PI * 2 + Math.random() * .4;
      var dist = r.width * (.55 + Math.random() * .45);
      p.className = 'fm-petal';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = PETALS[k % PETALS.length];
      p.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      p.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px');
      p.style.setProperty('--rot', Math.round(Math.random() * 540 - 270) + 'deg');
      p.setAttribute('aria-hidden', 'true');
      wrap.appendChild(p);
      setTimeout((function (n) { return function () { n.remove(); }; })(p), 900);
    }
  }

  function bump(el) {
    if (!el) return;
    el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
  }

  function onTile(e) {
    var btn = e.target.closest('.ftile');
    if (!btn || locked) return;
    var i = Number(btn.dataset.i);
    if (picked === null) { picked = i; btn.classList.add('is-picked'); return; }
    if (picked === i) { btn.classList.remove('is-picked'); picked = null; return; }
    var first = board.querySelector('[data-i="' + picked + '"]');
    if (isPair(tiles[picked], tiles[i])) {
      var pairMsg = DRAGON_WHY[currentSuit];
      locked = true;
      first.classList.remove('is-picked');
      first.classList.add('is-matched'); btn.classList.add('is-matched');
      burst(first); burst(btn);
      pairs++; inRound++;
      pairsEl.textContent = pairs;
      var pw = document.getElementById('pairs-word'); if (pw) pw.textContent = pairs === 1 ? 'pair' : 'pairs';
      bump(pairsEl.closest('.chip'));
      announce(pairMsg + '. ' + pairs + ' pairs so far.');
      var cap = document.getElementById('match-name');
      if (cap) showCap(pairMsg);
      if (reduceMotion.matches) {
        if (inRound >= ROUND_LENGTH) setTimeout(finishRound, 450); else setTimeout(deal, 520);
      } else if (inRound >= ROUND_LENGTH) {
        setTimeout(function () { flipAll(true, i, finishRound); }, POP_MS);
      } else {
        setTimeout(function () { deal(true, i); }, POP_MS);
      }
    } else {
      first.classList.remove('is-picked');
      btn.classList.add('is-wrong'); first.classList.add('is-wrong');
      setTimeout(function () { btn.classList.remove('is-wrong'); first.classList.remove('is-wrong'); }, 400);
      picked = null;
      var gm = guide(tiles[Number(first.dataset.i)], tiles[i]);
      announce(gm ? gm + '. Try again.' : 'Not a match. Try again.');
      if (gm) showCap(gm);
    }
  }

  function finishRound() {
    locked = true;
    doneText.textContent = pairs + (pairs === 1 ? ' pair' : ' pairs') + ' found. Keep going, or learn a rule while you are here.';
    doneBox.classList.add('is-open');
    doneBox.setAttribute('aria-hidden', 'false');
    againBtn.focus();
  }

  // Gentle, two-step hint. First tap: one tile of the pair lifts and glows.
  // Second tap: its partner glows too. Hints stay until the pair is found or a
  // new board is dealt, so nothing disappears before a relaxed player finds it.
  var HINT_LABEL = 'Show me a hint', HINT_AGAIN = 'Show its partner';
  function resetHint() {
    hintBtn.textContent = HINT_LABEL;
    hintBtn.disabled = false;
  }
  function hint() {
    if (locked) return;
    var pair = [];
    tiles.forEach(function (d, i) { if (d.dragon || d.suit === currentSuit) pair.push(i); });
    if (pair.length < 2) return;
    var shown = pair.filter(function (i) {
      var el = board.querySelector('[data-i="' + i + '"]');
      return el && el.classList.contains('is-hint');
    });
    var next;
    if (shown.length === 0) next = pair[Math.floor(Math.random() * 2)];
    else if (shown.length === 1) next = pair[0] === shown[0] ? pair[1] : pair[0];
    else return;
    var el = board.querySelector('[data-i="' + next + '"]');
    if (!el) return;
    el.classList.add('is-hint');
    if (shown.length === 0) {
      hintBtn.textContent = HINT_AGAIN;
      announce('Hint: one tile of the pair is glowing. Tap the button again to see its partner.');
    } else {
      hintBtn.disabled = true;
      announce('Both tiles of the pair are glowing.');
    }
  }

  function setSize(n) {
    try { localStorage.setItem('mk-dragon-match-size', String(n)); } catch (e) { /* storage off: fine */ }
    size = n; cols = n === 9 ? 3 : n === 16 ? 4 : 5;
    sizeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.size) === n)); });
    if (sizeLabel) sizeLabel.textContent = n + ' tiles';
    deal();
  }

  board.addEventListener('click', onTile);
  hintBtn.addEventListener('click', hint);
  newBtn.addEventListener('click', function () {
    if (locked && !doneBox.classList.contains('is-open')) return;   // mid-flip
    deal(true, Math.floor(size / 2));
  });
  againBtn.addEventListener('click', function () {
    inRound = 0;
    doneBox.classList.remove('is-open'); doneBox.setAttribute('aria-hidden', 'true');
    deal(true, Math.floor(size / 2));
  });
  sizeBtns.forEach(function (b) { b.addEventListener('click', function () { setSize(Number(b.dataset.size)); }); });

  // Phones get a 4x4 by default; wider screens a 5x5.
  var savedSize = null;
  try { savedSize = Number(localStorage.getItem('mk-dragon-match-size')); } catch (e) { /* storage off */ }
  setSize([9, 16, 25].indexOf(savedSize) !== -1 ? savedSize : (window.matchMedia('(min-width: 600px)').matches ? 25 : 16));
})();
