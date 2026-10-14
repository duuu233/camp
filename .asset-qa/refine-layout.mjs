import fs from 'node:fs'
const read = p => fs.readFileSync(p,'utf8').replaceAll('\r\n','\n')
const write = (p,s) => fs.writeFileSync(p,s)
// Original, locally packaged line icons: no CDN, font, or runtime network dependency.
const icons = {
  home: '<path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  packages: '<path d="m3 9 9-6 9 6M4 9h16M5 9v12M19 9v12M8 13h8v5H8zM9 18v3M15 18v3M12 3V1"/>',
  ingredients: '<path d="M5 3v5a3 3 0 0 0 6 0V3M8 3v18M19 21V3c-4 3-4 9 0 10"/>',
  mine: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  delivery: '<path d="M2 5h12v12H2zM14 9h4l4 5v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  pickup: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  planning: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16m-12 5 3 3 5-5"/>'
}
fs.mkdirSync('static/icons',{recursive:true})
for (const [name,body] of Object.entries(icons)) {
  for (const [suffix,color] of [['','#758078'],['-active','#243e35']]) {
    write(`static/icons/${name}${suffix}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`)
  }
}
let home = read('pages/index/index.vue')
home = home.replace("import CustomerServiceButton from '../../components/CustomerServiceButton.vue'", "import HomeHero from '../../components/HomeHero.vue'\nimport CampIcon from '../../components/CampIcon.vue'")
home = home.replace("const heroLogoImage = useImageUrl(() => brand.logos.white)\n",'')
home = home.replace(/    <view class="hero-card">[\s\S]*?\n    <view class="content">/,'    <HomeHero @browse="goPackages" />\n\n    <view class="content">')
home = home.replace(/\n\.hero-[\s\S]*?\n\.content \{/,'\n.content {')
home = home.replace('<text class="service-badge">{{ service.badge }}</text>', '<CampIcon :name="service.id" active />')
home = home.replace('title="精选 BBQ 套餐"','title="按人数，选一套装备"').replace('subtitle="人数、炉具、桌椅、天幕和氛围灯一套配齐"','subtitle="从两人小聚到多人同行，装备按需配齐"')
home = home.replace('subtitle="适合年轻朋友聚会、女生小团体、亲子家庭和公司团建"','subtitle="取还、配送与活动布置，提前安排妥当"')
home = home.replace('height: 894rpx;', 'height: 440rpx;')
home = home.replace('<image\n          class="housekeeping-image"', '<text class="housekeeping-hint" @tap="previewHousekeepingRules">点击交付卡，放大查看服务细则 ↗</text>\n        <image\n          class="housekeeping-image"')
home = home.replace('font-size: 36rpx;\n  font-weight: 600;\n  line-height: 40rpx;', "font-family: var(--camp-display-font);\n  letter-spacing: 4rpx;\n  font-size: 38rpx;\n  font-weight: 600;\n  line-height: 44rpx;")
home = home.replace('font-size: 18rpx;', 'font-size: 21rpx;')
home = home.replace('grid-template-columns: repeat(3, 1fr);','grid-template-columns: repeat(3, minmax(0, 1fr));').replace('padding: 22rpx;', 'padding: 24rpx 18rpx;').replace('font-size: 29rpx;', 'font-size: 27rpx;')
home = home.replace(/\n\.service-badge \{[^}]+\}\n/,'')
home = home.replace('</style>', '.housekeeping-hint { display: block; padding: 0 24rpx 18rpx; font-size: 24rpx; line-height: 36rpx; color: var(--camp-accent); }\n</style>')
write('pages/index/index.vue',home)
let tabs = read('components/CampTabBar.vue').replace('<script setup>','<script setup>\nimport CampIcon from \'./CampIcon.vue\'')
tabs = tabs.replace(/, icon: '[^']+'/g,'').replace(/,\n    icon: '[^']+'/g,'')
tabs = tabs.replace('<view\n        v-for="tab in tabs"','<button\n        v-for="tab in tabs"').replace('        @tap="goTab(tab)"','        hover-class="tab-item--hover"\n        :aria-label="tab.label"\n        @tap="goTab(tab)"')
tabs = tabs.replace('<text>{{ tab.icon }}</text>', '<CampIcon :name="tab.id" :active="active === tab.id" />').replace('        <text class="tab-label">{{ tab.label }}</text>\n      </view>', '        <text class="tab-label">{{ tab.label }}</text>\n      </button>')
tabs = tabs.replace(/<style scoped>[\s\S]*?<\/style>/,`<style scoped>
.camp-tabbar { position: fixed; right: 0; bottom: 0; left: 0; z-index: 80; padding-bottom: env(safe-area-inset-bottom); background: var(--camp-surface); }
.tab-line { height: 1rpx; background: var(--camp-line); }
.tab-inner { display: flex; align-items: center; height: 112rpx; padding: 0 24rpx; }
.tab-item { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; min-width: 0; height: 100%; margin: 0; padding: 12rpx 0; border-radius: 0; background: transparent; color: var(--camp-muted); }
.tab-item::after { border: 0; }
.tab-icon { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 46rpx; margin-bottom: 6rpx; border-radius: 12rpx; }
.tab-label { font-size: 23rpx; font-weight: 500; line-height: 32rpx; }
.tab-item--active { color: var(--camp-brand); }
.tab-item--active .tab-icon { background: var(--camp-soft); }
.tab-item--hover { opacity: 0.75; }
</style>`)
write('components/CampTabBar.vue',tabs)
let pickup = read('components/PickupLocationCard.vue').replace('<script setup>','<script setup>\nimport CampIcon from \'./CampIcon.vue\'').replace('<text>取</text>','<CampIcon name="pickup" :active="tone !== \'dark\'" />')
write('components/PickupLocationCard.vue',pickup)
let card = read('components/PackagePosterCard.vue')
const imageStart = card.indexOf('    <image\n')
const imageEnd = card.indexOf('    <view class="package-info">',imageStart)
const image = card.slice(imageStart,imageEnd).replace('mode="aspectFit"','mode="aspectFit"\n        lazy-load')
card = card.slice(0,imageStart) + card.slice(imageEnd)
const featuresEnd = card.indexOf('      <button\n        class="contact-btn"')
card = card.slice(0,featuresEnd) + `      <view class="package-media">
${image.trimEnd()}
        <text class="preview-label" @tap="previewPoster">查看完整配置与报价 ↗</text>
      </view>
` + card.slice(featuresEnd)
card = card.replace('微信客服咨询','咨询此套餐')
card = card.replace(/<style scoped>[\s\S]*?<\/style>/,`<style scoped>
.package-card { overflow: hidden; border: 1rpx solid var(--camp-line); border-radius: var(--camp-radius); background: var(--camp-surface); }
.package-card--compact { width: 530rpx; flex: 0 0 auto; margin-right: 20rpx; white-space: normal; }
.package-info { padding: 28rpx; }
.package-head { display: flex; flex-direction: column; }
.package-copy { display: flex; flex-direction: column; min-width: 0; }
.package-people { color: var(--camp-accent); font-size: 23rpx; font-weight: 600; line-height: 32rpx; }
.package-title { margin-top: 8rpx; color: var(--camp-ink); font-size: 32rpx; font-weight: 600; line-height: 46rpx; }
.package-scene { margin-top: 6rpx; color: var(--camp-muted); font-size: 24rpx; line-height: 36rpx; }
.package-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8rpx 16rpx; margin-top: 20rpx; padding-top: 20rpx; border-top: 1rpx solid var(--camp-line); }
.price-main { color: var(--camp-brand); font-size: 36rpx; font-weight: 600; line-height: 46rpx; font-variant-numeric: tabular-nums; }
.price-sub { color: var(--camp-muted); font-size: 22rpx; line-height: 34rpx; }
.feature-row { display: flex; flex-wrap: wrap; margin-top: 18rpx; gap: 8rpx; }
.feature-chip { padding: 5rpx 12rpx; border-radius: 6rpx; background: var(--camp-bg); color: var(--camp-muted); font-size: 22rpx; line-height: 30rpx; }
.package-media { margin-top: 24rpx; padding: 16rpx; border: 1rpx solid var(--camp-line); border-radius: 12rpx; }
.package-poster { display: block; width: 100%; height: 440rpx; background: #fff; }
.preview-label { display: block; margin-top: 12rpx; text-align: center; color: var(--camp-muted); font-size: 23rpx; line-height: 36rpx; }
.contact-btn { height: 76rpx; margin: 24rpx 0 0; padding: 0; border-radius: 12rpx; background: var(--camp-brand); color: #fffdf6; font-size: 26rpx; font-weight: 500; line-height: 76rpx; }
.contact-btn::after { border: 0; }
.contact-btn--hover { opacity: 0.85; }
.package-card--compact .package-poster { height: 260rpx; }
.package-card--compact .package-title { min-height: 92rpx; }
.package-card--compact .package-price { min-height: 110rpx; align-content: flex-start; }
.package-card--compact .feature-row { min-height: 84rpx; }
</style>`)
write('components/PackagePosterCard.vue',card)
console.log('Home hero, catalog layout and local icons updated')
