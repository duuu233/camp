<script setup>
import { computed, shallowRef } from 'vue'
import { brand } from '../data/campData.js'
import { useLocalProfile } from '../composables/useLocalProfile.js'

const { profile, isSaving, saveProfile, clearProfile } = useLocalProfile()
const visible = shallowRef(false)
const nickname = shallowRef('')
const avatar = shallowRef('')
const avatarSrc = computed(() => profile.value?.avatar || brand.logos.mark)
const draftAvatarSrc = computed(() => avatar.value || brand.logos.mark)

function openEditor() {
  nickname.value = profile.value?.nickname || ''
  avatar.value = profile.value?.avatar || ''
  visible.value = true
}

function closeEditor() {
  if (!isSaving.value) visible.value = false
}

function chooseAvatar(event) {
  if (!isSaving.value && event.detail?.avatarUrl) avatar.value = event.detail.avatarUrl
}

function changeNickname(event) {
  nickname.value = typeof event.detail?.value === 'string' ? event.detail.value : ''
}

async function save() {
  if (isSaving.value) return
  try {
    await saveProfile({ nickname: nickname.value, avatar: avatar.value })
    visible.value = false
    uni.showToast({ title: '资料已保存到本机', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: error.message || '资料保存失败', icon: 'none' })
  }
}

function clear() {
  if (isSaving.value) return
  uni.showModal({
    title: '清除本机资料',
    content: '将删除本机保存的头像和昵称，不影响浏览和联系客服。',
    success: result => {
      if (!result.confirm || isSaving.value) return
      try {
        clearProfile()
        nickname.value = ''
        avatar.value = ''
        visible.value = false
        uni.showToast({ title: '本机资料已清除', icon: 'none' })
      } catch {
        uni.showToast({ title: '清除失败，请重试', icon: 'none' })
      }
    }
  })
}
</script>

<template>
  <view class="local-profile">
    <view class="profile-card">
      <view class="logo-orbit">
        <image class="logo-mark" :src="brand.logos.white" mode="aspectFit" />
      </view>
      <view class="profile-body" :class="{ 'profile-body--guest': !profile }" @tap="openEditor">
        <view class="avatar-wrap">
          <image class="avatar-img" :src="avatarSrc" :mode="profile?.avatar ? 'aspectFill' : 'aspectFit'" />
        </view>
        <view class="profile-copy">
          <text class="profile-name">{{ profile?.nickname || '个人资料' }}</text>
          <text class="profile-subtitle">{{ profile ? '资料仅保存在本机' : '设置喜欢的头像和昵称' }}</text>
          <text class="profile-warm-line">无需登录，随时咨询</text>
        </view>
        <view class="profile-action">
          <button class="profile-button" hover-class="profile-button--hover" @tap.stop="openEditor">
            {{ profile ? '编辑资料' : '设置资料' }}
          </button>
        </view>
      </view>
    </view>

    <view v-if="visible" class="profile-dialog-mask" @tap="closeEditor">
      <view class="profile-dialog" @tap.stop>
        <button class="dialog-close" :disabled="isSaving" @tap="closeEditor">×</button>
        <text class="dialog-title">{{ profile ? '编辑个人资料' : '设置个人资料' }}</text>
        <button class="dialog-avatar" open-type="chooseAvatar" :disabled="isSaving" hover-class="dialog-avatar--hover" @chooseavatar="chooseAvatar">
          <image class="dialog-avatar-img" :src="draftAvatarSrc" mode="aspectFill" />
          <view class="dialog-avatar-edit"><text>改</text></view>
        </button>
        <input class="dialog-nickname" type="nickname" maxlength="24" placeholder="请输入昵称" placeholder-class="dialog-nickname-placeholder" :value="nickname" :disabled="isSaving" @input="changeNickname" @blur="changeNickname" />
        <text class="profile-note">仅保存在本机，更换设备后需重新设置</text>
        <button class="dialog-save-button" :disabled="isSaving" :loading="isSaving" hover-class="dialog-save-button--hover" @tap="save">保存资料</button>
        <button v-if="profile" class="clear-profile-button" :disabled="isSaving" @tap="clear">清除本机资料</button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.profile-card {
  position: relative;
  margin-top: var(--capsule-block-offset);
  overflow: hidden;
  border: 1rpx solid rgba(255, 248, 237, 0.18);
  border-radius: 24rpx;
  background:
    linear-gradient(180deg, rgba(76, 95, 69, 0.94), rgba(31, 53, 39, 0.96)),
    #223d2d;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.16),
    inset 0 -2rpx 0 rgba(0, 0, 0, 0.14),
    0 22rpx 56rpx rgba(30, 42, 32, 0.2);
}

