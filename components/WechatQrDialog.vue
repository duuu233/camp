<script setup>
import { shallowRef } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  qrSrc: {
    type: String,
    default: '/static/wx-customer-service.jpg'
  },
  title: {
    type: String,
    default: '加客服微信'
  },
  desc: {
    type: String,
    default: '添加暮山川客服，咨询套餐、档期与配送'
  }
})

const emit = defineEmits(['close'])

const isSaving = shallowRef(false)

function close() {
  emit('close')
}

function handleSaveFail(error) {
  const message = (error && error.errMsg) || ''

  if (message.indexOf('cancel') !== -1) {
    return
  }

  if (/auth|authorize|deny/.test(message)) {
    uni.showModal({
      title: '需要相册权限',
      content: '保存二维码需要访问相册，请在设置中开启后再试。',
      confirmText: '去设置',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          uni.openSetting()
        }
      }
    })
    return
  }

  uni.showToast({
    title: '保存失败，请重试',
    icon: 'none'
  })
}

function saveQrToAlbum() {
  if (isSaving.value) {
    return
  }

  isSaving.value = true

  uni.getImageInfo({
    src: props.qrSrc,
    success: info => {
      uni.saveImageToPhotosAlbum({
        filePath: info.path,
        success: () => {
          uni.showToast({
            title: '已保存到相册',
            icon: 'success'
          })
        },
        fail: handleSaveFail,
        complete: () => {
          isSaving.value = false
        }
      })
    },
    fail: () => {
      isSaving.value = false
      uni.showToast({
        title: '二维码加载失败',
        icon: 'none'
      })
    }
  })
}
</script>

<template>
  <view v-if="visible" class="qr-mask" @tap="close">
    <view class="qr-dialog" @tap.stop>
      <view class="qr-glow"></view>
      <button class="qr-close" @tap="close">×</button>

      <text class="qr-kicker">MUSHANCHUAN · 微信客服</text>
      <text class="qr-title">{{ title }}</text>

      <view class="qr-frame">
        <view class="qr-corner qr-corner--tl"></view>
        <view class="qr-corner qr-corner--tr"></view>
        <view class="qr-corner qr-corner--bl"></view>
        <view class="qr-corner qr-corner--br"></view>
        <view class="qr-sheen"></view>
        <image
          class="qr-image"
          :src="qrSrc"
          mode="aspectFit"
          show-menu-by-longpress="true"
        />
      </view>

      <view class="qr-hint">
        <view class="qr-hint-dot"></view>
        <text class="qr-hint-text">长按二维码 · 识别添加</text>
      </view>
      <text class="qr-desc">{{ desc }}</text>

      <button
        class="qr-save"
        :class="{ 'qr-save--disabled': isSaving }"
        :disabled="isSaving"
        hover-class="qr-save--hover"
        @tap="saveQrToAlbum"
      >
        {{ isSaving ? '保存中…' : '保存二维码到相册' }}
      </button>
    </view>
  </view>
</template>

<style scoped>
.qr-mask {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
  background: rgba(17, 22, 18, 0.56);
  -webkit-backdrop-filter: blur(6rpx);
  backdrop-filter: blur(6rpx);
  animation: qr-fade 0.24s ease-out;
}

.qr-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600rpx;
  padding: 56rpx 48rpx 48rpx;
  overflow: hidden;
  border: 1rpx solid rgba(255, 248, 237, 0.4);
  border-radius: 36rpx;
  background:
    radial-gradient(circle at 50% -10%, rgba(63, 95, 69, 0.16), transparent 46%),
    linear-gradient(180deg, #ffffff 0%, #fbf7ed 100%),
    #fffdfa;
  box-sizing: border-box;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.95),
    0 40rpx 90rpx rgba(12, 20, 14, 0.34);
  animation: qr-pop 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.qr-glow {
  position: absolute;
  top: -120rpx;
  left: 50%;
  width: 360rpx;
  height: 360rpx;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(215, 174, 88, 0.28),
    transparent 68%
  );
  pointer-events: none;
}

