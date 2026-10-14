import fs from 'node:fs'
const read = p => fs.readFileSync(p, 'utf8').replaceAll('\r\n', '\n')
const write = (p, s) => fs.writeFileSync(p, s)
const files = ['App.vue', ...fs.readdirSync('components').filter(p => p.endsWith('.vue')).map(p => `components/${p}`), ...['index','packages','ingredients','mine','rental'].map(p => `pages/${p}/index.vue`)]
// Rewrite existing declarations, rather than layering a second theme over old CSS.
for (const file of files) {
  let source = read(file)
  source = source.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => {
    css = css.replace(/font-weight:\s*(\d+);/g, (_, n) => `font-weight: ${+n >= 800 ? 600 : +n >= 600 ? 500 : n};`)
      .replace(/box-shadow:\s*[^;]+;/g, 'box-shadow: none;')
      .replace(/(?:-webkit-)?backdrop-filter:\s*[^;]+;\n?/g, '')
      .replace(/border-radius:\s*(\d+)rpx;/g, (_, n) => `border-radius: ${+n >= 24 && +n < 100 ? 'var(--camp-radius)' : +n >= 100 ? '8rpx' : `${n}rpx`};`)
    const colors = { '#223d2d':'var(--camp-brand)', '#171b17':'var(--camp-ink)', '#fffdfa':'var(--camp-surface)', '#f2f5ef':'var(--camp-bg)', '#f2efe7':'var(--camp-soft)', '#c5973e':'var(--camp-accent)', '#9b7a3e':'var(--camp-accent)', '#73786f':'var(--camp-muted)', '#687164':'var(--camp-muted)', '#7b8077':'var(--camp-muted)' }
    for (const [a,b] of Object.entries(colors)) css = css.replaceAll(a,b)
    css = css.replace(/background:\s*[^;]*(?:radial-gradient|linear-gradient)[^;]*;/g, (value, offset) => {
      const selector = css.slice(0, offset).split('}').at(-1).split('{')[0].trim()
      if (selector === '.page') return 'background: var(--camp-bg);'
      if (/hero-mask/.test(selector)) return value
      if (/profile-card$|pickup-card--dark$|pickup-pin$|action--solid$|dialog-avatar-edit$|dialog-save-button$|qr-save$/.test(selector)) return 'background: var(--camp-brand);'
      if (/brand-lockup/.test(selector)) return 'background: var(--camp-accent);'
      if (/profile-body/.test(selector)) return 'background: rgba(255, 255, 255, 0.06);'
      if (/avatar-wrap|profile-button|sage/.test(selector)) return 'background: var(--camp-soft);'
      return 'background: var(--camp-surface);'
    })
    return `<style${attrs}>${css}</style>`
  })
  write(file, source)
}
function css(file, selector, values) {
  let s = read(file)
  const start = s.indexOf('<style')
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  let found = false
  s = s.slice(0,start) + s.slice(start).replace(new RegExp(`(^|\n)${escaped} \\{([^}]+)\\}`, 'g'), (_, before, body) => {
    found = true
    for (const [key,value] of Object.entries(values)) {
      const prop = new RegExp(`(^|\\n)\\s*${key}:\\s*[^;]+;`, 'g')
      body = body.replace(prop, '')
      if (value !== null) body += `\n  ${key}: ${value};`
    }
    return `${before}${selector} {${body.trimEnd()}\n}`
  })
  if (!found) s = s.replace('</style>', `${selector} {\n${Object.entries(values).filter(([,v]) => v !== null).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n</style>`)
  write(file,s)
}
let app = read('App.vue').replace('page {', `page {
  --camp-bg: #f6f5f1;
  --camp-surface: #ffffff;
  --camp-soft: #eeeee6;
  --camp-brand: #243e35;
  --camp-ink: #202c27;
  --camp-muted: #68736c;
  --camp-accent: #897044;
  --camp-line: #e2e5de;
  --camp-radius: 18rpx;
  --camp-display-font: 'Songti SC', 'STSong', 'SimSun', serif;`)
