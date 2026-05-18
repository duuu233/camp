<script setup>
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import IngredientPosterCard from '../../components/IngredientPosterCard.vue'
import {
  logImageRenderEvent,
  useCapsuleSafeArea,
  useCloudImageUrl
} from '../../composables/useCloudImageUrl.js'
import { brand, ingredientPackages } from '../../data/campData.js'

const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoImage = useCloudImageUrl(() => brand.logos.mark)

function logIngredientsImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Ingredients:${scope}`, rawSrc, resolvedSrc, event)
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
            @load="logIngredientsImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
            @error="logIngredientsImageEvent('head-logo', brand.logos.mark, logoImage, $event)"
          />
          <text class="head-brand-name">{{ brand.name }}</text>
        </view>
        <CustomerServiceButton label="咨询" variant="ghost" compact />
      </view>
      <view class="head-copy">
        <text class="head-title">食材套餐</text>
        <text class="head-subtitle"
          >烧烤食材、野餐盒和多人聚会餐单独展示，价格与明细以图片内容为准。</text
        >
      </view>
    </view>

    <view class="note-bar">
      <view class="note-copy">
        <text class="note-kicker">INGREDIENTS</text>
        <text class="note-title">可与 BBQ 装备套餐一起加配</text>
      </view>
      <text class="note-count">{{ ingredientPackages.length }} 款</text>
    </view>

    <view class="ingredient-list">
      <IngredientPosterCard
        v-for="item in ingredientPackages"
        :key="item.id"
        :item="item"
      />
    </view>

    <CampTabBar active="ingredients" />
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

.note-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10rpx 30rpx 24rpx;
  padding: 24rpx 26rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16rpx 46rpx rgba(34, 42, 34, 0.06);
  -webkit-backdrop-filter: blur(18rpx);
  backdrop-filter: blur(18rpx);
}

.note-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.note-kicker {
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 28rpx;
}

.note-title {
  margin-top: 6rpx;
  color: #171b17;
  font-size: 28rpx;
  font-weight: 850;
  line-height: 38rpx;
}

.note-count {
  flex: 0 0 auto;
  color: #223d2d;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 30rpx;
}
</style>
