<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])
</script>

<template>
  <view class="section-title">
    <view class="section-copy">
      <text class="section-heading">{{ title }}</text>
      <text v-if="subtitle" class="section-subtitle">{{ subtitle }}</text>
    </view>
    <button v-if="actionLabel" class="section-action" hover-class="section-action--hover" @tap="emit('action')">
      <text>{{ actionLabel }}</text>
      <text class="section-arrow">›</text>
    </button>
  </view>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 58rpx 0 24rpx;
}

.section-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.section-heading {
  color: #171b17;
  font-size: 40rpx;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 54rpx;
}

.section-subtitle {
  margin-top: 8rpx;
  color: #687164;
  font-size: 25rpx;
  line-height: 36rpx;
}

.section-action {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 0 5rpx 24rpx;
  background: transparent;
  color: #9a742d;
  font-size: 26rpx;
  line-height: 36rpx;
}

.section-action::after {
  border: 0;
}

.section-action--hover {
  opacity: 0.72;
}

.section-arrow {
  margin-left: 6rpx;
  font-size: 38rpx;
  line-height: 32rpx;
}
</style>
