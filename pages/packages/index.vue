<script setup>
import { computed, shallowRef } from 'vue'
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PackagePosterCard from '../../components/PackagePosterCard.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import {
  logImageRenderEvent,
  previewImageUrl,
  useCapsuleSafeArea,
  useCloudImageUrl
} from '../../composables/useCloudImageUrl.js'
import {
  bbqPackages,
  brand,
  equipmentDetails,
  packageGroups
} from '../../data/campData.js'

const activeGroup = shallowRef('all')
const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoImage = useCloudImageUrl(() => brand.logos.mark)
const equipmentImage = useCloudImageUrl(() => equipmentDetails.image)

function logPackagesImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Packages:${scope}`, rawSrc, resolvedSrc, event)
}

const visiblePackages = computed(() => {
  if (activeGroup.value === 'all') {
    return bbqPackages
  }

  return bbqPackages.filter((item) => item.group === activeGroup.value)
})

function setGroup(groupId) {
  activeGroup.value = groupId
}

function previewEquipmentImage() {
  previewImageUrl(equipmentImage)
}
</script>

<template>
  <view class="page" :style="capsuleSafeAreaStyle">
    <view class="status-space"></view>

    <view class="page-head">
      <view class="head-top">
        <view class="head-brand">
          <image
            class="head-logo"
            :src="logoImage"
            mode="aspectFit"
            @load="logPackagesImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
            @error="logPackagesImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
          />
          <text class="head-brand-name">{{ brand.name }}</text>
        </view>
        <CustomerServiceButton label="咨询" variant="ghost" compact />
      </view>
      <view class="head-copy">
        <text class="head-title">BBQ 套餐</text>
        <text class="head-subtitle">按人数选择海报套餐，具体档期、配送范围和加配内容可直接咨询微信客服。</text>
      </view>
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

    <view class="equipment-section">
      <SectionTitle
        :title="equipmentDetails.title"
        :subtitle="equipmentDetails.subtitle"
      />
      <view class="equipment-card">
        <image
          class="equipment-image"
          :src="equipmentImage"
          mode="aspectFit"
          @load="logPackagesImageEvent('equipment-details', equipmentDetails.image, equipmentImage, $event)"
          @error="logPackagesImageEvent('equipment-details', equipmentDetails.image, equipmentImage, $event)"
          @tap="previewEquipmentImage"
        />
      </view>
    </view>

    <CampTabBar active="packages" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 86% 0%, rgba(213, 184, 124, 0.2), transparent 27%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
}

.status-space {
  height: var(--status-bar-height);
}

.page-head {
  padding-bottom: 20rpx;
}

.head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--capsule-button-height, 64rpx);
  margin-top: var(--capsule-top-gap, 22rpx);
  padding: 0 var(--capsule-safe-right, 30rpx) 0 30rpx;
}

.head-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 24rpx 30rpx 0;
}

.head-brand {
  display: flex;
  align-items: center;
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

.head-title {
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

.equipment-section {
  padding: 0 30rpx;
}

.equipment-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 34rpx;
  background: #fffdfa;
  box-shadow: 0 24rpx 64rpx rgba(34, 42, 34, 0.1);
}

.equipment-image {
  display: block;
  width: 100%;
  height: 1035rpx;
  background: #fff;
}
</style>
