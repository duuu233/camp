export const cloudEnvId = 'cloudbase-d3gh9k47wa7fbd8bd'
export const cloudStoragePrefix =
  'cloud://cloudbase-d3gh9k47wa7fbd8bd.636c-cloudbase-d3gh9k47wa7fbd8bd-1433444569/'

export function cloudAsset(fileName) {
  return `${cloudStoragePrefix}${fileName}`
}

export function ingredientAsset(fileName) {
  return `${cloudStoragePrefix}Ingredients/${fileName}`
}

export const brand = {
  name: '暮山川',
  tagline: '露营租赁 · 活动策划',
  city: '南宁市',
  logo: cloudAsset('logo-mark.png'),
  logos: {
    mark: cloudAsset('logo-mark.png'),
    white: cloudAsset('logo-white.png'),
    wordmarkWhite: cloudAsset('logo-wordmark-white.png'),
    full: cloudAsset('logo-white.png')
  }
}

export const hero = {
  eyebrow: 'OUTDOOR BBQ RENTAL',
  title: '把户外 BBQ 的氛围感，交给暮山川',
  subtitle:
    '烧烤炉、天幕桌椅、露营灯、燃气和聚会套餐一次配齐，适合闺蜜小聚、情侣约会、家庭露营和公司团建。',
  poster: cloudAsset('package-4p.png'),
  chips: ['自驾可取', '同城配送', '套餐齐全']
}

export const equipmentDetails = {
  title: '设备单租价目',
  subtitle: '天幕、桌椅、炉具、灯具等单项设备价格一图查看，可按活动人数加配。',
  image: cloudAsset('equipment-details.png')
}

export const housekeepingRules = {
  title: '暮山川露营专属管家交付卡',
  subtitle: '交付、搭建、取还和售后服务说明，租赁前可先放大查看。',
  image: cloudAsset('housekeeping-rules.png')
}

export const pickupLocation = {
  title: '自提地址',
  name: '暮山川 BBQ 装备自提点',
  address: '南宁市良庆区瓦村路与良堤路交叉口正南方向85米左右',
  latitude: 22.74096,
  longitude: 108.44472,
  tip: '自提前请先和客服确认档期、取装时间和归还方式。'
}

export const packageGroups = [
  { id: 'all', label: '全部' },
  { id: 'date', label: '双人' },
  { id: 'friends', label: '好友局' },
  { id: 'mahjong', label: '麻将局' },
  { id: 'team', label: '团建' }
]

export const bbqPackages = [
  {
    id: 'p2',
    group: 'date',
    title: '北纬 22° 的晚风',
    people: '2人套餐',
    scene: '情侣约会 / 闺蜜小聚',
    price: '¥58/日',
    longRent: '长租低至 ¥48/日',
    image: cloudAsset('package-2p.png'),
    features: ['天幕', '桌椅', '卡式炉', '烤盘', '露营灯', '燃气']
  },
  {
    id: 'p4',
    group: 'friends',
    title: '4人雀时 · 户外轻享组',
    people: '4人套餐',
    scene: '好友聚会 / 周末露营',
    price: '¥68/日',
    longRent: '长租低至 ¥58/日',
    image: cloudAsset('package-4p.png'),
    features: ['大天幕', '四椅', '蛋卷桌', '炉具', '烤盘', '燃气']
  },
  {
    id: 'p4-mahjong',
    group: 'mahjong',
    title: '4人麻将 BBQ 套餐',
    people: '4人麻将局',
    scene: '下午茶 / 麻将 / 烧烤',
    price: '看海报报价',
    longRent: '桌椅炉具与麻将桌组合',
    image: cloudAsset('package-4p-mahjong.png'),
    features: ['麻将桌', '烧烤炉', '天幕', '桌椅', '露营灯']
  },
  {
    id: 'p6',
    group: 'friends',
    title: '6人好友 BBQ 套餐',
    people: '6人套餐',
    scene: '生日派对 / 好友局',
    price: '看海报报价',
    longRent: '适合半日到整日活动',
    image: cloudAsset('package-6p.png'),
    features: ['多人桌椅', '烧烤套装', '氛围灯', '燃气', '收纳箱']
  },
  {
    id: 'p8',
    group: 'team',
    title: '8人派对 BBQ 套餐',
    people: '8人套餐',
    scene: '小型团建 / 家庭聚会',
    price: '看海报报价',
    longRent: '可加配食材与活动物料',
    image: cloudAsset('package-8p.png'),
    features: ['大天幕', '多人桌椅', '烧烤炉', '照明', '燃气']
  },
  {
    id: 'p10',
    group: 'team',
    title: '10人山野 BBQ 套餐',
    people: '10人套餐',
    scene: '部门聚会 / 露营派对',
    price: '看海报报价',
    longRent: '多人活动推荐',
    image: cloudAsset('package-10p.png'),
    features: ['天幕组', '多套桌椅', '炉具', '灯具', '活动箱']
  },
  {
    id: 'p15',
    group: 'team',
    title: '15人大型团建套餐',
    people: '15人套餐',
    scene: '公司团建 / 户外活动',
    price: '看海报报价',
    longRent: '支持活动策划加配',
    image: cloudAsset('package-15p.png'),
    features: ['多人装备', '场景搭建', '烧烤设备', '氛围照明']
  }
]

