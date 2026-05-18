<script setup>
import { brand } from '../data/campData.js'
import { useCloudImageUrl } from '../composables/useCloudImageUrl.js'

defineProps({
  label: {
    type: String,
    default: '微信客服'
  },
  variant: {
    type: String,
    default: 'solid'
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const messageImage = useCloudImageUrl(() => brand.logos.white)
</script>

<template>
  <button
    class="customer-button"
    :class="[`customer-button--${variant}`, { 'customer-button--compact': compact }]"
    hover-class="customer-button--hover"
    open-type="contact"
    show-message-card="true"
    send-message-title="暮山川 BBQ 套餐咨询"
    send-message-path="/pages/index/index"
    :send-message-img="messageImage"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.customer-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74rpx;
  margin: 0;
  padding: 0 26rpx;
  border-radius: 22rpx;
  font-size: 27rpx;
  font-weight: 820;
  letter-spacing: 0;
  line-height: 74rpx;
}

.customer-button::after {
  border: 0;
}

.customer-button--solid {
  background: #223d2d;
  color: #fff8ed;
  box-shadow: 0 14rpx 34rpx rgba(34, 61, 45, 0.2);
}

.customer-button--light {
  border: 1rpx solid rgba(255, 255, 255, 0.42);
  background: rgba(255, 255, 255, 0.18);
  color: #fff8ed;
  -webkit-backdrop-filter: blur(18rpx);
  backdrop-filter: blur(18rpx);
}

.customer-button--ghost {
  border: 1rpx solid rgba(34, 61, 45, 0.16);
  background: rgba(255, 255, 255, 0.74);
  color: #223d2d;
}

.customer-button--compact {
  height: var(--capsule-button-height, 64rpx);
  min-height: 56rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  line-height: var(--capsule-button-height, 64rpx);
}

.customer-button--hover {
  opacity: 0.86;
}
</style>
