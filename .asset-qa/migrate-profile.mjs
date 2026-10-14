import fs from 'node:fs'
const file = 'pages/mine/index.vue'
const old = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')
const profileCss = old.slice(old.indexOf('.profile-card {'), old.indexOf('.service-panel {'))
  .replaceAll('login-button', 'profile-button')
const dialogCss = old.slice(old.indexOf('.login-dialog-mask {'), old.indexOf('.agreement-row {'))
  .replaceAll('login-dialog', 'profile-dialog').replaceAll('dialog-login-button', 'dialog-save-button')
const component = `<script setup>
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
${profileCss}
${dialogCss}
.profile-name { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-note { margin-top: 24rpx; color: #73786f; font-size: 24rpx; line-height: 36rpx; text-align: center; }
.clear-profile-button { margin: 24rpx 0 0; padding: 8rpx 24rpx; background: transparent; color: #73786f; font-size: 26rpx; line-height: 40rpx; }
.clear-profile-button::after { border: 0; }
</style>
`
fs.writeFileSync('components/LocalProfileCard.vue', component)
const script = `<script setup>
import { shallowRef } from 'vue'
import { onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app'
import CampTabBar from '../../components/CampTabBar.vue'
import LocalProfileCard from '../../components/LocalProfileCard.vue'
import CustomerServiceButton from '../../components/CustomerServiceButton.vue'
import PhoneCallButton from '../../components/PhoneCallButton.vue'
import PickupLocationCard from '../../components/PickupLocationCard.vue'
import WechatQrDialog from '../../components/WechatQrDialog.vue'
import { useCapsuleSafeArea } from '../../composables/useImageUrl.js'
import { buildShareMessage, buildShareTimeline, enableShareMenu } from '../../composables/useShare.js'
import { brand, profileGroups } from '../../data/campData.js'

const capsuleSafeAreaStyle = useCapsuleSafeArea()
const logoSrc = brand.logos.white
const showWechatQrDialog = shallowRef(false)
const shareConfig = { title: '暮山川 · 露营租赁 · 活动策划', path: '/pages/index/index', imageUrl: logoSrc }
onShareAppMessage(() => buildShareMessage(shareConfig))
onShareTimeline(() => buildShareTimeline(shareConfig))
onShow(enableShareMenu)

function openWechatQrDialog() { showWechatQrDialog.value = true }
function closeWechatQrDialog() { showWechatQrDialog.value = false }
function handleMenuTap(item) {
  const routes = { guide: '/pages/rental/index', agreement: '/pages/agreement/user', privacy: '/pages/agreement/privacy' }
  if (routes[item.id]) {
    uni.navigateTo({ url: routes[item.id] })
  } else if (item.id !== 'feedback') {
    uni.showToast({ title: '敬请期待', icon: 'none' })
  }
}
</script>`
let page = script + old.slice(old.indexOf('</script>') + '</script>'.length)
page = page.replace(/    <view class="profile-card">[\s\S]*?(?=    <view class="service-panel">)/, '    <LocalProfileCard />\n\n')
page = page.replace(/    <view\n      v-if="showLoginDialog"[\s\S]*?(?=    <WechatQrDialog)/, '')
page = page.replace(/\.profile-card \{[\s\S]*?(?=\.service-panel \{)/, '')
page = page.replace(/\.login-dialog-mask \{[\s\S]*?(?=<\/style>)/, '')
fs.writeFileSync(file, page)

let tests = fs.readFileSync('tests/local-images.test.mjs', 'utf8')
tests = tests.replaceAll("persistLocalAvatar('user', ", 'persistLocalAvatar(').replace('camp-avatar-user-', 'camp-avatar-local-')
fs.writeFileSync('tests/local-images.test.mjs', tests)
console.log('Extracted local-only profile component and simplified mine page.')
