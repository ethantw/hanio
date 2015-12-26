
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
    htmleq( hio.html, '<p>（測試）<em><h-jinze class="tou"><h-char unicode="300c" class="biaodian cjk bd-open">「</h-char><h-char class="eastasian cjk hanzi">測</h-char></h-jinze><h-jinze class="touwei"><h-char unicode="300e" class="biaodian cjk bd-open">『</h-char><h-char class="eastasian cjk hanzi">試</h-char><h-char-group class="biaodian cjk"><h-char unicode="300f" class="biaodian cjk bd-close bd-end">』</h-char><h-char unicode="300d" class="biaodian cjk bd-close bd-end">」</h-char><h-char unicode="ff0c" class="biaodian cjk bd-close bd-end">，</h-char></h-char-group></h-jinze><h-word class="western"><h-char class="alphabet western latin">t</h-char><h-char class="alphabet western latin">e</h-char><h-char class="alphabet western latin">s</h-char><h-char class="alphabet western latin">t</h-char></h-word> <h-word class="western"><h-char class="punct">‘</h-char><h-char class="alphabet western latin">t</h-char><h-char class="alphabet western latin">h</h-char><h-char class="alphabet western latin">i</h-char><h-char class="alphabet western latin">s</h-char><h-char class="punct">!</h-char></h-word><h-jinze class="wei"><h-word class="western"><h-char class="punct">’</h-char></h-word><h-char unicode="3002" class="biaodian cjk bd-close bd-end">。</h-char></h-jinze></em>test.</p>' )

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

/*
desc( '', () => {
  it( '', () => {
  })
})
*/

