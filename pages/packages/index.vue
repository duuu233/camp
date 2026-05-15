<script setup>
import { computed, shallowRef } from 'vue'
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PackagePosterCard from '../../components/PackagePosterCard.vue'
import { useCloudImageUrl } from '../../composables/useCloudImageUrl.js'
import { bbqPackages, brand, packageGroups } from '../../data/campData.js'

const activeGroup = shallowRef('all')
const logoImage = useCloudImageUrl(() => brand.logo)

const visiblePackages = computed(() => {
  if (activeGroup.value === 'all') {
    return bbqPackages
  }

  return bbqPackages.filter((item) => item.group === activeGroup.value)
})

function setGroup(groupId) {
  activeGroup.value = groupId
}
</script>

<template>
  <view class="page">
    <view class="status-space"></view>

    <view class="page-head">
      <view class="head-copy">
        <view class="head-brand">
          <image class="head-logo" :src="logoImage" mode="aspectFit" />
          <text class="head-brand-name">{{ brand.name }}</text>
        </view>
        <text class="head-title">BBQ 套餐</text>
        <text class="head-subtitle">按人数选择海报套餐，具体档期、配送范围和加配内容可直接咨询微信客服。</text>
      </view>
      <CustomerServiceButton label="咨询" variant="ghost" />
    </view>

    <scroll-view class="filter-scroll" scroll-x enable-flex>
      <view class="filter-row">
        <button
          v-for="group in packageGroups"
          :key="group.id"
          class="filter-chip"
          :class="{ 'filter-chip--active': activeGroup === group.id }"
          hover-class="filter-chip--hover"
          @tap="setGroup(group.id)"
        >
          {{ group.label }}
        </button>
      </view>
    </scroll-view>

    <view class="package-list">
      <PackagePosterCard v-for="item in visiblePackages" :key="item.id" :item="item" />
    </view>

    <CampTabBar active="packages" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 86% 0%, rgba(213, 184, 124, 0.2), transparent 27%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
}

.status-space {
  height: var(--status-bar-height);
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28rpx 30rpx 18rpx;
}

.head-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 22rpx;
}

.head-brand {
  display: flex;
  align-items: center;
}

.head-logo {
  width: 54rpx;
  height: 54rpx;
}

.head-brand-name {
  margin-left: 12rpx;
  color: #223d2d;
  font-size: 30rpx;
  font-weight: 860;
  line-height: 38rpx;
}

.head-title {
  margin-top: 16rpx;
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

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-row {
  display: flex;
  padding: 10rpx 30rpx 24rpx;
}

.filter-chip {
  flex: 0 0 auto;
  height: 66rpx;
  margin: 0 14rpx 0 0;
  padding: 0 28rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.12);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.78);
  color: #555d52;
  font-size: 26rpx;
  font-weight: 760;
  line-height: 66rpx;
}

.filter-chip::after {
  border: 0;
}

.filter-chip--active {
  border-color: #223d2d;
  background: #223d2d;
  color: #fff8ed;
}

.filter-chip--hover {
  opacity: 0.82;
}

.package-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 30rpx;
}
</style>
