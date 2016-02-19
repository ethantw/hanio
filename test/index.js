
'use strict'

const assert = require( 'assert' )
const $      = require( 'cheerio' )
const Ent    = require( 'special-entities' )
const Hanio  = require( '..' )

const desc   = describe
const eq     = assert.equal
const enteq  = ( a, b ) => assert.equal(hexa( a ), hexa( b ))
const htmleq = ( a, b ) => eq(nmlize( a ), nmlize( b ))
const hexa   = v => Ent.normalizeXML( v, 'utf-8' )

const nmlize = html => hexa( html )
  .replace( /[\r\n]/g, '' )
  .replace( /\s{2,}/g, ' ' )
  .replace( /=["']([^"'])["']/g, '="$1"' )
  //.toLowerCase()

desc( 'Basic', () => {
  const html = (
`<!doctype html>
<html lang="zh">
  <head><title>A辭Q</title><meta charset="utf-8"></head>
  <body><article><p>測試，測試。</article></body>
</html>`
  )
  it( 'Default rendering routine (zh)', () => {
    const root = Hanio( html ).render().root.find( 'html' )
    eq( root.hasClass( 'han-js-rendered' ), true )
    enteq( Hanio.html( root.find( 'title' )), '<title>A辭Q</title>' )
  })

  it( 'Default rendering routine (ja)', () => {
    const root = Hanio( html.replace( '"zh"', '"ja"' ) ).render().root.find( 'html' )
    eq( root.hasClass( 'han-js-rendered' ), true )
    enteq( Hanio.html( root.find( 'title' )), '<title>A辭Q</title>' )
  })
})

