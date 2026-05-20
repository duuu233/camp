<script setup>
import { computed, shallowRef, watch } from 'vue'
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PickupLocationCard from '../../components/PickupLocationCard.vue'
import {
  logImageRenderEvent,
  useCapsuleSafeArea,
  useCloudImageUrl
} from '../../composables/useCloudImageUrl.js'
import { useWechatLogin } from '../../composables/useWechatLogin.js'
import { brand, profileGroups } from '../../data/campData.js'

const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoSrc = useCloudImageUrl(() => brand.logos.white)
const defaultAvatarSrc = '/static/user.png'
const {
  user,
  isLoginLoading,
  isProfileSaving,
  loginError,
  loginWithWechat: requestWechatLogin,
  updateWechatProfile
} = useWechatLogin()

const nicknameDraft = shallowRef('')
const dialogNickname = shallowRef('')
const dialogAvatar = shallowRef('')
const showLoginDialog = shallowRef(false)
const hasAcceptedAgreement = shallowRef(false)

const avatarSrc = useCloudImageUrl(() => user.value && user.value.avatar)
const dialogAvatarSrc = useCloudImageUrl(
  () => dialogAvatar.value || brand.logos.mark
)

const profileSubtitle = computed(() => {
  if (isProfileSaving.value) {
    return '资料保存中'
  }

  return user.value
    ? '已登录，点击头像和昵称可更新'
    : '微信快捷登录，保存租赁进度'
})

const profileWarmLine = computed(() =>
  user.value ? '周末去山里，装备交给暮山川。' : ''
)

watch(
  () => user.value && user.value.nickname,
  nickname => {
    nicknameDraft.value = nickname || ''
  },
  { immediate: true }
)

function logMineImageEvent(scope, rawSrc, resolvedSrc, event) {
  logImageRenderEvent(`Mine:${scope}`, rawSrc, resolvedSrc, event)
}

function readInputValue(event) {
  return event && event.detail && typeof event.detail.value === 'string'
    ? event.detail.value
    : ''
}

function openLoginDialog() {
  if (user.value) {
    return
  }

  dialogNickname.value = ''
  dialogAvatar.value = ''
  showLoginDialog.value = true
}

function handleProfileBodyTap() {
  if (!user.value) {
    openLoginDialog()
  }
}

function closeLoginDialog() {
  if (isLoginLoading.value) {
    return
  }

  showLoginDialog.value = false
}

function toggleAgreement() {
  hasAcceptedAgreement.value = !hasAcceptedAgreement.value
}

function showAgreement(type) {
  uni.showToast({
    title: type === 'privacy' ? '隐私政策内容预留' : '用户协议内容预留',
    icon: 'none'
  })
}

function promptAcceptAgreement() {
  uni.showToast({
    title: '请先勾选同意协议',
    icon: 'none'
  })
}

function handleNicknameInput(event) {
  nicknameDraft.value = readInputValue(event)
}

function handleDialogNicknameInput(event) {
  dialogNickname.value = readInputValue(event)
}

async function saveWechatNickname(event) {
  const nickname = readInputValue(event)

  if (!user.value || nickname === user.value.nickname) {
    return
  }

  try {
    await updateWechatProfile({ nickname })
  } catch (error) {
    console.error('保存微信昵称失败', error)
    uni.showToast({
      title: '昵称保存失败',
      icon: 'none'
    })
  }
}

async function chooseWechatAvatar(event) {
  const avatarUrl = event && event.detail && event.detail.avatarUrl

  if (!user.value || !avatarUrl) {
    return
  }

  try {
    await updateWechatProfile({ avatar: avatarUrl })
  } catch (error) {
    console.error('保存微信头像失败', error)
    uni.showToast({
      title: '头像保存失败',
      icon: 'none'
    })
  }
}

function chooseDialogAvatar(event) {
  const avatarUrl = event && event.detail && event.detail.avatarUrl

  if (avatarUrl) {
    dialogAvatar.value = avatarUrl
  }
}

async function completeDialogLogin(phoneCode = '') {
  if (!hasAcceptedAgreement.value) {
    promptAcceptAgreement()
    return
  }

  try {
    await requestWechatLogin({ phoneCode })

    if (dialogNickname.value || dialogAvatar.value) {
      await updateWechatProfile({
        nickname: dialogNickname.value,
        avatar: dialogAvatar.value
      })
    }

    showLoginDialog.value = false
    uni.showToast({
      title: '已登录',
      icon: 'none'
    })
  } catch (error) {
    console.error('微信登录失败', error)
    uni.showToast({
      title: loginError.value || '微信登录失败',
      icon: 'none'
    })
  }
}

function loginWithWechatQuick() {
  completeDialogLogin('')
}

function showReservedToast() {
  uni.showToast({
    title: '内容预留',
    icon: 'none'
  })
}
</script>

