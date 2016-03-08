
export const UNICODE = {
  /**
   * Western punctuation (西文標點符號)
   */
  punct: {
    base:   '[\\u2026,.;:!?\\u203D_]',
    sing:   '[\\u2010-\\u2014\\u2026]',
    middle: '[\\\/~\\-&\\u2010-\\u2014_]',
    open:   '[\'"‘“\\(\\[\\u00A1\\u00BF\\u2E18\\u00AB\\u2039\\u201A\\u201C\\u201E]',
    close:  '[\'"”’\\)\\]\\u00BB\\u203A\\u201B\\u201D\\u201F]',
    end:    '[\'"”’\\)\\]\\u00BB\\u203A\\u201B\\u201D\\u201F\\u203C\\u203D\\u2047-\\u2049,.;:!?]',
  },

  /**
   * CJK biaodian (CJK標點符號)
   */
  biaodian: {
    base:   '[︰．、，。：；？！ー]',
    liga:   '[—…⋯]',
    middle: '[·＼／－゠\\uFF06\\u30FB\\uFF3F]',
    open:   '[「『《〈（〔［｛【〖]',
    close:  '[」』》〉）〕］｝】〗]',
    end:    '[」』》〉）〕］｝】〗︰．、，。：；？！ー]',
  },

  /**
   * CJK-related blocks (CJK相關區段)
   *
   * Basic CJK unified ideographs
   * 基本中日韓統一意音文字
   * [\u4E00-\u9FFF]
   * Extended-A
   * 擴展-A區
   * [\u3400-\u4DB5]
   * Extended-B
   * [\u20000-\u2A6D6]
   * Extended-C
   * 擴展-C區
   * [\u2A700-\u2B734]
   * Extended-D
   * 擴展-D區（急用漢字）
   * [\u2B740-\u2B81D]
   * Extended-E (not supported yet)
   * 擴展-E區（暫未支援）
   * [\u2B820-\u2F7FF]
   * Extended-F (not supported yet)
   * 擴展-F區（暫未支援）
   * Strokes
   * 筆畫區
   * [\u31C0-\u31E3]
   * Ideographic number zero
   * 意音數字「〇」
   * [\u3007]
   * Compatibility ideograph and supplement (not supported)
   * 相容意音文字及補充
   * [\uF900-\uFAFF][\u2F800-\u2FA1D]（不使用）
   * >>>
   * 12 exceptions:
   * https://zh.wikipedia.org/wiki/中日韓統一表意文字#cite_note-1
   * [\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]
   * <<<
   *
   * Kangxi and supplement radicals
   * 康熙字典及簡化字部首
   * [\u2F00-\u2FD5\u2E80-\u2EF3]
   * Ideographic description characters
   * 意音文字描述字元
   * [\u2FF0-\u2FFA]
   */
  hanzi: {
    base:    '[\\u4E00-\\u9FFF\\u3400-\\u4DB5\\u31C0-\\u31E3\\u3007\\uFA0E\\uFA0F\\uFA11\\uFA13\\uFA14\\uFA1F\\uFA21\\uFA23\\uFA24\\uFA27-\\uFA29]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]',
    nonbmp:  '[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]',
    desc:    '[\\u2FF0-\\u2FFA]',
    radical: '[\\u2F00-\\u2FD5\\u2E80-\\u2EF3]',
  },

  /**
   * Latin script blocks (拉丁字母區段)
   *
   * Basic Latin
   * 基本拉丁字母
   * A-Za-z
   * Digits
   * 阿拉伯數字
   * 0-9
   * Latin-1 supplement
   * 補充-1
   * [\u00C0-\u00FF]
   * Extended-A
   * 擴展-A區
   * [\u0100-\u017F]
   * Extended-B
   * 擴展-B區
   * [\u0180-\u024F]
   * Extended-C
   * 擴展-C區
   * [\u2C60-\u2C7F]
   * Extended-D
   * 擴展-D區
   * [\uA720-\uA7FF]
   * Extended additional
   * 附加區
   * [\u1E00-\u1EFF]
   * Combining diacritical marks
   * 變音組字符
   * [\u0300-\u0341\u1DC0-\u1DFF]
   */
  latin: {
    base:    '[A-Za-z0-9\\u00C0-\\u00FF\\u0100-\\u017F\\u0180-\\u024F\\u2C60-\\u2C7F\\uA720-\\uA7FF\\u1E00-\\u1EFF]',
    combine: '[\\u0300-\\u0341\\u1DC0-\\u1DFF]',
  },

  /**
   * Elli̱niká (Greek) script blocks (希臘字母區段)
   *
   * Basic Greek & Greek Extended
   * 希臘字母及擴展
   * [\u0370–\u03FF\u1F00-\u1FFF]
   * Digits
   * 阿拉伯數字
   * 0-9
   * Combining diacritical marks
   * 希臘字母變音組字符
   * [\u0300-\u0345\u1DC0-\u1DFF]
   */
  ellinika: {
    base:    '[0-9\\u0370-\\u03FF\\u1F00-\\u1FFF]',
    combine: '[\\u0300-\\u0345\\u1DC0-\\u1DFF]',
  },

  /**
   * Kirillica (Cyrillic) script blocks (西里爾字母區段)
   *
   * Basic Cyrillic and supplement
   * 西里爾字母及補充
   * [\u0400-\u0482\u048A-\u04FF\u0500-\u052F]
   * Extended-B
   * 擴展B區
   * [\uA640-\uA66E\uA67E-\uA697]
   * Digits
   * 阿拉伯數字
   * 0-9
   * Cyrillic combining diacritical marks
   * 西里爾字母組字符
   * [\u0483-\u0489\u2DE0-\u2DFF\uA66F-\uA67D\uA69F]
   */
  kirillica: {
    base:    '[0-9\\u0400-\\u0482\\u048A-\\u04FF\\u0500-\\u052F\\uA640-\\uA66E\\uA67E-\\uA697]',
    combine: '[\\u0483-\\u0489\\u2DE0-\\u2DFF\\uA66F-\\uA67D\\uA69F]',
  },

  /**
   * Kana (假名)
   *
   * Japanese Kana
   * 日文假名
   * [\u30A2\u30A4\u30A6\u30A8\u30AA-\u30FA\u3042\u3044\u3046\u3048\u304A-\u3094\u309F\u30FF]
   * Kana supplement
   * 假名補充
   * [\u1B000\u1B001]（\uD82C[\uDC00-\uDC01]）
   * Japanese small Kana
   * 日文假名小寫
   * [\u3041\u3043\u3045\u3047\u3049\u30A1\u30A3\u30A5\u30A7\u30A9\u3063\u3083\u3085\u3087\u308E\u3095\u3096\u30C3\u30E3\u30E5\u30E7\u30EE\u30F5\u30F6\u31F0-\u31FF]
   * Kana combining characters
   * 假名組字符
   * [\u3099-\u309C]
   * Halfwidth Kana
   * 半形假名
   * [\uFF66-\uFF9F]
   * Marks
   * 符號
   * [\u309D\u309E\u30FB-\u30FE]
   */
  kana: {
    base:    '[\\u30A2\\u30A4\\u30A6\\u30A8\\u30AA-\\u30FA\\u3042\\u3044\\u3046\\u3048\\u304A-\\u3094\\u309F\\u30FF]|\\uD82C[\\uDC00-\\uDC01]',
    small:   '[\\u3041\\u3043\\u3045\\u3047\\u3049\\u30A1\\u30A3\\u30A5\\u30A7\\u30A9\\u3063\\u3083\\u3085\\u3087\\u308E\\u3095\\u3096\\u30C3\\u30E3\\u30E5\\u30E7\\u30EE\\u30F5\\u30F6\\u31F0-\\u31FF]',
    combine: '[\\u3099-\\u309C]',
    half:    '[\\uFF66-\\uFF9F]',
    mark:    '[\\u30A0\\u309D\\u309E\\u30FB-\\u30FE]',
  },

  /**
   * Eonmun (Hangul, 諺文)
   *
   * Eonmun (Hangul) syllables
   * 諺文音節
   * [\uAC00-\uD7A3]
   * Eonmun (Hangul) letters
   * 諺文字母
   * [\u1100-\u11FF\u314F-\u3163\u3131-\u318E\uA960-\uA97C\uD7B0-\uD7FB]
   * Halfwidth Eonmun (Hangul) letters
   * 半形諺文字母
   * [\uFFA1-\uFFDC]
   */
  eonmun: {
    base:    '[\\uAC00-\\uD7A3]',
    letter:  '[\\u1100-\\u11FF\\u314F-\\u3163\\u3131-\\u318E\\uA960-\\uA97C\\uD7B0-\\uD7FB]',
    half:    '[\\uFFA1-\\uFFDC]',
  },

  /**
   * Zhuyin (注音符號, Mandarin & Dialect Phonetic Symbols)
   *
   * Bopomofo phonetic symbols
   * 國語注音、方言音符號
   * [\u3105-\u312D][\u31A0-\u31BA]
   * Level, rising, departing tones
   * 平上去聲調號
   * [\u02D9\u02CA\u02C5\u02C7\u02EA\u02EB\u02CB]
   * Checked (entering) tones
   * 入聲調號
   * [\u31B4-\u31B7][\u0358\u030d]?
   */
  zhuyin: {
    base:    '[\\u3105-\\u312D\\u31A0-\\u31BA]',
    initial: '[\\u3105-\\u3119\\u312A-\\u312C\\u31A0-\\u31A3]',
    medial:  '[\\u3127-\\u3129]',
    final:   '[\\u311A-\\u3129\\u312D\\u31A4-\\u31B3\\u31B8-\\u31BA]',
    tone:    '[\\u02D9\\u02CA\\u02C5\\u02C7\\u02CB\\u02EA\\u02EB]',
    checked: '[\\u31B4-\\u31B7][\\u0358\\u030d]?',
  },
}

