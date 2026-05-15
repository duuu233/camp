<script setup>
const props = defineProps({
  active: {
    type: String,
    required: true
  }
})

const tabs = [
  { id: 'home', label: '首页', url: '/pages/index/index', icon: '暮' },
  { id: 'packages', label: '套餐', url: '/pages/packages/index', icon: '山' },
  { id: 'mine', label: '我的', url: '/pages/mine/index', icon: '川' }
]

function goTab(tab) {
  if (tab.id === props.active) {
    return
  }

  uni.reLaunch({
    url: tab.url
  })
}
</script>

<template>
  <view class="camp-tabbar">
    <view class="tab-line"></view>
    <view class="tab-inner">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ 'tab-item--active': active === tab.id }"
        @tap="goTab(tab)"
      >
        <view class="tab-icon">
          <text>{{ tab.icon }}</text>
        </view>
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.camp-tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(252, 251, 247, 0.9);
  -webkit-backdrop-filter: blur(26rpx);
  backdrop-filter: blur(26rpx);
}

.tab-line {
  height: 1rpx;
  background: rgba(28, 45, 34, 0.08);
}

.tab-inner {
  display: flex;
  align-items: center;
  height: 118rpx;
  padding: 0 34rpx;
}

.tab-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  color: #8e918a;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42rpx;
  height: 42rpx;
  margin-bottom: 8rpx;
  border-radius: 50%;
  background: transparent;
  color: inherit;
}

.tab-icon text {
  font-size: 21rpx;
  font-weight: 800;
  line-height: 42rpx;
}

.tab-label {
  font-size: 27rpx;
  font-weight: 620;
  letter-spacing: 0;
  line-height: 34rpx;
}

.tab-item--active {
  color: #223d2d;
}

.tab-item--active .tab-icon {
  background: #223d2d;
  color: #f8f3e6;
  box-shadow: 0 10rpx 24rpx rgba(34, 61, 45, 0.18);
}
</style>