desc( 'Normalisation', () => {
  let html, hio

  it( 'Adjacent decoration lines', () => {
    html = '<u>a</u><u>b</u>c<u>d</u><u>e</u>'
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 2 )

    html = `<u>註記元素甲</u><u>註記元素乙</u><u>註記元素丙</u><u>註記元素丁</u>`
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 3 )

    html = `<u>註記元素甲</u><ins>增訂元素甲</ins><u>註記元素乙</u>一般文字節點<ins>增訂元素乙</ins><u>註記元素丙</u><ins>增訂元素丙</ins>一般文字節點；<s>訛訊元素甲</s><del>刪訂元素甲</del><s>訛訊元素乙</s>一般文字節點<del>刪訂元素乙</del><s>訛訊元素乙</s><del>刪訂元素丙</del>。`
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 2 )
    eq(  hio.root.find( 'ins.adjacent' ).length, 2 )

    html = `<u>註記元素</u><s>訛訊元素</s><ins>增訂元素</ins><del>刪訂元素</del>。`
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( '.adjacent' ).length, 0 )

    html = `<u>註記元素</u><ins>增訂元素</ins><s>訛訊元素</s><del>刪訂元素</del>。`
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 0 )
    eq(  hio.root.find( 'ins.adjacent' ).length, 1 )
    eq(  hio.root.find( 's.adjacent' ).length, 0 )
    eq(  hio.root.find( 'del.adjacent' ).length, 1 )

    // Ignorable:
    html = '<u>a</u><u>b</u><wbr><u>d</u><u>e</u>'
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 3 )

    html = '<u>a</u><u>b</u><!--c--><u>d</u><u>e</u>'
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 3 )

    html = '<u>a</u><u>b</u><!--c--><wbr><wbr><!--c--><u>d</u><u>e</u>'
    hio  = Hanio( html ).renderElmt()
    eq(  hio.root.find( 'u.adjacent' ).length, 3 )
  })

  it( 'Emphasis marks', () => {
    html = '<em>測試test</em>'
    hio  = Hanio( html ).renderEm()
    htmleq( hio.html, '<em><h-char class="eastasian cjk hanzi">測</h-char><h-char class="eastasian cjk hanzi">試</h-char><h-word class="western"><h-char class="alphabet western latin">t</h-char><h-char class="alphabet western latin">e</h-char><h-char class="alphabet western latin">s</h-char><h-char class="alphabet western latin">t</h-char></h-word></em>' )

    html = '<p>（測試）<em>「測『試』」，test ‘this!’。</em>test.'
    hio  = Hanio( html ).renderEm()
    htmleq( hio.html, '<p>（測試）<em><h-jinze class="tou"><h-char unicode="300c" class="biaodian cjk bd-open">「</h-char><h-char class="eastasian cjk hanzi">測</h-char></h-jinze><h-jinze class="touwei"><h-char unicode="300e" class="biaodian cjk bd-open">『</h-char><h-char class="eastasian cjk hanzi">試</h-char><h-char unicode="300f" class="biaodian cjk bd-close bd-end">』</h-char><h-char unicode="300d" class="biaodian cjk bd-close bd-end">」</h-char><h-char unicode="ff0c" class="biaodian cjk bd-end">，</h-char></h-jinze><h-word class="western"><h-char class="alphabet western latin">t</h-char><h-char class="alphabet western latin">e</h-char><h-char class="alphabet western latin">s</h-char><h-char class="alphabet western latin">t</h-char></h-word> <h-word class="western"><h-char class="punct">‘</h-char><h-char class="alphabet western latin">t</h-char><h-char class="alphabet western latin">h</h-char><h-char class="alphabet western latin">i</h-char><h-char class="alphabet western latin">s</h-char><h-char class="punct">!</h-char></h-word><h-jinze class="wei"><h-word class="western"><h-char class="punct">’</h-char></h-word><h-char unicode="3002" class="biaodian cjk bd-end">。</h-char></h-jinze></em>test.</p>' )

    html = '你<em>你𫞵𫞦𠁻𠁶〇我⼌⿕⺃⻍他⻰⻳⿸⿷⿳</em>我'
    hio  = Hanio( html ).renderEm()
    eq( hio.root.find( 'h-char.cjk' ).length, 17 )

    html =  'xxx<em>¡Hola! Ὅμηρος Свети</em>yyy'
    hio  = Hanio( html ).renderEm()
    eq( hio.root.find( 'h-word.western' ).length, 3 )
    eq( hio.root.find( 'h-char.punct' ).length, 2 )
    eq( hio.root.find( 'h-char.latin' ).length, 4 )
    eq( hio.root.find( 'h-char.kirillica' ).length, 5 )
    eq( hio.root.find( 'h-char.ellinika' ).length, 6 )
    eq( hio.root.find( 'h-char.alphabet' ).length, 4+5+6 )
  })

  it( 'Interlinear annotations (ruby)', () => {
    // Basic:
    html = '<ruby>字<rt>zi</ruby>'
    hio  = Hanio( html ).renderRuby()
    htmleq( hio.html, '<h-ruby><h-ru annotation="true">字<rt>zi</rt></h-ru></h-ruby>' )

    html = '<ruby><a>字</a><b>體</b><rt>typeface</ruby>'
    hio  = Hanio( html ).renderRuby()
    htmleq( hio.html, '<h-ruby><h-ru annotation="true"><a>字</a><b>體</b><rt>typeface</rt></h-ru></h-ruby>' )

    // Zhuyin ruby:
    html = `
<ruby class="mps">
  事<rt>ㄕˋ</rt>情<rt>ㄑㄧㄥˊ</rt>
  看<rt>ㄎㄢˋ</rt>
  冷<rt>ㄌㄥˇ</rt>暖<rt>ㄋㄨㄢˇ</rt>
</ruby>
    `
    hio = Hanio( html ).renderRuby()
    eq( hio.root.find( 'h-ruby.zhuyin' ).length, 1 )
    eq( hio.root.find( 'h-ru[zhuyin]' ).length, 5 )
    eq( hio.root.find( 'h-ru h-zhuyin' ).length, 5 )
    eq( hio.root.find( 'h-ru [length="3"]' ).length, 2 )

    // Complex ruby:
    html = `
<p>
  <ruby class="complex">
    辛亥革命發生在<rb>1911-</rb><rb>10-</rb><rb>10，</rb>
      <rtc><rt>年</rt><rt>月</rt><rt>日</rt></rtc>
      <rtc><rt rbspan="3">清宣統三年</rt></rtc>
    那天革命先烈們一同推翻了帝制。
  </ruby>
</p>
    `
    hio = Hanio( html ).renderRuby()
    const lv1 = hio.root.find(  'h-ruby > h-ru'  )
    const lv2 = hio.root.find(  'h-ruby > h-ru > h-ru'  )
    eq( hio.root.find( 'rtc' ).length, 0 )
    eq( lv1.length, 1 )
    eq( lv1.eq(0).attr( 'span' ), 3 )
    htmleq( $.html( hio.root.find( 'h-ruby > h-ru > rt' )), '<rt rbspan="3">清宣統三年</rt>' )
    eq( lv2.length, 3 )
    eq( lv2.eq(0).attr( 'span' ), 1 )
    htmleq( Hanio.html( lv1.find( 'rt' ).eq(2)), '<rt>日</rt>' )

{
    html = `
<p>
  <ruby class="complex">
    「<rb>紐</rb><rb>約</rb><rb>市</rb>」
    <rtc class="reading romanization">
      <rt rbspan="2">Niǔyuē</rt><rt>Shì</rt>
    </rtc>
    <rtc class="reading annotation">
      <rt rbspan="3">New York City</rt>
    </rtc>
  </ruby>

  <ruby class="complex">
    『<rb>紐</rb><rb>約</rb><rb>市</rb>』
    <rtc class="reading annotation">
      <rt rbspan="3">New York City</rt>
    </rtc>
    <rtc class="reading romanization">
      <rt rbspan="2">Niǔyuē</rt><rt>Shì</rt>
    </rtc>
  </ruby>

  <ruby class="complex">
    ‘<rb>紐</rb><rb>約</rb><rb>市</rb>’
    <rtc class="reading annotation">
      <rt rbspan="3">New York City</rt>
    </rtc>
    <rtc class="reading romanization">
      <rt>niǔ</rt><rt>yuē</rt><rt>shì</rt></rtc>
  </ruby>

  <ruby class="complex">
    &#x201E;<rb>紐</rb><rb>約</rb><rb>市</rb>&#x201F;
    <rtc class="reading romanization">
      <rt>niǔ</rt><rt>yuē</rt><rt>shì</rt>
    </rtc>
    <rtc class="reading annotation">
      <rt rbspan="3">New York City</rt>
    </rtc>
  </ruby>

  <ruby class="complex">
    ⸘<rb>紐</rb><rb>約</rb><rb>市</rb>‽
    <rtc class="reading annotation">
      <rt rbspan="3">New York City</rt>
    </rtc>
    <rtc class="reading annotation">
      <rt rbspan="3">世界之都</rt>
    </rtc>
    </ruby>。
<p>
  <ruby class="complex">
    <rb>三</rb><rb>十</rb><rb>六</rb><rb>個</rb><rb>牙</rb><rb>齒</rb>，
    <rb>捉</rb><rb>對</rb><rb>兒</rb><rb>廝</rb><rb>打</rb>！

    <rtc class="romanization">
      <rt>san1</rt><rt>shih2</rt><rt>liu4</rt><rt>ko0</rt><rt>ya2</rt><rt>ch\'ih3</rt><rt>cho1</rt><rt rbspan="2">tuirh4</rt><rt>ssu1</rt><rt>ta3</rt>
    </rtc>
    <rtc class="romanization">
      <rt>sān</rt><rt>shí</rt><rt>liù</rt><rt>ge</rt><rt>yá</rt><rt>chǐ</rt><rt>zhuō</rt><rt rbspan="2">duìr</rt><rt>sī</rt><rt>dǎ</rt>
    </rtc>
  </ruby>
    `

    hio = Hanio( html ).renderRuby()

    const root = hio.root
    eq( root.find( 'h-ruby[doubleline]' ).length, 6 )
    eq( root.find( 'rtc' ).length, 0 )
    eq( root.find( 'h-ruby > h-ru'  ).length, 15 )
    eq( root.find( 'h-ruby > h-ru > h-ru'  ).length, 21 )
    enteq(
      Array.from( root.find( 'p:last-child' ).find( 'rb, rt' ))
        .map( it => $( it ).text())
        .join(),
      '三,san1,sān,十,shih2,shí,六,liu4,liù,個,ko0,ge,牙,ya2,yá,齒,ch\'ih3,chǐ,捉,cho1,zhuō,對,兒,tuirh4,duìr,廝,ssu1,sī,打,ta3,dǎ'
    )
}

  // Triaxial ruby:
{
  html = `
<p>
  <ruby class="complex">
  <rb>一</rb>
  <rb>人</rb>
  <rb>煩</rb>
  <rb>惱</rb>
  <rb>一</rb>
  <rb>樣</rb>。

  <rtc class="zhuyin">
    <rt>ㄐㄧㆵ͘</rt>
    <rt>ㄌㄤˊ</rt>
    <rt>ㄏㄨㄢˊ</rt>
    <rt>ㄌㄜˋ</rt>
    <rt>ㄐㄧㆵ͘</rt>
    <rt>ㄧㆫ˫</rt>
  </rtc>

  <rtc class="romanization">
    <rt>Chi̍t</rt>
    <rt>lâng</rt>
    <rt rbspan="2">hoân‑ló</rt>
    <rt>chi̍t</rt>
    <rt>iūⁿ</rt>
  </rtc>

  <rtc class="romanization">
    <rt>Tsi̍t</rt>
    <rt>lâng</rt>
    <rt rbspan="2">huân-ló</rt>
    <rt>tsi̍t</rt>
    <rt>iūnn</rt>
    </rtc>
  </ruby>
</p>
  `
    hio = Hanio( html ).renderRuby()
    const root = hio.root

    eq( root.find( 'rtc' ).length, 0 )
    eq(
      Array.from( root.find( 'rb, h-zhuyin, rt' ))
        .map( it => $( it ).text() )
        .join(),
      '一,ㄐㄧㆵ͘,Chi̍t,Tsi̍t,人,ㄌㄤˊ,lâng,lâng,煩,ㄏㄨㄢˊ,惱,ㄌㄜˋ,hoân‑ló,huân-ló,一,ㄐㄧㆵ͘,chi̍t,tsi̍t,樣,ㄧㆫ˫,iūⁿ,iūnn'
    )
}
  })
})

