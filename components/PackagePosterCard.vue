<script setup>
import { brand } from '../data/campData.js'
import { useCloudImageUrl } from '../composables/useCloudImageUrl.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['contact'])
const posterImage = useCloudImageUrl(() => props.item.image)
const messageImage = useCloudImageUrl(() => brand.logo)
</script>

<template>
  <view class="package-card" :class="{ 'package-card--compact': compact }">
    <image class="package-poster" :src="posterImage" mode="aspectFit" />
    <view class="package-info">
      <view class="package-head">
        <view class="package-copy">
          <text class="package-people">{{ item.people }}</text>
          <text class="package-title">{{ item.title }}</text>
          <text class="package-scene">{{ item.scene }}</text>
        </view>
        <view class="package-price">
          <text class="price-main">{{ item.price }}</text>
          <text class="price-sub">{{ item.longRent }}</text>
        </view>
      </view>
      <view class="feature-row">
        <text
          v-for="feature in item.features"
          :key="feature"
          class="feature-chip"
          >{{ feature }}</text
        >
      </view>
      <button
        class="contact-btn"
        hover-class="contact-btn--hover"
        open-type="contact"
        show-message-card="true"
        send-message-title="暮山川 BBQ 套餐咨询"
        send-message-path="/pages/packages/index"
        :send-message-img="messageImage"
        @tap="emit('contact')"
      >
        微信客服咨询
      </button>
    </view>
  </view>
</template>

<style scoped>
.package-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 34rpx;
  background: #fffdfa;
  box-shadow: 0 24rpx 64rpx rgba(34, 42, 34, 0.1);
}

.package-card--compact {
  width: 560rpx;
  flex: 0 0 auto;
  margin-right: 22rpx;
}

.package-poster {
  display: block;
  width: 100%;
  height: 920rpx;
  background: #fff;
}

.package-card--compact .package-poster {
  height: 746rpx;
}

.package-info {
  padding: 24rpx;
}

.package-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.package-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.package-people {
  color: #c5973e;
  font-size: 22rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 30rpx;
}

.package-title {
  margin-top: 6rpx;
  overflow: hidden;
  color: #171b17;
  font-size: 31rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 40rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.package-scene {
  margin-top: 6rpx;
  overflow: hidden;
  color: #73786f;
  font-size: 23rpx;
  line-height: 32rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.package-price {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  max-width: 190rpx;
}

.price-main {
  color: #223d2d;
  font-size: 31rpx;
  font-weight: 900;
  line-height: 38rpx;
}

.price-sub {
  margin-top: 5rpx;
  color: #9b7a3e;
  font-size: 19rpx;
  line-height: 26rpx;
  text-align: right;
}

.feature-row {
  display: flex;
  flex-wrap: wrap;
  max-height: 88rpx;
  margin-top: 18rpx;
  overflow: hidden;
}

.feature-chip {
  margin: 0 8rpx 8rpx 0;
  padding: 5rpx 12rpx;
  border-radius: 999rpx;
  background: #f2efe7;
  color: #666e61;
  font-size: 21rpx;
  line-height: 30rpx;
}

.contact-btn {
  height: 74rpx;
  margin: 18rpx 0 0;
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
