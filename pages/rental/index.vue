<script setup>
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import {
  logImageRenderEvent,
  useCapsuleSafeArea,
  useCloudImageUrl
} from '../../composables/useCloudImageUrl.js'
import { brand } from '../../data/campData.js'

const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoImage = useCloudImageUrl(() => brand.logos.mark)

const quickNotes = [
  '默认价格为租借 24 小时的金额',
  '下单后 3 小时内确认预约信息',
  '预约未确认时可全额退款'
]

const ruleSections = [
  {
    id: 'booking',
    title: '预约与租期',
    items: [
      '默认商品金额为租借 24 小时的金额。',
      '支持同城配送，包括上门配送和上门归还；也支持到店取用。',
      '下单后商家将在 3 小时内与您确认预约信息，确认后视为完成预订。',
      '仅完成支付、但未完成预约确认时，预订无效，您可全额退款。'
    ]
  },
  {
    id: 'delivery',
    title: '配送与归还',
    items: [
      '下单时选择的地址将作为配送和归还的交接地点。',
      '若配送后地址发生变更，用户需支付额外配送费用。',
      '下单时展示的配送费用包含配送和归还运费。预估配送费：5 公里以内 20 元，5-10 公里 30 元；超过里程可能需要支付额外费用，具体请联系客服确认。'
    ]
  },
  {
    id: 'deposit',
    title: '交付与押金',
    items: [
      '同城配送或到店取用交付前，需要按商品采购金额的一定比例支付押金，具体以订单详情页展示为准。',
      '归还物品时，物品核验完成后将退还押金。',
      '6-8 人以下装备押金 200 元；10-20 人以下装备押金 500 元。',
      '用户收到装备的时间为开始租借时间。',
      '若选择到店取用，结束时间为到店归还装备的时间；若选择同城配送，结束时间为配送人员收到归还装备的时间。',
      '户外活动存在安全隐患，使用装备前需确认装备正常；若有异常请及时联系工作人员进行退换。'
    ]
  },
  {
    id: 'cancel',
    title: '违约与取消',
    items: [
      '若用户未按时归还，超时部分需按租赁设备的单位租金计费。例如超时 1 小时，超时费用为租借金额的 1/24。',
      '如需取消订单，可在预约使用前 3 小时提前申请退款或告知客服，订单可无责取消并全额退款。',
      '若提前 1-3 小时取消，需扣除订单总金额的 50% 作为装备取消手续费，不含押金。',
      '若未提前 1 小时取消，需扣除订单总金额的 100% 作为装备取消手续费，已支付订单费用不予退还，不含押金；已支付押金将原路退还。'
    ]
  },
  {
    id: 'damage',
    title: '损坏与脏污',
    items: [
      '租借物品出现轻微磕碰、破损时，用户无需赔偿。',
      '若物品有破损、磕碰、变形等物理损坏，但仍可正常使用，用户需按物品购买原价的一定比例赔偿；通常为 5%，最高不超过 20%。',
      '若物品有物理损坏且不可使用，或物品丢失，用户需按商品采购时的原价赔偿。',
      '若物品有脏污，清洗后可复原，用户无需赔偿。',
      '若物品有脏污且清洗后不可复原但仍可继续使用，用户需按物品原价的一定比例赔偿；通常为 5%，最高不超过 20%。'
    ]
  },
  {
    id: 'safety',
    title: '安全与合规',
    items: [
      '下单租借相关设备前，请先通过查询公开资料的方式，提前熟悉相关设备的使用场景及使用方法。',
      '使用设备时需严格遵守相关政府等机构的规定，确保安全、合规地使用设备；否则所产生的后果由用户承担。',
      '请用户在下单前务必认真阅读以上规则。'
    ]
  }
]

function logRentalImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Rental:${scope}`, rawSrc, resolvedSrc, event)
}

function goBack() {
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []

  if (pages.length > 1) {
    uni.navigateBack()
    return
  }

  uni.reLaunch({
    url: '/pages/mine/index'
  })
}
</script>

<template>
  <view class="page" :style="capsuleSafeAreaStyle">
    <view class="status-space"></view>

    <view class="page-head">
      <view class="head-top">
        <button class="back-button" hover-class="back-button--hover" @tap="goBack">
          返回
        </button>
        <view class="head-brand">
          <image
            class="head-logo"
            :src="logoImage"
            mode="aspectFit"
            @load="logRentalImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
            @error="logRentalImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
          />
          <text class="head-brand-name">暮山川</text>
        </view>
        <CustomerServiceButton label="咨询" variant="ghost" compact />
      </view>

      <view class="head-copy">
        <text class="head-kicker">RENTAL GUIDE</text>
        <text class="head-title">租赁说明</text>
        <text class="head-subtitle">
          设备租借规则已整理成可直接阅读的页面，押金、取还、取消和赔付规则以此处说明为准。
        </text>
      </view>
    </view>

    <view class="quick-card">
      <view v-for="note in quickNotes" :key="note" class="quick-item">
        <view class="quick-dot"></view>
        <text class="quick-text">{{ note }}</text>
      </view>
    </view>

    <view class="rule-list">
      <view v-for="(section, sectionIndex) in ruleSections" :key="section.id" class="rule-card">
        <view class="rule-head">
          <text class="rule-index">{{ sectionIndex + 1 }}</text>
          <text class="rule-title">{{ section.title }}</text>
        </view>
        <view class="rule-items">
          <view v-for="(item, itemIndex) in section.items" :key="item" class="rule-row">
            <text class="item-index">{{ itemIndex + 1 }}</text>
            <text class="rule-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="contact-panel">
      <view class="contact-copy">
        <text class="contact-title">下单前确认档期和配送范围</text>
        <text class="contact-desc">如有超里程、活动布置或团建加配需求，可先联系微信客服。</text>
      </view>
      <CustomerServiceButton label="微信客服" variant="solid" />
    </view>

    <CampTabBar active="rental" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 86% 0%, rgba(213, 184, 124, 0.2), transparent 27%),
    radial-gradient(circle at 12% 18%, rgba(82, 112, 88, 0.13), transparent 25%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
}

.status-space {
  height: var(--capsule-reserved-height, 174rpx);
}

.page-head {
  padding-bottom: 18rpx;
}

.head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--capsule-button-height, 64rpx);
  margin-top: var(--capsule-after-gap, 28rpx);
  padding: 0 30rpx;
}

.back-button {
  flex: 0 0 auto;
  height: var(--capsule-button-height, 64rpx);
  min-height: 56rpx;
  margin: 0;
  padding: 0 20rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.14);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.74);
  color: #223d2d;
  font-size: 24rpx;
  font-weight: 800;
  line-height: var(--capsule-button-height, 64rpx);
}

.back-button::after {
  border: 0;
}

.back-button--hover {
  opacity: 0.84;
}

.head-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 0 16rpx;
}

.head-logo {
  width: 44rpx;
  height: 44rpx;
}

.head-brand-name {
  margin-left: 10rpx;
  color: #223d2d;
  font-size: 30rpx;
  font-weight: 860;
  line-height: 36rpx;
}

.head-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 24rpx 30rpx 0;
}

.head-kicker {
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 28rpx;
}

.head-title {
  margin-top: 6rpx;
  color: #171b17;
  font-size: 48rpx;
  font-weight: 900;
  line-height: 60rpx;
}

.head-subtitle {
  margin-top: 10rpx;
  color: #687164;
  font-size: 24rpx;
  line-height: 36rpx;
}

.quick-card {
  display: flex;
  flex-direction: column;
  margin: 4rpx 30rpx 24rpx;
  padding: 22rpx 26rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 16rpx 46rpx rgba(34, 42, 34, 0.06);
}

.quick-item {
  display: flex;
  align-items: center;
  min-height: 42rpx;
}

.quick-item + .quick-item {
  margin-top: 10rpx;
}

.quick-dot {
  flex: 0 0 auto;
  width: 12rpx;
  height: 12rpx;
  margin-right: 14rpx;
  border-radius: 50%;
  background: #c5973e;
}

.quick-text {
  color: #223d2d;
  font-size: 25rpx;
  font-weight: 760;
  line-height: 34rpx;
}

.rule-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  padding: 0 30rpx;
}

.rule-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 30rpx;
  background: #fffdfa;
  box-shadow: 0 18rpx 52rpx rgba(34, 42, 34, 0.07);
}

.rule-head {
  display: flex;
  align-items: center;
  padding: 24rpx 26rpx 18rpx;
}

.rule-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46rpx;
  height: 46rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: #223d2d;
  color: #fff8ed;
  font-size: 22rpx;
  font-weight: 900;
  line-height: 46rpx;
}

.rule-title {
  color: #171b17;
  font-size: 31rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.rule-items {
  padding: 0 26rpx 24rpx;
}

.rule-row {
  display: flex;
  align-items: flex-start;
  padding: 15rpx 0;
  border-top: 1rpx solid rgba(34, 61, 45, 0.06);
}

.item-index {
  flex: 0 0 auto;
  width: 34rpx;
  height: 34rpx;
  margin-right: 14rpx;
  border-radius: 50%;
  background: #f2efe7;
  color: #9b7a3e;
  font-size: 20rpx;
  font-weight: 850;
  line-height: 34rpx;
  text-align: center;
}

.rule-text {
  flex: 1;
  min-width: 0;
  color: #555d52;
  font-size: 24rpx;
  line-height: 36rpx;
}

.contact-panel {
  display: flex;
  align-items: center;
  margin: 26rpx 30rpx 0;
  padding: 24rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.1);
  border-radius: 28rpx;
  background: #fffdfa;
  box-shadow: 0 18rpx 52rpx rgba(34, 42, 34, 0.07);
}

.contact-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.contact-title {
  color: #171b17;
  font-size: 29rpx;
  font-weight: 900;
  line-height: 38rpx;
}

.contact-desc {
  margin-top: 6rpx;
  color: #73786f;
  font-size: 22rpx;
  line-height: 32rpx;
}
</style>