<template>
  <view class="page" :style="capsuleSafeAreaStyle">
    <view class="status-space"></view>

    <view class="profile-card">
      <view class="logo-orbit">
        <image
          class="logo-mark"
          :src="logoSrc"
          mode="aspectFit"
          @load="
            logMineImageEvent('logo-mark', brand.logos.white, logoSrc, $event)
          "
          @error="
            logMineImageEvent('logo-mark', brand.logos.white, logoSrc, $event)
          "
        />
      </view>
      <view
        class="profile-body"
        :class="{ 'profile-body--guest': !user }"
        @tap="handleProfileBodyTap"
      >
        <view class="avatar-wrap">
          <button
            v-if="user"
            class="avatar-button"
            :disabled="isProfileSaving"
            open-type="chooseAvatar"
            @chooseavatar="chooseWechatAvatar"
          >
            <image
              v-if="avatarSrc"
              class="avatar-img"
              :src="avatarSrc"
              mode="aspectFill"
              @load="
                logMineImageEvent('avatar', user.avatar, avatarSrc, $event)
              "
              @error="
                logMineImageEvent('avatar', user.avatar, avatarSrc, $event)
              "
            />
            <image
              v-else
              class="avatar-mark"
              :src="defaultAvatarSrc"
              mode="aspectFit"
              @load="
                logMineImageEvent(
                  'avatar-default',
                  defaultAvatarSrc,
                  defaultAvatarSrc,
                  $event
                )
              "
              @error="
                logMineImageEvent(
                  'avatar-default',
                  defaultAvatarSrc,
                  defaultAvatarSrc,
                  $event
                )
              "
            />
          </button>
          <image
            v-else
            class="avatar-mark"
            :src="defaultAvatarSrc"
            mode="aspectFit"
            @load="
              logMineImageEvent(
                'guest-avatar',
                defaultAvatarSrc,
                defaultAvatarSrc,
                $event
              )
            "
            @error="
              logMineImageEvent(
                'guest-avatar',
                defaultAvatarSrc,
                defaultAvatarSrc,
                $event
              )
            "
          />
        </view>

        <view class="profile-copy">
          <input
            v-if="user"
            class="profile-name-input"
            type="nickname"
            maxlength="24"
            :value="nicknameDraft"
            :disabled="isProfileSaving"
            @input="handleNicknameInput"
            @blur="saveWechatNickname"
            @confirm="saveWechatNickname"
          />
          <text v-else class="profile-name">登录 / 注册</text>
          <text class="profile-subtitle">{{ profileSubtitle }}</text>
          <text class="profile-warm-line">{{ profileWarmLine }}</text>
        </view>

        <view class="profile-action">
          <button
            v-if="!user"
            class="login-button"
            :class="{ 'login-button--disabled': isLoginLoading }"
            :disabled="isLoginLoading"
            hover-class="login-button--hover"
            @tap.stop="openLoginDialog"
          >
            {{ isLoginLoading ? '登录中' : '立即登录' }}
          </button>
          <view v-else class="profile-status">
            <view class="profile-status-dot"></view>
            <text>已登录</text>
          </view>
        </view>
      </view>
    </view>

    <view class="service-panel">
      <view class="panel-copy">
        <text class="panel-kicker">MUSHANCHUAN</text>
        <text class="panel-title">BBQ 装备租赁与活动策划</text>
        <text class="panel-desc">
          确认套餐、档期、配送范围、加配布置和团建方案。
        </text>
      </view>
      <CustomerServiceButton label="联系微信客服" variant="solid" />
    </view>

    <view class="pickup-panel">
      <PickupLocationCard title="租赁设备自提地址" tone="dark" />
    </view>

    <view v-for="group in profileGroups" :key="group.id" class="menu-card">
      <view
        v-for="item in group.items"
        :key="item.id"
        class="menu-row"
        @tap="showReservedToast"
      >
        <view class="menu-copy">
          <text class="menu-label">{{ item.label }}</text>
          <text class="menu-value">{{ item.value }}</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view
      v-if="showLoginDialog"
      class="login-dialog-mask"
      @tap="closeLoginDialog"
    >
      <view class="login-dialog" @tap.stop>
        <button class="dialog-close" @tap="closeLoginDialog">×</button>
        <text class="dialog-title">请先完成注册/登录</text>

        <button
          class="dialog-avatar"
          open-type="chooseAvatar"
          hover-class="dialog-avatar--hover"
          @chooseavatar="chooseDialogAvatar"
        >
          <image
            class="dialog-avatar-img"
            :src="dialogAvatarSrc"
            mode="aspectFill"
            @load="
              logMineImageEvent(
                'dialog-avatar',
                dialogAvatar || brand.logos.mark,
                dialogAvatarSrc,
                $event
              )
            "
            @error="
              logMineImageEvent(
                'dialog-avatar',
                dialogAvatar || brand.logos.mark,
                dialogAvatarSrc,
                $event
              )
            "
          />
          <view class="dialog-avatar-edit">
            <text>改</text>
          </view>
        </button>

        <input
          class="dialog-nickname"
          type="nickname"
          maxlength="24"
          placeholder="请输入昵称"
          placeholder-class="dialog-nickname-placeholder"
          :value="dialogNickname"
          @input="handleDialogNicknameInput"
        />

        <button
          v-if="hasAcceptedAgreement"
          class="dialog-login-button"
          :disabled="isLoginLoading"
          :loading="isLoginLoading"
          hover-class="dialog-login-button--hover"
          @tap="loginWithWechatQuick"
        >
          微信快捷登录
        </button>
        <button
          v-else
          class="dialog-login-button"
          hover-class="dialog-login-button--hover"
          @tap="promptAcceptAgreement"
        >
          微信快捷登录
        </button>

        <view class="agreement-row" @tap="toggleAgreement">
          <view
            class="agreement-check"
            :class="{ 'agreement-check--active': hasAcceptedAgreement }"
          >
            <text v-if="hasAcceptedAgreement">✓</text>
          </view>
          <text class="agreement-text">我已阅读并同意</text>
          <text class="agreement-link" @tap.stop="showAgreement('user')">
            《用户协议》
          </text>
          <text class="agreement-link" @tap.stop="showAgreement('privacy')">
            《隐私政策》
          </text>
        </view>
      </view>
    </view>

    <CampTabBar active="mine" />
  </view>