export const ingredientPackages = [
  {
    id: 'meal-4',
    category: 'small',
    title: '4人套餐',
    subtitle: '轻量烧烤食材，适合家庭和好友小聚',
    tag: '4人',
    layout: 'standard',
    image: ingredientAsset('meal-4-package.png')
  },
  {
    id: 'meal-4-6',
    category: 'small',
    title: '4-6人餐',
    subtitle: '周末露营、朋友聚餐的基础食材组合',
    tag: '4-6人',
    layout: 'standard',
    image: ingredientAsset('meal-4-6-package.png')
  },
  {
    id: 'meal-6-7',
    category: 'small',
    title: '6-7人套餐',
    subtitle: '适合生日派对和中小型户外烧烤',
    tag: '6-7人',
    layout: 'standard',
    image: ingredientAsset('meal-6-7-package.png')
  },
  {
    id: 'meal-8',
    category: 'small',
    title: '8人套餐',
    subtitle: '多人聚餐配置，食材明细与价格见海报',
    tag: '8人',
    layout: 'standard',
    image: ingredientAsset('meal-8-package.png')
  },
  {
    id: 'meal-10-12',
    category: 'party',
    title: '10-12人餐',
    subtitle: '朋友聚会、小型团建的多人食材方案',
    tag: '10-12人',
    layout: 'standard',
    image: ingredientAsset('meal-10-12-package.png')
  },
  {
    id: 'meal-16',
    category: 'party',
    title: '16人餐',
    subtitle: '团队聚餐与公司活动推荐配置',
    tag: '16人',
    layout: 'standard',
    image: ingredientAsset('meal-16-package.png')
  },
  {
    id: 'meal-20-25',
    category: 'party',
    title: '20-25人餐',
    subtitle: '大型团建、户外活动食材配置',
    tag: '20-25人',
    layout: 'standard',
    image: ingredientAsset('meal-20-25-package.png')
  },
  {
    id: 'meat-lover',
    category: 'addon',
    title: '纯肉肉套餐',
    subtitle: '烧烤加肉与肉食补充组合',
    tag: '加配',
    layout: 'tall',
    image: ingredientAsset('meat-lover-package.png')
  },
  {
    id: 'steak-picnic',
    category: 'addon',
    title: '牛排野餐盒',
    subtitle: '轻露营、野餐场景的精致食材加配',
    tag: '野餐盒',
    layout: 'tall',
    image: ingredientAsset('steak-picnic-box.png')
  }
]

export const serviceCards = [
  {
    id: 'delivery',
    title: '同城配送',
    subtitle: '送到指定地点，归还时可约取回',
    badge: '省心'
  },
  {
    id: 'pickup',
    title: '自提自还',
    subtitle: '良庆区自提点可导航，到店取还更灵活',
    badge: '灵活'
  },
  {
    id: 'planning',
    title: '活动策划',
    subtitle: '生日、求婚、团建可补充布置方案',
    badge: '定制'
  }
]

export const rentalSteps = [
  { id: 'choose', title: '选套餐', detail: '按人数和场景挑选 BBQ 装备' },
  {
    id: 'contact',
    title: '问档期',
    detail: '通过微信客服确认时间、地点和加配'
  },
  { id: 'receive', title: '取装备', detail: '支持同城配送，也可导航到良庆区自提点取用' },
  { id: 'return', title: '轻松还', detail: '按约定时间归还并清点' }
]

export const profileGroups = [
  {
    id: 'service',
    items: [
      { id: 'guide', label: '租赁说明', value: '押金、取还、清洁规则' },
      { id: 'cooperation', label: '团建合作', value: '公司活动与多人方案' },
      { id: 'planning', label: '活动策划', value: '布置、拍摄、食材加配' }
    ]
  },
  {
    id: 'about',
    items: [
      { id: 'feedback', label: '反馈建议', value: '帮助我们优化体验' },
      { id: 'agreement', label: '服务协议', value: '租赁与使用规则' },
      { id: 'privacy', label: '隐私政策', value: '用户信息说明' }
    ]
  }
]
