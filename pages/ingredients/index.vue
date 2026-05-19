<script setup>
import { computed, shallowRef } from 'vue'
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import {
  logImageRenderEvent,
  previewImageUrl,
  useCapsuleSafeArea,
  useCloudImageUrl
} from '../../composables/useCloudImageUrl.js'
import { brand, ingredientPackages } from '../../data/campData.js'

const brandName = '暮山川'
const activeCategory = shallowRef('all')
const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoImage = useCloudImageUrl(() => brand.logos.mark)
const messageImage = useCloudImageUrl(() => brand.logos.white)
const messageTitle = `${brandName} BBQ 食材套餐咨询`

const categories = [
  { id: 'all', label: '全部' },
  { id: 'small', label: '4-8人' },
  { id: 'party', label: '10人以上' },
  { id: 'addon', label: '加配' }
]

const ingredientPosters = ingredientPackages.map((item) => ({
  ...item,
  resolvedImage: useCloudImageUrl(() => item.image)
}))

const visiblePosters = computed(() => {
  if (activeCategory.value === 'all') {
    return ingredientPosters
  }

  return ingredientPosters.filter((item) => item.category === activeCategory.value)
})

function setCategory(categoryId) {
  activeCategory.value = categoryId
}

function logIngredientsImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Ingredients:${scope}`, rawSrc, resolvedSrc, event)
}

function logPosterImageEvent(item, event) {
  logIngredientsImageEvent(item.id, item.image, item.resolvedImage.value, event)
}

function previewPoster(item) {
  previewImageUrl(
    item.resolvedImage,
    visiblePosters.value.map((poster) => poster.resolvedImage)
  )
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
          <text class="head-brand-name">{{ brandName }}</text>
        </view>
        <CustomerServiceButton label="咨询" variant="ghost" compact />
      </view>

      <view class="head-copy">
        <text class="head-kicker">INGREDIENTS</text>
        <text class="head-title">食材套餐</text>
        <text class="head-subtitle">
          新版食材图已把明细和价格整合到同一张海报里，点开图片可放大查看。
        </text>
      </view>
    </view>

    <scroll-view class="category-scroll" scroll-x enable-flex>
      <view class="category-row">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-chip"
          :class="{ 'category-chip--active': activeCategory === category.id }"
          hover-class="category-chip--hover"
          @tap="setCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </view>
    </scroll-view>

    <view class="notice-bar">
      <view class="notice-copy">
        <text class="notice-title">按人数选择食材</text>
        <text class="notice-text">海报价格为准，可与 BBQ 设备套餐一起加配。</text>
      </view>
      <text class="notice-count">{{ visiblePosters.length }} 款</text>
    </view>

    <view class="poster-list">
      <view
        v-for="item in visiblePosters"
        :key="item.id"
        class="poster-card"
      >
        <view class="poster-meta">
          <view class="poster-copy">
            <text class="poster-title">{{ item.title }}</text>
            <text class="poster-subtitle">{{ item.subtitle }}</text>
          </view>
          <text class="poster-tag">{{ item.tag }}</text>
        </view>

        <image
          class="poster-image"
          :class="{ 'poster-image--tall': item.layout === 'tall' }"
          :src="item.resolvedImage.value"
          mode="aspectFit"
          @load="logPosterImageEvent(item, $event)"
          @error="logPosterImageEvent(item, $event)"
          @tap="previewPoster(item)"
        />

        <button
          class="contact-btn"
          hover-class="contact-btn--hover"
          open-type="contact"
          show-message-card="true"
          :send-message-title="messageTitle"
          send-message-path="/pages/ingredients/index"
          :send-message-img="messageImage"
        >
          微信客服咨询
        </button>
      </view>
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

.head-brand {
  display: flex;
  align-items: center;
  min-width: 0;
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

.category-scroll {
  width: 100%;
  white-space: nowrap;
}

.category-row {
  display: flex;
  padding: 10rpx 30rpx 22rpx;
}

.category-chip {
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

.category-chip::after {
  border: 0;
}

.category-chip--active {
  border-color: #223d2d;
  background: #223d2d;
  color: #fff8ed;
}

.category-chip--hover {
  opacity: 0.82;
}

.notice-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 30rpx 24rpx;
  padding: 24rpx 26rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16rpx 46rpx rgba(34, 42, 34, 0.06);
  -webkit-backdrop-filter: blur(18rpx);
  backdrop-filter: blur(18rpx);
}

.notice-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.notice-title {
  color: #171b17;
  font-size: 28rpx;
  font-weight: 850;
  line-height: 38rpx;
}

.notice-text {
  margin-top: 4rpx;
  color: #687164;
  font-size: 23rpx;
  line-height: 32rpx;
}

.notice-count {
  flex: 0 0 auto;
  color: #223d2d;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.poster-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 30rpx;
}

.poster-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 32rpx;
  background: #fffdfa;
  box-shadow: 0 24rpx 64rpx rgba(34, 42, 34, 0.1);
}

.poster-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24rpx 24rpx 18rpx;
}

.poster-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 18rpx;
}

.poster-title {
  color: #171b17;
  font-size: 31rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 40rpx;
}

.poster-subtitle {
  margin-top: 6rpx;
  color: #73786f;
  font-size: 23rpx;
  line-height: 32rpx;
}

.poster-tag {
  flex: 0 0 auto;
  min-width: 96rpx;
  height: 46rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: #f2efe7;
  color: #9b7a3e;
  font-size: 22rpx;
  font-weight: 850;
  line-height: 46rpx;
  text-align: center;
}

.poster-image {
  display: block;
  width: 100%;
  height: 752rpx;
  background: #fff;
}

.poster-image--tall {
  height: 916rpx;
}

.contact-btn {
  height: 74rpx;
  margin: 20rpx 24rpx 24rpx;
  padding: 0;
  border-radius: 22rpx;
  background: #223d2d;
  color: #fff7e8;
  font-size: 27rpx;
  font-weight: 800;
  line-height: 74rpx;
}

.contact-btn::after {
  border: 0;
}

.contact-btn--hover {
  opacity: 0.88;
}
</style>