export const TYPESET = (function() {
  // Whitespace characters:
  // http://www.w3.org/TR/css3-selectors/#whitespace
  const rWhite = '[\\x20\\t\\r\\n\\f]'

  const rPtOpen  = UNICODE.punct.open
  const rPtClose = UNICODE.punct.close
  const rPtEnd   = UNICODE.punct.end
  const rPtMid   = UNICODE.punct.middle
  const rPtSing  = UNICODE.punct.sing
  const rPt      = rPtOpen + '|' + rPtEnd + '|' + rPtMid

  const rBDOpen  = UNICODE.biaodian.open
  const rBDClose = UNICODE.biaodian.close
  const rBDEnd   = UNICODE.biaodian.end
  const rBDMid   = UNICODE.biaodian.middle
  const rBDLiga  = UNICODE.biaodian.liga + '{2}'
  const rBD      = rBDOpen + '|' + rBDEnd + '|' + rBDMid

  const rKana  = UNICODE.kana.base + UNICODE.kana.combine + '?'
  const rKanaS = UNICODE.kana.small + UNICODE.kana.combine + '?'
  const rKanaH = UNICODE.kana.half
  const rEon   = UNICODE.eonmun.base + '|' + UNICODE.eonmun.letter
  const rEonH  = UNICODE.eonmun.half
  const rHan   = `${UNICODE.hanzi.base}|${UNICODE.hanzi.desc}|${UNICODE.hanzi.radical}|${rKana}`

  const rCbn   = UNICODE.ellinika.combine
  const rLatn  = UNICODE.latin.base + rCbn + '*'
  const rGk    = UNICODE.ellinika.base + rCbn + '*'
  const rCyCbn = UNICODE.kirillica.combine
  const rCy    = UNICODE.kirillica.base + rCyCbn + '*'
  const rAlph  = rLatn + '|' + rGk + '|' + rCy

  // For words like `it's`, `Jones’s` or `'99`:
  const rApo  = '[\\u0027\\u2019]'
  const rChar = `${rHan}|(?:${rAlph}|${rApo})+`

  const rZyS = UNICODE.zhuyin.initial
  const rZyJ = UNICODE.zhuyin.medial
  const rZyY = UNICODE.zhuyin.final
  const rZyD = UNICODE.zhuyin.tone + '|' + UNICODE.zhuyin.checked

  return {
    /* Character-level selector (字級選擇器)
     */
    char: {
      punct: {
        all:   new RegExp( '(' + rPt + ')', 'g' ),
        open:  new RegExp( '(' + rPtOpen + ')', 'g' ),
        end:   new RegExp( '(' + rPtEnd + ')', 'g' ),
        sing:  new RegExp( '(' + rPtSing + ')', 'g' ),
      },

      biaodian: {
        all:   new RegExp( '(' + rBD + ')', 'g' ),
        open:  new RegExp( '(' + rBDOpen + ')', 'g' ),
        close: new RegExp( '(' + rBDClose + ')', 'g' ),
        end:   new RegExp( '(' + rBDEnd + ')', 'g' ),
        liga:  new RegExp( '(' + rBDLiga + ')', 'g' ),
      },

      hanzi:  new RegExp( `(${rHan})`, 'g' ),
      kana:   new RegExp( `(${rKana}|${rKana}|${rKanaH})`, 'g' ),
      eonmun: new RegExp( `(${rEon}|${rEonH})`, 'g' ),

      latin:       new RegExp( '(' + rLatn + ')', 'gi' ),
      ellinika:    new RegExp( '(' + rGk + ')', 'gi' ),
      kirillica:   new RegExp( '(' + rCy + ')', 'gi' ),
    },

    /* Word-level selectors (詞級選擇器)
     */
    group: {
      biaodian: [
        new RegExp( '((' + rBD + '){2,})', 'g' ),
        new RegExp( '(' + rBDLiga + rBDOpen + ')', 'g' ),
      ],
      punct:   null,
      hanzi:   new RegExp( `(${rHan})+`, 'g' ),
      western: new RegExp( `(${rLatn}|${rGk}|${rCy}|${rPt})+`, 'gi' ),
      kana:    new RegExp( `(${rKana}|${rKanaS}|${rKanaH})+`, 'g' ),
      eonmun:  new RegExp( `(${rEon}|${rEonH}|${rPt})+`, 'g' ),
    },

    /* Punctuation Rules (禁則)
     */
    jinze: {
      hanging: new RegExp( `${rWhite}*([、，。．])(?!${rBDEnd}+)`, 'gi' ),
      touwei:  new RegExp( `(${rBDOpen}+)(${rChar})(${rBDEnd}+)`, 'gi' ),
      tou:     new RegExp( `(${rBDOpen}+)(${rChar})`, 'gi' ),
      wei:     new RegExp( `(${rChar})(${rBDEnd}+)`, 'gi' ),
      middle:  new RegExp( `(${rChar})(${rBDMid})(${rChar})`, 'gi' ),
    },

    zhuyin: {
      form: new RegExp( `^\\u02D9?(${rZyS})?(${rZyJ})?(${rZyY})?(${rZyD})?$` ),
      diao: new RegExp( '(' + rZyD + ')', 'g' ),
    },

    /* Hanzi and Western mixed spacing (漢字西文混排間隙)
     * - Basic mode
     * - Strict mode
     */
    hws: {
      base: [
        new RegExp( `(${rHan})(${rAlph}|${rPtOpen})`, 'gi' ),
        new RegExp( `(${rAlph}|${rPtEnd})(${rHan})`, 'gi' ),
      ],

      strict: [
        new RegExp( `(${rHan})${rWhite}?(${rAlph}|${rPtOpen})`, 'gi' ),
        new RegExp( `(${rAlph}|${rPtEnd})${rWhite}?(${rHan})`, 'gi' ),
      ],
    },

    'display-as': {
      'comb-liga-pua': [
        [ '\\u0061[\\u030d\\u0358]', '\\uDB80\\uDC61' ],
        [ '\\u0065[\\u030d\\u0358]', '\\uDB80\\uDC65' ],
        [ '\\u0069[\\u030d\\u0358]', '\\uDB80\\uDC69' ],
        [ '\\u006F[\\u030d\\u0358]', '\\uDB80\\uDC6F' ],
        [ '\\u0075[\\u030d\\u0358]', '\\uDB80\\uDC75' ],

        [ '\\u31B4[\\u030d\\u0358]', '\\uDB8C\\uDDB4' ],
        [ '\\u31B5[\\u030d\\u0358]', '\\uDB8C\\uDDB5' ],
        [ '\\u31B6[\\u030d\\u0358]', '\\uDB8C\\uDDB6' ],
        [ '\\u31B7[\\u030d\\u0358]', '\\uDB8C\\uDDB7' ],
      ],

      'comb-liga-vowel': [
        [ '\\u0061[\\u030d\\u0358]', '\\uDB80\\uDC61' ],
        [ '\\u0065[\\u030d\\u0358]', '\\uDB80\\uDC65' ],
        [ '\\u0069[\\u030d\\u0358]', '\\uDB80\\uDC69' ],
        [ '\\u006F[\\u030d\\u0358]', '\\uDB80\\uDC6F' ],
        [ '\\u0075[\\u030d\\u0358]', '\\uDB80\\uDC75' ],
      ],

      'comb-liga-zhuyin': [
        [ '\\u31B4[\\u030d\\u0358]', '\\uDB8C\\uDDB4' ],
        [ '\\u31B5[\\u030d\\u0358]', '\\uDB8C\\uDDB5' ],
        [ '\\u31B6[\\u030d\\u0358]', '\\uDB8C\\uDDB6' ],
        [ '\\u31B7[\\u030d\\u0358]', '\\uDB8C\\uDDB7' ],
      ],
    },

    // The feature actually *converts* the character
    // in the DOM for semantic reasons.
    //
    // Note that this could be aggressive.
    'inaccurate-char': [
      [ '[\\u2022\\u2027]', '\\u00B7' ],
      [ '\\u22EF\\u22EF', '\\u2026\\u2026' ],
      [ '\\u2500\\u2500', '\\u2014\\u2014' ],
      [ '\\u2035', '\\u2018' ],
      [ '\\u2032', '\\u2019' ],
      [ '\\u2036', '\\u201C' ],
      [ '\\u2033', '\\u201D' ],
    ],
  }
})()

// Aliases:
Object.assign( UNICODE, {
  cjk:      UNICODE.hanzi,
  greek:    UNICODE.ellinika,
  cyrillic: UNICODE.Kirillica,
  hangul:   UNICODE.eonmun,
})

Object.assign( TYPESET.char, {
  cjk:      TYPESET.char.hanzi,
  greek:    TYPESET.char.ellinika,
  cyrillic: TYPESET.char.Kirillica,
  hangul:   TYPESET.char.eonmum,
})

Object.assign( TYPESET.group, {
  cjk:    TYPESET.group.hanzi,
  hangul: TYPESET.group.eonmun,
})