.profile-card::before {
  position: absolute;
  top: 1rpx;
  right: 10rpx;
  left: 10rpx;
  height: 46rpx;
  border-radius: 18rpx;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16),
    rgba(255, 255, 255, 0)
  );
  content: '';
}

.logo-orbit {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 320rpx;
  overflow: hidden;
  padding: 0;
}

.logo-mark {
  width: 290rpx;
  height: 290rpx;
  opacity: 0.9;
}

.profile-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 142rpx;
  margin: 0 24rpx 24rpx;
  padding: 20rpx 22rpx;
  border: 1rpx solid rgba(255, 248, 237, 0.14);
  border-radius: 20rpx;
  background: rgba(255, 248, 237, 0.08);
  box-sizing: border-box;
  text-align: left;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.12),
    0 14rpx 34rpx rgba(12, 20, 14, 0.1);
}

.profile-body--guest {
  background:
    linear-gradient(
      90deg,
      rgba(255, 248, 237, 0.12),
      rgba(255, 248, 237, 0.05)
    ),
    rgba(255, 248, 237, 0.08);
}

.avatar-wrap {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;

  border-radius: 50%;
  background:
    linear-gradient(
      180deg,
      var(--mine-theme-green-pale) 0%,
      var(--mine-theme-green-soft) 100%
    ),
    var(--mine-theme-green-soft);
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.5),
    0 12rpx 26rpx rgba(20, 32, 23, 0.2);
}

.avatar-img,
.avatar-button,
.avatar-mark {
  width: 112rpx;
  height: 112rpx;
}

.avatar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  line-height: 1;
}

.avatar-button::after {
  border: 0;
}

.avatar-mark {
  box-sizing: border-box;
  /* padding: 18rpx;
  opacity: 0.94; */
}

.profile-copy {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
  min-width: 0;
  margin-left: 22rpx;
  padding-right: 18rpx;
}

.profile-name {
  color: #fff8ed;
  font-size: 38rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.profile-name-input {
  width: 100%;
  height: 50rpx;
  min-height: 50rpx;
  padding: 0;
  background: transparent;
  color: #fff8ed;
  font-size: 38rpx;
  font-weight: 900;
  line-height: 50rpx;
  text-align: left;
}

.profile-subtitle {
  max-width: 450rpx;
  margin-top: 8rpx;
  color: rgba(255, 248, 237, 0.68);
  font-size: 22rpx;
  line-height: 32rpx;
}

.profile-warm-line {
  max-width: 450rpx;
  margin-top: 4rpx;
  color: rgba(224, 237, 221, 0.88);
  font-size: 22rpx;
  font-weight: 650;
  line-height: 32rpx;
}

.profile-action {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  min-width: 154rpx;
}

.profile-status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52rpx;
  padding: 0 18rpx;
  border: 1rpx solid rgba(224, 237, 221, 0.24);
  border-radius: 999rpx;
  background: rgba(18, 31, 23, 0.18);
  color: rgba(255, 248, 237, 0.86);
  font-size: 22rpx;
  font-weight: 780;
  line-height: 52rpx;
}

.profile-status-dot {
  width: 10rpx;
  height: 10rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  background: #dfe9df;
  box-shadow: 0 0 0 5rpx rgba(223, 233, 223, 0.13);
}