desc( 'Typesets (inline)', () => {
  let html, hio

  it( 'Biaodian correction', () => {
  })

  it( 'Hanzi-Western script mixed spacing (HWS)', () => {
    html = `測試test測試123測試`
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '測試<h-hws hidden> </h-hws>test<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>123<h-hws hidden> </h-hws>測試' )

    html = '中文加上 <code>some code</code>，中文加上 <code>some code</code> 放在中間，<code>some code</code> 加上中文，一般的 English。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '中文加上 <code>some code</code>，中文加上 <code>some code</code> 放在中間，<code>some code</code> 加上中文，一般的 English。' )

    html = '中文加上<code>some code</code>，中文加上<code>some code</code>放在中間，<code>some code</code>加上中文，一般的English。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '中文加上<h-hws hidden> </h-hws><code>some code</code>，中文加上<h-hws hidden> </h-hws><code>some code</code><h-hws hidden> </h-hws>放在中間，<code>some code</code><h-hws hidden> </h-hws>加上中文，一般的<h-hws hidden> </h-hws>English。' )

    // Strict mode
    html = '測試 test 測試 123 測試<code>測試 test測試。</code>'
    hio  = Hanio( html ).renderHWS( true )
    htmleq( hio.html, '測試<h-hws hidden> </h-hws>test<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>123<h-hws hidden> </h-hws>測試<code>測試 test測試。</code>' )

    // With Biaodian
    html = '測試，test測試123。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '測試，test<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>123。' )

    // Greek letters
    html = '測試α測試β測試'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '測試<h-hws hidden> </h-hws>α<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>β<h-hws hidden> </h-hws>測試' )

    // Cyrillic letters
    html = 'я測試у測試ь測試в'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, 'я<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>у<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>ь<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>в' )

    // All CJK-related blocks
    html = 'A㐀a㘻a䶵a𠀀a𫠝a〇a⿸a⻍a⻰aのa'
    hio  = Hanio( html ).renderHWS()
    eq( hio.context.find( 'h-hws' ).length, 20 )

    // Combining characters
    html = '天然ê上好。荷Ὅ̴̊̌ηρος̃馬。貓К҉о҈ш҉к҈а҈咪。'
    hio  = Hanio( html ).renderHWS()
    eq( hio.context.find( 'h-hws' ).length, 6 )

    // Cross-boundary
    html = '去<u>Europe</u>旅行。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '去<h-hws hidden> </h-hws><u>Europe</u><h-hws hidden> </h-hws>旅行。' )

    // With comments or `<wbr>`
    html = '去<!-- x -->Europe<wbr><!---->旅行。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '去<h-hws hidden> </h-hws><!-- x -->Europe<h-hws hidden> </h-hws><wbr><!---->旅行。' )

    // Edge cases
    html = '測試¿測試?測試¡測試!為‘什’麼;為“什”麼?'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '測試<h-hws hidden> </h-hws>¿測試?<h-hws hidden> </h-hws>測試<h-hws hidden> </h-hws>¡測試!<h-hws hidden> </h-hws>為‘什’麼;<h-hws hidden> </h-hws>為“什”麼?' )

    html = `<p>單'引'號、單'引'號和雙"引"號和單'引'號和雙"引"號.`
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, `<p>單<h-hws hidden> </h-hws>'引'<h-hws hidden> </h-hws>號、單<h-hws hidden> </h-hws>'引'<h-hws hidden> </h-hws>號和雙<h-hws hidden> </h-hws>"引"<h-hws hidden> </h-hws>號和單<h-hws hidden> </h-hws>'引'<h-hws hidden> </h-hws>號和雙<h-hws hidden> </h-hws>"引"<h-hws hidden> </h-hws>號.</p>` )

    html = `'單x引x號'"雙x引x號".`
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, `'單<h-hws hidden> </h-hws>x<h-hws hidden> </h-hws>引<h-hws hidden> </h-hws>x<h-hws hidden> </h-hws>號'"雙<h-hws hidden> </h-hws>x<h-hws hidden> </h-hws>引<h-hws hidden> </h-hws>x<h-hws hidden> </h-hws>號".` )

    html = '你是咧com<u><i>啥物</i></u>plain啦！'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '你是咧<h-hws hidden> </h-hws>com<h-hws hidden> </h-hws><u><i>啥物</i></u><h-hws hidden> </h-hws>plain<h-hws hidden> </h-hws>啦！' )

    html = '<u class="pn">美國</u><span lang="en">Chicago</span><em>是</em>這架飛船的目的地。'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '<u class="pn">美國</u><h-hws hidden> </h-hws><span lang="en">Chicago</span><h-hws hidden> </h-hws><em>是</em>這架飛船的目的地。' )

    html = '<p>不知道是不是<u lang="en"><!-- comment --><wbr><!-- comment --><wbr><!-- comment -->like this</u>你用「元件檢閱器」看看。</p>'
    hio  = Hanio( html ).renderHWS()
    htmleq( hio.html, '<p>不知道是不是<h-hws hidden> </h-hws><u lang="en"><!-- comment --><wbr><!-- comment --><wbr><!-- comment -->like this</u><h-hws hidden> </h-hws>你用「元件檢閱器」看看。</p>' )
  })

  it( 'Hanging Biaodian', () => {
    html = '點、點，點。點．'
    hio  = Hanio( html ).renderHanging()
    htmleq( hio.html, '點<h-hangable><h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">、</h-char></h-cs></h-hangable>點<h-hangable><h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">，</h-char></h-cs></h-hangable>點<h-hangable><h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">。</h-char></h-cs></h-hangable>點<h-hangable><h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">．</h-char></h-cs></h-hangable>' )

    // Not hangable
    html = '「標點。」'
    hio  = Hanio( html ).renderHanging()
    htmleq( hio.html, '「標點。」' )

    html = '標點……。'
    hio  = Hanio( html ).renderHanging()
    htmleq( hio.html, '標點<h-hangable>……<h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">。</h-char></h-cs></h-hangable>' )

    html = '「標點」。'
    hio  = Hanio( html ).renderHanging()
    htmleq( hio.html, '「標點<h-hangable>」<h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">。</h-char></h-cs></h-hangable>' )

    html = '<span>「標『點』」</span>。'
    hio  = Hanio( html ).renderHanging()
    htmleq( hio.html, '<span>「標『點<h-hangable>』」<h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">。</h-char></h-cs></h-hangable></span>' )
  })

  it( 'Consecutive Biaodian (Jiya)', () => {
    html = '「字『字』？」字「字『字』」字？'
    hio  = Hanio( html ).renderJiya()
    htmleq( hio.html, '' )

    html = '字、「字」字，（字）字……「字」。'
    hio  = Hanio( html ).renderJiya()

    html = '《書名》〈篇名〉（內容）'
    hio  = Hanio( html ).renderJiya()
  })
})

/*
desc( '', () => {
  it( '', () => {
  })
})
*/

