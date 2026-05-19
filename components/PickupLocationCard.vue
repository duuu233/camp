<script setup>
import { computed } from 'vue'
import { pickupLocation } from '../data/campData.js'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  },
  tone: {
    type: String,
    default: 'light'
  }
})

const displayTitle = computed(() => props.title || pickupLocation.title)
const cardClasses = computed(() => ({
  'pickup-card--compact': props.compact,
  [`pickup-card--${props.tone}`]: true
}))

function showToast(title) {
  uni.showToast({
    title,
    icon: 'none'
  })
}

function copyPickupAddress() {
  uni.setClipboardData({
    data: pickupLocation.address,
    success: () => {
      showToast('地址已复制')
    },
    fail: () => {
      showToast('复制失败，请长按地址')
    }
  })
}

function openPickupLocation() {
  if (!pickupLocation.latitude || !pickupLocation.longitude) {
    copyPickupAddress()
    return
  }

  uni.openLocation({
    latitude: pickupLocation.latitude,
    longitude: pickupLocation.longitude,
    scale: 18,
    name: pickupLocation.name,
    address: pickupLocation.address,
    fail: () => {
      copyPickupAddress()
      showToast('已复制地址，可手动导航')
    }
  })
}
</script>

<template>
  <view class="pickup-card" :class="cardClasses">
    <view class="pickup-main" @tap="openPickupLocation">
      <view class="pickup-pin">
        <text>取</text>
      </view>
      <view class="pickup-copy">
        <text class="pickup-kicker">SELF PICKUP</text>
        <text class="pickup-title">{{ displayTitle }}</text>
        <text class="pickup-address">{{ pickupLocation.address }}</text>
        <text v-if="!compact" class="pickup-tip">{{ pickupLocation.tip }}</text>
      </view>
    </view>
    <view class="pickup-actions">
      <button
        class="pickup-action pickup-action--ghost"
        hover-class="pickup-action--hover"
        @tap.stop="copyPickupAddress"
      >
        复制
      </button>
      <button
        class="pickup-action pickup-action--solid"
        hover-class="pickup-action--hover"
        @tap.stop="openPickupLocation"
      >
        导航
      </button>
    </view>
  </view>
</template>

<style scoped>
.pickup-card {
  position: relative;
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.11);
  border-radius: 18rpx;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 239, 222, 0.98)),
    #fffdfa;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.92),
    0 12rpx 34rpx rgba(34, 42, 34, 0.07);
}

.pickup-card--dark {
  border-color: rgba(255, 248, 237, 0.18);
  background:
    linear-gradient(180deg, rgba(68, 84, 61, 0.96), rgba(28, 48, 35, 0.96)),
    #223d2d;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.13),
    inset 0 -2rpx 0 rgba(0, 0, 0, 0.12),
    0 16rpx 42rpx rgba(30, 42, 32, 0.16);
}

.pickup-main {
  display: flex;
  align-items: flex-start;
  padding: 28rpx 28rpx 22rpx;
}

.pickup-pin {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  margin-right: 20rpx;
  border-radius: 14rpx;
  background:
    linear-gradient(180deg, #324d38, #1f3527),
    #223d2d;
  color: #fff8ed;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.12),
    0 10rpx 24rpx rgba(34, 61, 45, 0.16);
}

.pickup-card--dark .pickup-pin {
  background:
    linear-gradient(180deg, #f3d88c, #c89a3f),
    #d7ae58;
  color: #1a2319;
}

.pickup-pin text {
  font-size: 28rpx;
  font-weight: 900;
  line-height: 34rpx;
}

.pickup-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.pickup-kicker {
  color: #b58734;
  font-size: 19rpx;
  font-weight: 850;
  line-height: 26rpx;
}

.pickup-card--dark .pickup-kicker {
  color: rgba(255, 226, 166, 0.86);
}

.pickup-title {
  margin-top: 6rpx;
  color: #171b17;
  font-size: 31rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.pickup-card--dark .pickup-title {
  color: #fff8ed;
}

.pickup-address {
  margin-top: 8rpx;
  color: #50584d;
  font-size: 24rpx;
  line-height: 36rpx;
}

.pickup-card--dark .pickup-address {
  color: rgba(255, 248, 237, 0.82);
}

.pickup-tip {
  margin-top: 8rpx;
  color: #7a8076;
  font-size: 21rpx;
  line-height: 31rpx;
}

.pickup-card--dark .pickup-tip {
  color: rgba(255, 248, 237, 0.58);
}

.pickup-actions {
  display: flex;
  gap: 14rpx;
  padding: 0 28rpx 28rpx 116rpx;
}

.pickup-action {
  height: 58rpx;
  margin: 0;
  padding: 0 26rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 820;
  line-height: 58rpx;
}

.pickup-action::after {
  border: 0;
}

.pickup-action--ghost {
  border: 1rpx solid rgba(34, 61, 45, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(246, 239, 222, 0.68)),
    rgba(255, 255, 255, 0.62);
  color: #223d2d;
}

.pickup-action--solid {
  background:
    linear-gradient(180deg, #31513b, #223d2d),
    #223d2d;
  color: #fff8ed;
}

.pickup-card--dark .pickup-action--ghost {
  border-color: rgba(255, 248, 237, 0.24);
  background: rgba(255, 248, 237, 0.1);
  color: #fff8ed;
}

.pickup-card--dark .pickup-action--solid {
  background: #fff8ed;
  color: #223d2d;
}

.pickup-action--hover {
  opacity: 0.84;
}

.pickup-card--compact .pickup-main {
  padding-bottom: 18rpx;
}

.pickup-card--compact .pickup-actions {
  padding-bottom: 22rpx;
}
</style>
