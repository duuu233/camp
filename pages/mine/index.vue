<script setup>
import { shallowRef } from 'vue'
import CampTabBar from '../../components/CampTabBar.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import { useCloudImageUrl } from '../../composables/useCloudImageUrl.js'
import { brand, profileGroups } from '../../data/campData.js'

const user = shallowRef(null)
const logoSrc = useCloudImageUrl(() => brand.logo)

function loginWithWechat() {
  if (uni.getUserProfile) {
    uni.getUserProfile({
      desc: '用于展示头像和昵称',
      success: res => {
        const userInfo = res.userInfo || {}
        user.value = {
          nickname: userInfo.nickName || '暮山川用户',
          avatar: userInfo.avatarUrl || ''
        }
        uni.showToast({
          title: '已登录',
          icon: 'none'
        })
      },
      fail: () => {
        uni.showToast({
          title: '已取消登录',
          icon: 'none'
        })
      }
    })
    return
  }

  user.value = {
    nickname: '暮山川用户',
    avatar: ''
  }
}

function showReservedToast() {
  uni.showToast({
    title: '内容预留',
    icon: 'none'
  })
}
</script>

<template>
  <view class="page">
    <view class="status-space"></view>

    <view class="profile-card">
      <view class="logo-orbit">
        <image class="logo-mark" :src="logoSrc" mode="aspectFit" />
      </view>
      <view class="profile-body">
        <view class="avatar-wrap">
          <image
            v-if="user && user.avatar"
            class="avatar-img"
            :src="user.avatar"
            mode="aspectFill"
          />
          <text v-else class="avatar-text">暮</text>
        </view>
        <view class="profile-copy">
          <text class="profile-name">{{
            user ? user.nickname : '未登录'
          }}</text>
          <text class="profile-subtitle"
            >登录后保留昵称展示，套餐咨询请使用微信客服</text
          >
        </view>
        <button
          v-if="!user"
          class="login-button"
          hover-class="login-button--hover"
          @tap="loginWithWechat"
        >
          登录
        </button>
      </view>
    </view>

    <view class="service-panel">
      <view class="panel-copy">
        <text class="panel-kicker">MUSHANCHUAN</text>
        <text class="panel-title">BBQ 装备租赁与活动策划</text>
        <text class="panel-desc"
          >确认套餐、档期、配送范围、加配布置和团建方案。</text
        >
      </view>
      <CustomerServiceButton label="联系微信客服" variant="solid" />
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

    <CampTabBar active="mine" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
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
  margin-top: 28rpx;
  overflow: hidden;
  border-radius: 40rpx;
  background:
    linear-gradient(135deg, rgba(34, 61, 45, 0.94), rgba(71, 88, 65, 0.92)),
    #223d2d;
  box-shadow: 0 28rpx 76rpx rgba(30, 42, 32, 0.22);
}

.logo-orbit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 320rpx;
  overflow: hidden;
}

.logo-mark {
  width: 290rpx;
  height: 290rpx;
  opacity: 0.9;
}

.profile-body {
  display: flex;
  align-items: center;
  padding: 0 30rpx 30rpx;
}

.avatar-wrap {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;
  border: 5rpx solid rgba(255, 248, 237, 0.82);
  border-radius: 50%;
  background: #d7ae58;
}

.avatar-img {
  width: 112rpx;
  height: 112rpx;
}

.avatar-text {
  color: #223d2d;
  font-size: 46rpx;
  font-weight: 900;
  line-height: 112rpx;
}

.profile-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 0 20rpx;
}

.profile-name {
  color: #fff8ed;
  font-size: 38rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.profile-subtitle {
  margin-top: 8rpx;
  color: rgba(255, 248, 237, 0.68);
  font-size: 22rpx;
  line-height: 32rpx;
}

.login-button {
  flex: 0 0 auto;
  width: 104rpx;
  height: 66rpx;
  margin: 0;
  padding: 0;
  border-radius: 20rpx;
  background: #fff8ed;
  color: #223d2d;
  font-size: 26rpx;
  font-weight: 850;
  line-height: 66rpx;
}

.login-button::after {
  border: 0;
}

.login-button--hover {
  opacity: 0.86;
}

.service-panel {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
  padding: 28rpx;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 32rpx;
  background: #fffdfa;
  box-shadow: 0 18rpx 52rpx rgba(34, 42, 34, 0.08);
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

.menu-card {
  margin-top: 28rpx;
  overflow: hidden;
  border: 1rpx solid rgba(34, 61, 45, 0.08);
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 16rpx 46rpx rgba(34, 42, 34, 0.06);
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
</style>
