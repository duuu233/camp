<script setup>
import { brand } from '../data/campData.js'

const props = defineProps({
  label: {
    type: String,
    default: '客服热线'
  },
  phoneNumber: {
    type: String,
    default: brand.contacts.phone
  },
  variant: {
    type: String,
    default: 'outline'
  },
  compact: {
    type: Boolean,
    default: false
  }
})

function makePhoneCall() {
  if (!props.phoneNumber) {
    uni.showToast({
      title: '暂无客服电话',
      icon: 'none'
    })
    return
  }

  uni.makePhoneCall({
    phoneNumber: props.phoneNumber
  })
}
</script>

<template>
  <button
    class="phone-button"
    :class="[`phone-button--${variant}`, { 'phone-button--compact': compact }]"
    hover-class="phone-button--hover"
    @tap="makePhoneCall"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.phone-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74rpx;
  margin: 0;
  padding: 0 26rpx;
  border-radius: 14rpx;
  font-size: 27rpx;
  font-weight: 820;
  letter-spacing: 0;
  line-height: 74rpx;
}

.phone-button::after {
  border: 0;
}

.phone-button--solid {
  background: #223d2d;
  color: #fff8ed;
  box-shadow: 0 14rpx 34rpx rgba(34, 61, 45, 0.2);
}

.phone-button--outline {
  border: 1rpx solid rgba(34, 61, 45, 0.16);
  background: rgba(255, 255, 255, 0.72);
  color: #223d2d;
}

.phone-button--compact {
  height: 64rpx;
  min-height: 56rpx;
  padding: 0 22rpx;
  border-radius: 14rpx;
  font-size: 24rpx;
  line-height: 64rpx;
}

.phone-button--hover {
  opacity: 0.86;
}
</style>
