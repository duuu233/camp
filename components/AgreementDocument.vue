<script setup>
import { computed } from 'vue'

const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

const lineItems = computed(() =>
  props.document.lines.map((line, index) => ({
    id: `${props.document.id}-${index}`,
    text: line,
    type: getLineType(line)
  }))
)

function getLineType(line) {
  if (line.startsWith('【') && line.endsWith('】')) {
    return 'intro'
  }

  if (/^[一二三四五六七八九十]+、/.test(line)) {
    return 'section'
  }

  if (/^\d+\.\d+/.test(line)) {
    return 'clause'
  }

  return 'paragraph'
}
</script>

<template>
  <view class="page">
    <view class="page-head">
      <view class="head-copy">
        <text class="head-kicker">{{ document.kicker }}</text>
        <text class="head-title">{{ document.title }}</text>
        <text class="head-subtitle">请在使用服务前完整阅读并确认理解。</text>
      </view>
    </view>

    <view class="document-card">
      <view
        v-for="line in lineItems"
        :key="line.id"
        class="document-line"
        :class="`document-line--${line.type}`"
      >
        <text class="document-text">{{ line.text }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  overflow-x: hidden;
  padding: 32rpx 30rpx calc(54rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 18% 0%, rgba(213, 184, 124, 0.18), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(34, 61, 45, 0.12), transparent 24%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
  box-sizing: border-box;
}

.page-head {
  padding-bottom: 22rpx;
}

.head-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.head-kicker {
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 28rpx;
}

.head-title {
  margin-top: 8rpx;
  color: #171b17;
  font-size: 50rpx;
  font-weight: 900;
  line-height: 62rpx;
}

.head-subtitle {
  margin-top: 10rpx;
  color: #687164;
  font-size: 24rpx;
  line-height: 36rpx;
}

.document-card {
  padding: 34rpx 30rpx 38rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 28rpx;
  background: rgba(255, 253, 250, 0.96);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.9),
    0 18rpx 52rpx rgba(34, 42, 34, 0.07);
}

.document-line {
  margin-top: 18rpx;
}

.document-line:first-child {
  margin-top: 0;
}

.document-line--intro {
  margin-top: 0;
  margin-bottom: 8rpx;
}

.document-line--section {
  margin-top: 34rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(34, 61, 45, 0.08);
}

.document-line--clause {
  margin-top: 20rpx;
}

.document-text {
  color: #4f594e;
  font-size: 27rpx;
  line-height: 46rpx;
}

.document-line--intro .document-text,
.document-line--section .document-text {
  color: #171b17;
  font-size: 31rpx;
  font-weight: 900;
  line-height: 42rpx;
}

.document-line--clause .document-text {
  color: #3f493e;
}
</style>