.profile-button {
  width: 172rpx;
  height: 58rpx;
  margin: 0;
  padding: 0;
  border: 1rpx solid rgba(229, 242, 225, 0.72);
  border-radius: 14rpx;
  background:
    linear-gradient(
      180deg,
      var(--mine-theme-green-pale) 0%,
      var(--mine-theme-green-soft) 100%
    ),
    var(--mine-theme-green-soft);
  color: var(--mine-theme-green-deep);
  font-size: 25rpx;
  font-weight: 880;
  line-height: 58rpx;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.78),
    0 10rpx 22rpx rgba(12, 20, 14, 0.14);
}

.profile-button::after {
  border: 0;
}

.profile-button--hover {
  opacity: 0.86;
}

.profile-button--disabled {
  opacity: 0.72;
}


.profile-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(17, 22, 18, 0.54);
}

.profile-dialog {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 46rpx 54rpx calc(50rpx + env(safe-area-inset-bottom));
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-bottom: 0;
  border-radius: 28rpx 28rpx 0 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 253, 250, 0)),
    radial-gradient(circle at 50% 16%, rgba(63, 95, 69, 0.12), transparent 28%),
    #fffdfa;
  box-sizing: border-box;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.95),
    0 -18rpx 56rpx rgba(12, 20, 14, 0.16);
}

.dialog-close {
  position: absolute;
  top: 28rpx;
  right: 34rpx;
  width: 66rpx;
  height: 66rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  color: #7b8077;
  font-size: 58rpx;
  font-weight: 300;
  line-height: 60rpx;
}

.dialog-close::after,
.dialog-avatar::after,
.dialog-save-button::after {
  border: 0;
}

.dialog-title {
  color: #0f1410;
  font-size: 40rpx;
  font-weight: 900;
  line-height: 54rpx;
}

.dialog-avatar {
  position: relative;
  width: 148rpx;
  height: 148rpx;
  margin: 76rpx 0 0;
  padding: 0;

  border-radius: 22rpx;

  line-height: 1;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.7),
    0 14rpx 32rpx rgba(34, 42, 34, 0.1);
}

.dialog-avatar--hover {
  opacity: 0.86;
}

.dialog-avatar-img {
  width: 148rpx;
  height: 148rpx;
  border-radius: 22rpx;
}

.dialog-avatar-edit {
  position: absolute;
  right: -2rpx;
  bottom: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid #fffdfa;
  border-radius: 14rpx;
  background:
    linear-gradient(
      180deg,
      var(--mine-theme-green-mid) 0%,
      var(--mine-theme-green) 100%
    ),
    var(--mine-theme-green);
  color: #fff8ed;
}

.dialog-avatar-edit text {
  font-size: 21rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.dialog-nickname {
  width: 100%;
  height: 86rpx;
  min-height: 86rpx;
  margin-top: 42rpx;
  padding: 0 12rpx;
  border-bottom: 1rpx solid rgba(34, 61, 45, 0.12);
  color: #171b17;
  font-size: 34rpx;
  font-weight: 820;
  line-height: 86rpx;
  text-align: center;
}

.dialog-nickname-placeholder {
  color: #9c9f98;
  font-weight: 620;
}

.dialog-save-button {
  width: 100%;
  height: 88rpx;
  margin: 48rpx 0 0;
  padding: 0;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 18rpx;
  background:
    linear-gradient(
      180deg,
      var(--mine-theme-green-mid) 0%,
      var(--mine-theme-green) 100%
    ),
    var(--mine-theme-green);
  color: #fffdfa;
  font-size: 31rpx;
  font-weight: 850;
  line-height: 88rpx;
  box-shadow:
    inset 0 2rpx 0 rgba(255, 255, 255, 0.18),
    0 16rpx 34rpx rgba(34, 61, 45, 0.2);
}

.dialog-save-button--hover {
  opacity: 0.86;
}


.profile-name { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-note { margin-top: 24rpx; color: #73786f; font-size: 24rpx; line-height: 36rpx; text-align: center; }
.clear-profile-button { margin: 24rpx 0 0; padding: 8rpx 24rpx; background: transparent; color: #73786f; font-size: 26rpx; line-height: 40rpx; }
.clear-profile-button::after { border: 0; }
</style>
