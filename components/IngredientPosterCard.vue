<script setup>
import { computed } from 'vue'
import { brand } from '../data/campData.js'
import {
  logImageRenderEvent,
  previewImageUrl,
  useCloudImageUrl
} from '../composables/useCloudImageUrl.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const posterImage = useCloudImageUrl(() => props.item.image)
const detailImage = useCloudImageUrl(() => props.item.detailImage || '')
const messageImage = useCloudImageUrl(() => brand.logos.white)
const messageTitle = computed(() => `${brand.name} ${props.item.title} 食材咨询`)
function logPosterImageEvent(event) {
  logImageRenderEvent(
    `IngredientPosterCard:${props.item.id}:poster`,
    props.item.image,
    posterImage.value,
    event
  )
}

function logDetailImageEvent(event) {
  logImageRenderEvent(
    `IngredientPosterCard:${props.item.id}:detail`,
    props.item.detailImage || '',
    detailImage.value,
    event
  )
}

function previewIngredientImage(currentImage) {
  previewImageUrl(currentImage, [posterImage, detailImage])
}
</script>

<template>
  <view class="ingredient-card">
    <view class="ingredient-media">
      <image
        class="ingredient-poster"
        :class="{ 'ingredient-poster--single': !item.detailImage }"
        :src="posterImage"
        mode="aspectFit"
        @load="logPosterImageEvent"
        @error="logPosterImageEvent"
        @tap="previewIngredientImage(posterImage)"
      />
      <image
        v-if="item.detailImage"
        class="ingredient-detail"
        :src="detailImage"
        mode="aspectFit"
        @load="logDetailImageEvent"
        @error="logDetailImageEvent"
        @tap="previewIngredientImage(detailImage)"
      />
    </view>

    <view class="ingredient-info">
      <view class="ingredient-head">
        <view class="ingredient-copy">
          <text class="ingredient-people">{{ item.people }}</text>
          <text class="ingredient-title">{{ item.title }}</text>
          <text class="ingredient-scene">{{ item.scene }}</text>
        </view>
        <view class="ingredient-price">
          <text class="price-main">{{ item.price }}</text>
          <text class="price-note">{{ item.note }}</text>
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
        :send-message-title="messageTitle"
        send-message-path="/pages/ingredients/index"
        :send-message-img="messageImage"
      >
        微信客服咨询
      </button>
    </view>
  </view>
</template>

<style scoped>
.ingredient-card {
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 34rpx;
  background: #fffdfa;
  box-shadow: 0 24rpx 64rpx rgba(34, 42, 34, 0.1);
}

.ingredient-media {
  padding: 14rpx 14rpx 0;
  background: #fff;
}

.ingredient-poster,
.ingredient-detail {
  display: block;
  width: 100%;
  border-radius: 24rpx;
  background: #fff;
}

.ingredient-poster {
  height: 920rpx;
}

.ingredient-poster--single {
  height: 620rpx;
}

.ingredient-detail {
  height: 560rpx;
  margin-top: 14rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  box-sizing: border-box;
}

.ingredient-info {
  padding: 24rpx;
}

.ingredient-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ingredient-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.ingredient-people {
  color: #c5973e;
  font-size: 22rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 30rpx;
}

.ingredient-title {
  margin-top: 6rpx;
  color: #171b17;
  font-size: 31rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 40rpx;
}

.ingredient-scene {
  margin-top: 6rpx;
  overflow: hidden;
  color: #73786f;
  font-size: 23rpx;
  line-height: 32rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ingredient-price {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  max-width: 198rpx;
}

.price-main {
  color: #223d2d;
  font-size: 33rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.price-note {
  margin-top: 5rpx;
  color: #9b7a3e;
  font-size: 19rpx;
  line-height: 26rpx;
  text-align: right;
}

.feature-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18rpx;
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