</template>

<style scoped>
.page {
  --mine-theme-green: #223d2d;
  --mine-theme-green-deep: #17291f;
  --mine-theme-green-mid: #3f5f45;
  --mine-theme-green-soft: #dfe9df;
  --mine-theme-green-pale: #f2f7f1;

  min-height: 100vh;
  overflow-x: hidden;
  padding: 0 30rpx calc(150rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(
      circle at 20% 0%,
      rgba(213, 184, 124, 0.22),
      transparent 28%
    ),
    radial-gradient(circle at 88% 18%, rgba(34, 61, 45, 0.14), transparent 26%),
    linear-gradient(180deg, #fbfaf7 0%, #f2f5ef 100%);
  box-sizing: border-box;
}

.status-space {
  height: var(--status-bar-height);
}

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
  background: linear-gradient(
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

.login-button {
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

.login-button::after {
  border: 0;
}

.login-button--hover {
  opacity: 0.86;
}

.login-button--disabled {
  opacity: 0.72;
}

.service-panel {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.1);
  border-radius: 20rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbf7ed 100%), #fffdfa;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.88),
    0 12rpx 32rpx rgba(34, 42, 34, 0.07);
}

.panel-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding-right: 20rpx;
}

.panel-kicker {
  color: #c5973e;
  font-size: 20rpx;
  font-weight: 850;
  line-height: 28rpx;
}

.panel-title {
  margin-top: 8rpx;
  color: #171b17;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.panel-desc {
  margin-top: 6rpx;
  color: #73786f;
  font-size: 22rpx;
  line-height: 32rpx;
}

.pickup-panel {
  margin-top: 28rpx;
}

.menu-card {
  margin-top: 28rpx;
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.1);
  border-radius: 18rpx;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(250, 246, 237, 0.96)
    ),
    rgba(255, 255, 255, 0.92);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.92),
    0 10rpx 28rpx rgba(34, 42, 34, 0.055);
}

.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 108rpx;
  padding: 0 28rpx;
}

.menu-row + .menu-row::before {
  position: absolute;
  top: 0;
  right: 28rpx;
  left: 28rpx;
  height: 1rpx;
  background: rgba(34, 61, 45, 0.08);
  content: '';
}

.menu-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.menu-label {
  color: #171b17;
  font-size: 30rpx;
  font-weight: 850;
  line-height: 40rpx;
}

.menu-value {
  margin-top: 5rpx;
  overflow: hidden;
  color: #7b8077;
  font-size: 22rpx;
  line-height: 30rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-arrow {
  margin-left: 20rpx;
  color: #c1c7bd;
  font-size: 46rpx;
  line-height: 46rpx;
}

.login-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(17, 22, 18, 0.54);
}

.login-dialog {
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
.dialog-login-button::after {
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
  border: 1rpx solid rgba(34, 61, 45, 0.12);
  border-radius: 22rpx;
  background:
    linear-gradient(
      180deg,
      var(--mine-theme-green-pale) 0%,
      var(--mine-theme-green-soft) 100%
    ),
    var(--mine-theme-green-soft);
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

.dialog-login-button {
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

.dialog-login-button--hover {
  opacity: 0.86;
}

.agreement-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 36rpx;
}

.agreement-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  margin-right: 10rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.18);
  border-radius: 50%;
  background: #fff;
  color: #fffdfa;
}

.agreement-check--active {
  border-color: var(--mine-theme-green);
  background: var(--mine-theme-green);
}

.agreement-check text {
  font-size: 22rpx;
  font-weight: 900;
  line-height: 34rpx;
}

.agreement-text {
  color: #9c9f98;
  font-size: 24rpx;
  line-height: 34rpx;
}

.agreement-link {
  color: var(--mine-theme-green);
  font-size: 24rpx;
  line-height: 34rpx;
}
</style>
