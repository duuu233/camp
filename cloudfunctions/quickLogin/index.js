const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

async function readPhoneNumber(phoneCode) {
  if (!phoneCode) {
    return ''
  }

  try {
    const result = await cloud.openapi.phonenumber.getPhoneNumber({
      code: phoneCode
    })
    const phoneInfo = result && result.phoneInfo
    return (phoneInfo && phoneInfo.phoneNumber) || ''
  } catch (error) {
    console.warn('Failed to resolve phone number', error)
    return ''
  }
}

exports.main = async (event = {}) => {
  const wxContext = cloud.getWXContext()

  if (!wxContext.OPENID) {
    throw new Error('Failed to resolve WeChat OPENID')
  }

  const phoneNumber = await readPhoneNumber(event.phoneCode)

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID || '',
    env: wxContext.ENV,
    phoneNumber,
    loginAt: Date.now()
  }
}