write('App.vue',app)
let config = JSON.parse(read('pages.json'))
config.globalStyle.navigationBarBackgroundColor = '#F6F5F1'
config.globalStyle.backgroundColor = '#F6F5F1'
write('pages.json',JSON.stringify(config,null,2)+'\n')
let scss = read('uni.scss').replace('#007aff','#243e35').replace('$uni-text-color:#333', '$uni-text-color:#202c27').replace('$uni-bg-color-grey:#f8f8f8','$uni-bg-color-grey:#f6f5f1').replace('$uni-border-color:#c8c7cc','$uni-border-color:#e2e5de')
write('uni.scss',scss)
for (const p of ['packages','ingredients','rental']) {
  const f = `pages/${p}/index.vue`
  css(f,'.head-title',{'font-family':'var(--camp-display-font)','font-weight':'600','font-size':'48rpx','letter-spacing':'2rpx'})
  css(f,'.head-copy',{'padding':p === 'rental' ? '36rpx 32rpx 12rpx' : '32rpx 32rpx 16rpx'})
  css(f,'.head-subtitle',{'font-size':'25rpx','line-height':'40rpx'})
}
for (const [p,prefix] of [['packages','filter'],['ingredients','category']]) {
  const f = `pages/${p}/index.vue`
  css(f,`.${prefix}-chip`,{'height':'76rpx','line-height':'76rpx','border':'0','background':'transparent','padding':'0 24rpx','margin':'0 8rpx 0 0','border-radius':'0','color':'var(--camp-muted)'})
  css(f,`.${prefix}-chip--active`,{'background':'transparent','color':'var(--camp-brand)','border-bottom':'4rpx solid var(--camp-brand)','font-weight':'600'})
  css(f,`.${prefix}-row`,{'padding':'0 32rpx 24rpx'})
}
css('components/SectionTitle.vue','.section-title',{'align-items':'center','margin':'52rpx 0 24rpx'})
css('components/SectionTitle.vue','.section-copy',{'flex':'1','padding-right':'16rpx'})
css('components/SectionTitle.vue','.section-heading',{'font-size':'36rpx','line-height':'48rpx','font-family':'var(--camp-display-font)','letter-spacing':'1rpx'})
css('components/SectionTitle.vue','.section-subtitle',{'font-size':'24rpx','line-height':'36rpx'})
css('components/SectionTitle.vue','.section-action',{'flex-shrink':'0','min-height':'72rpx','padding':'0 0 0 12rpx','color':'var(--camp-brand)'})
css('components/LocalProfileCard.vue','.logo-orbit',{'height':'180rpx','justify-content':'flex-start','padding':'28rpx 32rpx'})
css('components/LocalProfileCard.vue','.logo-mark',{'width':'132rpx','height':'132rpx'})
css('components/LocalProfileCard.vue','.profile-card::before',{'content':'none'})
css('components/LocalProfileCard.vue','.profile-body',{'margin':'0 24rpx 24rpx','padding':'24rpx 16rpx','flex-wrap':'wrap'})
css('components/LocalProfileCard.vue','.avatar-wrap',{'width':'88rpx','height':'88rpx'})
css('components/LocalProfileCard.vue','.avatar-img',{'width':'88rpx','height':'88rpx'})
css('components/LocalProfileCard.vue','.profile-name',{'font-size':'32rpx','line-height':'44rpx'})
css('components/LocalProfileCard.vue','.profile-action',{'min-width':'132rpx'})
css('components/LocalProfileCard.vue','.profile-button',{'width':'132rpx','font-size':'23rpx','color':'var(--camp-brand)'})
css('components/LocalProfileCard.vue','.profile-dialog',{'max-height':'90vh','overflow-y':'auto'})
css('components/PickupLocationCard.vue','.pickup-pin',{'background':'var(--camp-soft)','color':'var(--camp-brand)','width':'60rpx','height':'60rpx'})
css('components/PickupLocationCard.vue','.pickup-kicker',{'letter-spacing':'2rpx'})
css('components/PickupLocationCard.vue','.pickup-card--compact .pickup-kicker',{'display':'none'})
css('components/PickupLocationCard.vue','.pickup-card--compact .pickup-main',{'padding':'22rpx 24rpx 14rpx'})
css('components/PickupLocationCard.vue','.pickup-card--compact .pickup-actions',{'padding':'0 24rpx 22rpx 104rpx'})
css('pages/rental/index.vue','.rule-text',{'font-size':'26rpx','line-height':'44rpx'})
css('pages/rental/index.vue','.rule-index',{'border-radius':'0','background':'transparent','color':'var(--camp-accent)','font-size':'30rpx','font-family':'Georgia, serif'})
css('pages/rental/index.vue','.contact-panel',{'align-items':'stretch','flex-direction':'column','gap':'24rpx'})
css('components/AgreementDocument.vue','.head-title',{'font-family':'var(--camp-display-font)'})
css('components/WechatQrDialog.vue','.qr-dialog',{'max-height':'88vh','overflow-y':'auto','animation':'none'})
css('components/WechatQrDialog.vue','.qr-frame',{'width':'min(396rpx, 100%)','flex-shrink':'0'})
css('components/WechatQrDialog.vue','.qr-hint-dot',{'animation':'none'})
let qr = read('components/WechatQrDialog.vue').replace('      <view class="qr-glow"></view>\n','').replace('        <view class="qr-sheen"></view>\n','')
qr = qr.replace(/\n\.qr-(?:glow|sheen) \{[^}]+\}\n/g,'').replace(/\n@keyframes qr-(?:scan|blink|pop) \{[\s\S]*?\n\}\n/g,'')
write('components/WechatQrDialog.vue',qr)
let data = read('data/campData.js').replace("title: '把户外 BBQ 的氛围感，交给暮山川'", "title: '装备备齐，去山野相聚。'").replace('烧烤炉、天幕桌椅、露营灯、燃气和聚会套餐一次配齐，适合闺蜜小聚、情侣约会、家庭露营和公司团建。','从双人小聚到公司团建，天幕、桌椅、炉具与照明，一套配齐。')
write('data/campData.js', data)
for (const [f,a,b] of [
  ['pages/packages/index.vue','<text class="head-title">BBQ 套餐</text>','<text class="head-kicker">EQUIPMENT RENTAL</text>\n        <text class="head-title">户外装备租赁</text>'],
  ['pages/packages/index.vue','按人数选择海报套餐，具体档期、配送范围和加配内容可直接咨询微信客服。','按人数选装备，按场景自由加配。档期与配送范围，请先与客服确认。'],
  ['pages/ingredients/index.vue','新版食材图已把明细和价格整合到同一张海报里，点开图片可放大查看。','为山野聚餐备好食材。按人数挑选，可随设备套餐一起加配。'],
  ['pages/rental/index.vue','设备租借规则已整理成可直接阅读的页面，押金、取还、取消和赔付规则以此处说明为准。','出发前，了解预约、押金与取还约定，让每一次租用都心中有数。']
]) write(f,read(f).replace(a,b))
css('pages/packages/index.vue','.head-kicker',{'color':'var(--camp-accent)','font-size':'20rpx','letter-spacing':'3rpx','line-height':'30rpx','margin-bottom':'8rpx'})
css('pages/ingredients/index.vue','.head-kicker',{'letter-spacing':'3rpx'})
css('pages/ingredients/index.vue','.notice-bar',{'background':'var(--camp-soft)','border':'0'})
css('pages/ingredients/index.vue','.poster-image',{'height':'520rpx'})
css('pages/ingredients/index.vue','.poster-image--tall',{'height':'620rpx'})
write('pages/ingredients/index.vue',read('pages/ingredients/index.vue').replace('        <button\n          class="contact-btn"','        <text class="poster-preview-hint" @tap="previewPoster(item)">查看完整食材与报价 ↗</text>\n\n        <button\n          class="contact-btn"'))
css('pages/ingredients/index.vue','.poster-preview-hint',{'display':'block','padding':'18rpx 24rpx 0','text-align':'center','font-size':'24rpx','color':'var(--camp-muted)','line-height':'36rpx'})
console.log('Theme and existing components refined')