.qr-close {
  position: absolute;
  top: 18rpx;
  right: 24rpx;
  z-index: 2;
  width: 64rpx;
  height: 64rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  color: #9aa093;
  font-size: 54rpx;
  font-weight: 300;
  line-height: 60rpx;
}

.qr-close::after,
.qr-save::after {
  border: 0;
}

.qr-kicker {
  position: relative;
  z-index: 1;
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  letter-spacing: 1rpx;
  line-height: 28rpx;
}

.qr-title {
  position: relative;
  z-index: 1;
  margin-top: 10rpx;
  color: #16261c;
  font-size: 42rpx;
  font-weight: 900;
  letter-spacing: 1rpx;
  line-height: 54rpx;
}

.qr-frame {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 396rpx;
  height: 502rpx;
  margin-top: 40rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(160deg, #ffffff 0%, #f4f6f1 100%);
  box-sizing: border-box;
  box-shadow:
    inset 0 0 0 1rpx rgba(34, 61, 45, 0.08),
    0 18rpx 40rpx rgba(34, 42, 34, 0.14);
}

.qr-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.qr-corner {
  position: absolute;
  z-index: 2;
  width: 40rpx;
  height: 40rpx;
  border: 5rpx solid #223d2d;
  pointer-events: none;
}

.qr-corner--tl {
  top: 14rpx;
  left: 14rpx;
  border-right: 0;
  border-bottom: 0;
  border-radius: 14rpx 0 0 0;
}

.qr-corner--tr {
  top: 14rpx;
  right: 14rpx;
  border-bottom: 0;
  border-left: 0;
  border-radius: 0 14rpx 0 0;
}

.qr-corner--bl {
  bottom: 14rpx;
  left: 14rpx;
  border-top: 0;
  border-right: 0;
  border-radius: 0 0 0 14rpx;
}

.qr-corner--br {
  bottom: 14rpx;
  right: 14rpx;
  border-top: 0;
  border-left: 0;
  border-radius: 0 0 14rpx 0;
}

.qr-sheen {
  position: absolute;
  top: 26rpx;
  right: 26rpx;
  left: 26rpx;
  z-index: 1;
  height: 96rpx;
  border-radius: 12rpx;
  background: linear-gradient(
    180deg,
    rgba(215, 174, 88, 0.16),
    rgba(215, 174, 88, 0)
  );
  pointer-events: none;
  animation: qr-scan 2.8s ease-in-out infinite;
}

.qr-hint {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: 36rpx;
  padding: 12rpx 26rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.16);
  border-radius: 999rpx;
  background: rgba(34, 61, 45, 0.06);
}

.qr-hint-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx;
  border-radius: 50%;
  background: #d7ae58;
  box-shadow: 0 0 0 6rpx rgba(215, 174, 88, 0.2);
  animation: qr-blink 1.6s ease-in-out infinite;
}

.qr-hint-text {
  color: #223d2d;
  font-size: 26rpx;
  font-weight: 850;
  line-height: 34rpx;
}

.qr-desc {
  position: relative;
  z-index: 1;
  max-width: 440rpx;
  margin-top: 16rpx;
  color: #73786f;
  font-size: 23rpx;
  line-height: 34rpx;
  text-align: center;
}

.qr-save {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 88rpx;
  margin: 40rpx 0 0;
  padding: 0;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 18rpx;
  background: linear-gradient(180deg, #3f5f45 0%, #223d2d 100%), #223d2d;
  color: #fffdfa;
  font-size: 29rpx;
  font-weight: 850;
  line-height: 88rpx;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.18),
    0 16rpx 34rpx rgba(34, 61, 45, 0.24);
}

.qr-save--hover {
  opacity: 0.86;
}

.qr-save--disabled {
  opacity: 0.66;
}

@keyframes qr-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes qr-pop {
  from {
    opacity: 0;
    transform: translateY(40rpx) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes qr-scan {
  0% {
    transform: translateY(0);
    opacity: 0.9;
  }

  50% {
    transform: translateY(328rpx);
    opacity: 0.4;
  }

  100% {
    transform: translateY(0);
    opacity: 0.9;
  }
}

@keyframes qr-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
