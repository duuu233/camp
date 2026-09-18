<script setup>
import { shallowRef } from 'vue'
import { onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app'
import CampTabBar from '../../components/CampTabBar.vue'
import LocalProfileCard from '../../components/LocalProfileCard.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PhoneCallButton from '../../components/PhoneCallButton.vue'
import PickupLocationCard from '../../components/PickupLocationCard.vue'
import WechatQrDialog from '../../components/WechatQrDialog.vue'
import { useCapsuleSafeArea } from '../../composables/useImageUrl.js'
import { buildShareMessage, buildShareTimeline, enableShareMenu } from '../../composables/useShare.js'
import { brand, profileGroups } from '../../data/campData.js'

const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoSrc = brand.logos.white
const showWechatQrDialog = shallowRef(false)
const shareConfig = { title: '暮山川 · 露营租赁 · 活动策划', path: '/pages/index/index', imageUrl: logoSrc }
onShareAppMessage(() => buildShareMessage(shareConfig))
onShareTimeline(() => buildShareTimeline(shareConfig))
onShow(enableShareMenu)

function openWechatQrDialog() { showWechatQrDialog.value = true }
function closeWechatQrDialog() { showWechatQrDialog.value = false }
function handleMenuTap(item) {
  const routes = { guide: '/pages/rental/index', agreement: '/pages/agreement/user', privacy: '/pages/agreement/privacy' }
  if (routes[item.id]) {
    uni.navigateTo({ url: routes[item.id] })
  } else if (item.id !== 'feedback') {
    uni.showToast({ title: '敬请期待', icon: 'none' })
  }
}
</script>

<template>
  <view class="page" :style="capsuleSafeAreaStyle">
    <view class="status-space"></view>

    <LocalProfileCard />

    <view class="service-panel">
      <view class="panel-copy">
        <text class="panel-kicker">MUSHANCHUAN</text>
        <text class="panel-title">BBQ 装备租赁与活动策划</text>
        <text class="panel-desc">
          确认套餐、档期、配送范围、加配布置和团建方案。
        </text>
      </view>
      <view class="service-actions">
        <CustomerServiceButton label="微信客服" variant="solid" compact />
        <PhoneCallButton label="客服热线" variant="outline" compact />
        <button
          class="add-wechat-button"
          hover-class="add-wechat-button--hover"
          @tap="openWechatQrDialog"
        >
          加微信好友
        </button>
      </view>
    </view>

    <view class="pickup-panel">
      <PickupLocationCard title="租赁设备自提地址" tone="light" />
    </view>

    <view v-for="group in profileGroups" :key="group.id" class="menu-card">
      <view v-for="item in group.items" :key="item.id" class="menu-row">
        <button
          v-if="item.id === 'feedback'"
          class="menu-row-content menu-row-button"
          hover-class="menu-row--hover"
          open-type="contact"
          show-message-card="true"
          send-message-title="暮山川 BBQ 反馈建议"
          send-message-path="/pages/mine/index"
          :send-message-img="logoSrc"
        >
          <view class="menu-copy">
            <text class="menu-label">{{ item.label }}</text>
            <text class="menu-value">{{ item.value }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </button>

        <view v-else class="menu-row-content" @tap="handleMenuTap(item)">
          <view class="menu-copy">
            <text class="menu-label">{{ item.label }}</text>
            <text class="menu-value">{{ item.value }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <WechatQrDialog
      :visible="showWechatQrDialog"
      title="加客服微信"
      desc="添加暮山川客服，咨询套餐、档期与配送布置"
      @close="closeWechatQrDialog"
    />

    <CampTabBar active="mine" />
  </view>
</template>

<style scoped>
.page {
  --mine-theme-green: #223d2d;
  --mine-theme-green-deep: #17291f;
  --mine-theme-green-mid: #3f5f45;
  --mine-theme-green-soft: #dfe9df;
  --mine-theme-green-pale: #f2f7f1;

  min-height: 100vh;
  overflow-x: hidden;
  padding: 0 30rpx calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(
      circle at 20% 0%,
      rgba(213, 184, 124, 0.22),
      transparent 28%
    ),
    radial-gradient(circle at 88% 18%, rgba(34, 61, 45, 0.14), transparent 26%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
  box-sizing: border-box;
}

.status-space {
  height: var(--status-bar-height);
}

.service-panel {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.1);
  border-radius: 20rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbf7ed 100%), #fffdfa;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.88),
    0 12rpx 32rpx rgba(34, 42, 34, 0.07);
}

.panel-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.service-actions {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 12rpx;
  width: 176rpx;
}

.add-wechat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--capsule-button-height, 64rpx);
  min-height: 56rpx;
  margin: 0;
  padding: 0 22rpx;
  border: 1rpx solid rgba(197, 151, 62, 0.42);
  border-radius: 14rpx;
  background:
    linear-gradient(
      180deg,
      rgba(244, 231, 200, 0.92) 0%,
      rgba(244, 231, 200, 0.6) 100%
    ),
    #fbf7ed;
  color: #8a6428;
  font-size: 24rpx;
  font-weight: 850;
  line-height: var(--capsule-button-height, 64rpx);
}

.add-wechat-button::after {
  border: 0;
}

.add-wechat-button--hover {
  opacity: 0.86;
}

.panel-kicker {
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  line-height: 28rpx;
}

.panel-title {
  margin-top: 8rpx;
  color: #171b17;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.panel-desc {
  margin-top: 6rpx;
  color: #73786f;
  font-size: 22rpx;
  line-height: 32rpx;
}

.pickup-panel {
  margin-top: 28rpx;
}

.menu-card {
  margin-top: 28rpx;
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.1);
  border-radius: 18rpx;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(250, 246, 237, 0.96)
    ),
    rgba(255, 255, 255, 0.92);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.92),
    0 10rpx 28rpx rgba(34, 42, 34, 0.055);
}

.menu-row {
  position: relative;
  min-height: 108rpx;
}

.menu-row-content {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 108rpx;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.menu-row-button {
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  line-height: 1;
  text-align: left;
}

.menu-row-button::after {
  border: 0;
}

.menu-row--hover {
  background: rgba(34, 61, 45, 0.04);
}

.menu-row + .menu-row::before {
  position: absolute;
  top: 0;
  right: 28rpx;
  left: 28rpx;
  height: 1rpx;
  background: rgba(34, 61, 45, 0.08);
  content: '';
}

.menu-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.menu-label {
  color: #171b17;
  font-size: 30rpx;
  font-weight: 850;
  line-height: 40rpx;
}

.menu-value {
  margin-top: 5rpx;
  overflow: hidden;
  color: #7b8077;
  font-size: 22rpx;
  line-height: 30rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-arrow {
  margin-left: 20rpx;
  color: #c1c7bd;
  font-size: 46rpx;
  line-height: 46rpx;
}

</style>
