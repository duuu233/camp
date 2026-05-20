<script setup>
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PackagePosterCard from '../../components/PackagePosterCard.vue'
import PickupLocationCard from '../../components/PickupLocationCard.vue'
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
  housekeepingRules,
  hero,
  rentalSteps,
  serviceCards
} from '../../data/campData.js'

const featuredPackages = bbqPackages.slice(0, 4)
const capsuleSafeAreaStyle = useCapsuleSafeArea()
const heroLogoImage = useCloudImageUrl(() => brand.logos.white)
const heroPoster = useCloudImageUrl(() => hero.poster)
const housekeepingImage = useCloudImageUrl(() => housekeepingRules.image)

function logHomeImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Home:${scope}`, rawSrc, resolvedSrc, event)
}

function goPackages() {
  uni.reLaunch({
    url: '/pages/packages/index'
  })
}

function goRentalGuide() {
  uni.navigateTo({
    url: '/pages/rental/index'
  })
}

function previewHousekeepingRules() {
  previewImageUrl(housekeepingImage)
}

function showToast(title) {
  uni.showToast({
    title,
    icon: 'none'
  })
}
</script>

<template>
  <view class="page" :style="capsuleSafeAreaStyle">
    <view class="status-space"></view>

    <view class="topbar">
      <view class="brand-lockup">
        <view class="brand-title-row">
          <text class="brand-name">{{ brand.name }}</text>
        </view>
        <text class="brand-tagline">{{ brand.tagline }}</text>
      </view>
      <button
        class="city-pill"
        hover-class="pill-hover"
        @tap="showToast('当前城市：南宁市')"
      >
        {{ brand.city }}
      </button>
    </view>

    <view class="hero-card">
      <!-- 拆开拼接，编译器就不会识别为本地路径 -->
      <image
        class="hero-bg"
        :src="heroPoster"
        mode="aspectFill"
        @load="logHomeImageEvent('hero-bg', hero.poster, heroPoster, $event)"
        @error="logHomeImageEvent('hero-bg', hero.poster, heroPoster, $event)"
      />

      <view class="hero-mask"></view>
      <view class="hero-content">
        <image
          class="hero-logo"
          :src="heroLogoImage"
          mode="aspectFit"
          @load="
            logHomeImageEvent(
              'hero-logo',
              brand.logos.white,
              heroLogoImage,
              $event
            )
          "
          @error="
            logHomeImageEvent(
              'hero-logo',
              brand.logos.white,
              heroLogoImage,
              $event
            )
          "
        />
        <text class="hero-eyebrow">{{ hero.eyebrow }}</text>
        <text class="hero-title">{{ hero.title }}</text>
        <text class="hero-subtitle">{{ hero.subtitle }}</text>
        <view class="hero-chips">
          <text v-for="chip in hero.chips" :key="chip" class="hero-chip">{{
            chip
          }}</text>
        </view>
        <view class="hero-actions">
          <button
            class="primary-action"
            hover-class="primary-action--hover"
            @tap="goPackages"
          >
            查看套餐
          </button>
          <CustomerServiceButton label="问档期" variant="light" />
        </view>
      </view>
    </view>

    <view class="content">
      <SectionTitle
        title="精选 BBQ 套餐"
        subtitle="人数、炉具、桌椅、天幕和氛围灯一套配齐"
        action-label="全部"
        @action="goPackages"
      />
      <scroll-view class="package-scroll" scroll-x enable-flex>
        <view class="package-row">
          <PackagePosterCard
            v-for="item in featuredPackages"
            :key="item.id"
            :item="item"
            compact
          />
        </view>
      </scroll-view>

      <SectionTitle
        title="租赁服务"
        subtitle="适合年轻朋友聚会、女生小团体、亲子家庭和公司团建"
      />
      <view class="service-grid">
        <view
          v-for="service in serviceCards"
          :key="service.id"
          class="service-card"
        >
          <text class="service-badge">{{ service.badge }}</text>
          <text class="service-title">{{ service.title }}</text>
          <text class="service-subtitle">{{ service.subtitle }}</text>
        </view>
      </view>

      <view class="housekeeping-card">
        <view class="housekeeping-head">
          <view class="housekeeping-copy">
            <text class="housekeeping-title">{{
              housekeepingRules.title
            }}</text>
            <text class="housekeeping-subtitle">{{
              housekeepingRules.subtitle
            }}</text>
          </view>
          <button
            class="guide-button"
            hover-class="guide-button--hover"
            @tap="goRentalGuide"
          >
            租赁说明
          </button>
        </view>
        <image
          class="housekeeping-image"
          :src="housekeepingImage"
          mode="aspectFit"
          @load="
            logHomeImageEvent(
              'housekeeping-rules',
              housekeepingRules.image,
              housekeepingImage,
              $event
            )
          "
          @error="
            logHomeImageEvent(
              'housekeeping-rules',
              housekeepingRules.image,
              housekeepingImage,
              $event
            )
          "
          @tap="previewHousekeepingRules"
        />
      </view>

      <view class="pickup-section">
        <PickupLocationCard title="自提取装点" />
      </view>

      <SectionTitle
        title="怎么租"
        subtitle="从选择套餐到取还装备，按约定时间轻松完成"
        action-label="说明"
        @action="goRentalGuide"
      />
      <view class="step-card">
        <view
          v-for="(step, index) in rentalSteps"
          :key="step.id"
          class="step-row"
        >
          <view class="step-index">{{ index + 1 }}</view>
          <view class="step-copy">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-detail">{{ step.detail }}</text>
          </view>
        </view>
      </view>
    </view>

    <CampTabBar active="home" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(
      circle at 16% 0%,
      rgba(213, 184, 124, 0.2),
      transparent 26%
    ),
    radial-gradient(
      circle at 88% 12%,
      rgba(82, 112, 88, 0.16),
      transparent 28%
    ),
    linear-gradient(180deg, #fbfaf7 0%, #f1f4ef 52%, #f8f5ee 100%);
}

.status-space {
  height: var(--capsule-reserved-height, 174rpx);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--capsule-button-height, 64rpx);
  margin-top: var(--capsule-after-gap, 28rpx);
  padding: 0 30rpx;
}

.brand-lockup {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  height: var(--capsule-button-height, 64rpx);
  min-width: 0;
  padding-left: 18rpx;
  padding-right: 22rpx;
}

.brand-lockup::before {
  position: absolute;
  top: 8rpx;
  bottom: 8rpx;
  left: 0;
  width: 6rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #d7ae58, #223d2d);
  content: '';
}

.brand-title-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.brand-name {
  overflow: hidden;
  color: #1d2b20;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 40rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-tagline {
  margin-top: 2rpx;
  overflow: hidden;
  color: #687164;
  font-size: 18rpx;
  line-height: 24rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.city-pill {
  flex: 0 0 auto;
  height: 58rpx;
  min-height: 56rpx;
  margin: 0;
  padding: 0 22rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.12);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.78);
  color: #223d2d;
  font-size: 24rpx;
  font-weight: 760;
  line-height: 58rpx;
  -webkit-backdrop-filter: blur(18rpx);
  backdrop-filter: blur(18rpx);
}

.city-pill::after,
.primary-action::after {
  border: 0;
}

.pill-hover,
.primary-action--hover {
  opacity: 0.86;
}

.hero-card {
  position: relative;
  height: 780rpx;
  margin: var(--capsule-after-gap, 28rpx) 30rpx 0;
  overflow: hidden;
  border: 1rpx solid rgba(255, 248, 237, 0.24);
  border-radius: 42rpx;
  background: #223d2d;
  box-shadow: 0 30rpx 80rpx rgba(30, 42, 32, 0.22);
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(16, 24, 18, 0.08) 0%,
      rgba(16, 24, 18, 0.58) 56%,
      rgba(16, 24, 18, 0.9) 100%
    ),
    linear-gradient(90deg, rgba(16, 24, 18, 0.62), rgba(16, 24, 18, 0.05));
}

.hero-content {
  position: absolute;
  right: 30rpx;
  bottom: 32rpx;
  left: 30rpx;
  display: flex;
  flex-direction: column;
}

.hero-logo {
  width: 118rpx;
  height: 118rpx;
  margin-bottom: 18rpx;
}

.hero-eyebrow {
  color: rgba(255, 248, 237, 0.7);
  font-size: 20rpx;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 28rpx;
}

.hero-title {
  margin-top: 10rpx;
  color: #fff8ed;
  font-size: 48rpx;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 62rpx;
}

.hero-subtitle {
  margin-top: 16rpx;
  color: rgba(255, 248, 237, 0.78);
  font-size: 25rpx;
  line-height: 38rpx;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  margin-top: 22rpx;
}

.hero-chip {
  margin: 0 10rpx 10rpx 0;
  padding: 7rpx 14rpx;
  border: 1rpx solid rgba(255, 248, 237, 0.22);
  border-radius: 999rpx;
  background: rgba(255, 248, 237, 0.12);
  color: rgba(255, 248, 237, 0.88);
  font-size: 22rpx;
  line-height: 30rpx;
}

.hero-actions {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
}

.primary-action {
  flex: 1;
  height: 74rpx;
  margin: 0 18rpx 0 0;
  padding: 0;
  border-radius: 22rpx;
  background: #d7ae58;
  color: #182118;
  font-size: 27rpx;
  font-weight: 850;
  line-height: 74rpx;
}

.content {
  padding: 0 30rpx;
}

.package-scroll {
  width: 100%;
  white-space: nowrap;
}

.package-row {
  display: flex;
  padding-bottom: 10rpx;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.service-card {
  display: flex;
  flex-direction: column;
  min-height: 188rpx;
  padding: 22rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16rpx 42rpx rgba(34, 42, 34, 0.06);
}

.service-badge {
  align-self: flex-start;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #f4e7c8;
  color: #8a6428;
  font-size: 20rpx;
  font-weight: 760;
  line-height: 28rpx;
}

.service-title {
  margin-top: 16rpx;
  color: #171b17;
  font-size: 29rpx;
  font-weight: 850;
  line-height: 38rpx;
}

.service-subtitle {
  margin-top: 7rpx;
  color: #72786f;
  font-size: 21rpx;
  line-height: 31rpx;
}

.housekeeping-card {
  margin-top: 24rpx;
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 30rpx;
  background: #fffdfa;
  box-shadow: 0 18rpx 52rpx rgba(34, 42, 34, 0.08);
}

.housekeeping-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24rpx 24rpx 18rpx;
}

.housekeeping-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 18rpx;
}

.housekeeping-title {
  color: #171b17;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.housekeeping-subtitle {
  margin-top: 6rpx;
  color: #73786f;
  font-size: 22rpx;
  line-height: 32rpx;
}

.guide-button {
  flex: 0 0 auto;
  width: 152rpx;
  height: 58rpx;
  margin: 0;
  padding: 0;
  border: 1rpx solid rgba(34, 61, 45, 0.14);
  border-radius: 16rpx;
  background: #f2efe7;
  color: #223d2d;
  font-size: 23rpx;
  font-weight: 820;
  line-height: 58rpx;
}

.guide-button::after {
  border: 0;
}

.guide-button--hover {
  opacity: 0.84;
}

.housekeeping-image {
  display: block;
  width: 100%;
  height: 894rpx;
  background: #fff;
}

.pickup-section {
  margin-top: 26rpx;
}

.step-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 30rpx;
  background: #fffdfa;
  box-shadow: 0 18rpx 52rpx rgba(34, 42, 34, 0.07);
}

.step-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 108rpx;
  padding: 0 26rpx;
}

.step-row + .step-row::before {
  position: absolute;
  top: 0;
  right: 26rpx;
  left: 82rpx;
  height: 1rpx;
  background: rgba(34, 61, 45, 0.08);
  content: '';
}

.step-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  background: #223d2d;
  color: #fff8ed;
  font-size: 21rpx;
  font-weight: 850;
  line-height: 40rpx;
}

.step-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.step-title {
  color: #171b17;
  font-size: 28rpx;
  font-weight: 850;
  line-height: 36rpx;
}

.step-detail {
  margin-top: 5rpx;
  color: #73786f;
  font-size: 22rpx;
  line-height: 30rpx;
}
</style>
