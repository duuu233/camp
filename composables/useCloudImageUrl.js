import { onMounted, shallowRef, watch } from "vue";
import { cloudEnvId } from "../data/campData.js";
import { ensureWechatCloudReady } from "./useWechatCloud.js";

const imageDebugPrefix = "[ImageDebug]";
const capsuleFallbackStyle = {
  "--status-bar-height": "88rpx",
  "--capsule-safe-right": "30rpx",
  "--capsule-top-gap": "22rpx",
  "--capsule-after-gap": "28rpx",
  "--capsule-button-height": "64rpx",
  "--capsule-reserved-height": "174rpx",
  "--capsule-block-offset": "114rpx",
};

function logImageDebug(stage, payload) {
  if (typeof console !== "undefined" && console.log) {
    console.log(`${imageDebugPrefix} ${stage}`, payload);
  }
}

function getImageEventPayload(event) {
  const target = event && event.target;
  const currentTarget = event && event.currentTarget;

  return {
    type: event && event.type,
    detail: event && event.detail,
    targetDataset: target && target.dataset,
    currentTargetDataset: currentTarget && currentTarget.dataset,
  };
}

export function logImageRenderEvent(scope, rawSrc, resolvedSrc, event) {
  logImageDebug("render-event", {
    scope,
    rawSrc,
    resolvedSrc,
    hasResolvedSrc: !!resolvedSrc,
    event: getImageEventPayload(event),
  });
}

function readSource(source) {
  if (typeof source === "function") {
    return source();
  }

  if (source && typeof source === "object" && "value" in source) {
    return source.value;
  }

  return source;
}

function getCloudFallbackUrl(fileId) {
  if (typeof fileId !== "string") {
    return "";
  }

  const normalizedFileId = fileId.replace(/\\/g, "/");
  const fileName = normalizedFileId.split("/").filter(Boolean).pop();

  if (!fileName) {
    return "";
  }

  if (normalizedFileId.includes("/Ingredients/")) {
    return `/static/Ingredients/${fileName}`;
  }

  return `/static/${fileName}`;
}

function resolveCloudFallback(fileId, reason, detail) {
  const fallbackUrl = getCloudFallbackUrl(fileId);

  logImageDebug("resolve:fallback", {
    fileId,
    reason,
    fallbackUrl,
    hasFallbackUrl: !!fallbackUrl,
    detail,
  });

  return fallbackUrl;
}

export function resolveCloudImageUrl(fileId) {
  logImageDebug("resolve:start", {
    fileId,
    fileIdType: typeof fileId,
  });

  if (!fileId) {
    logImageDebug("resolve:empty-source", {
      fileId,
    });
    return Promise.resolve("");
  }

  if (typeof fileId !== "string" || !fileId.startsWith("cloud://")) {
    logImageDebug("resolve:direct-source", {
      fileId,
    });
    return Promise.resolve(fileId);
  }

  // #ifdef MP-WEIXIN
  const hasWx = typeof wx !== "undefined";
  const hasWxCloud = hasWx && !!wx.cloud;

  logImageDebug("wx-cloud:check", {
    fileId,
    hasWx,
    hasWxCloud,
    cloudEnvId,
  });

  if (!hasWxCloud) {
    logImageDebug("wx-cloud:missing", {
      fileId,
    });
    return Promise.resolve(resolveCloudFallback(fileId, "wx-cloud-missing"));
  }

  return ensureWechatCloudReady()
    .then(
      () =>
        new Promise((resolve) => {
          logImageDebug("wx-cloud:ready", {
            cloudEnvId,
          });

          logImageDebug("wx-cloud:getTempFileURL:start", {
            fileId,
          });

          wx.cloud.getTempFileURL({
            fileList: [fileId],
            success: (res) => {
              const file = res.fileList && res.fileList[0];
              const resolvedUrl = file && file.status === 0 ? file.tempFileURL : "";
              logImageDebug("wx-cloud:getTempFileURL:success", {
                fileId,
                file,
                resolvedUrl,
                rawResponse: res,
              });

              if (resolvedUrl) {
                resolve(resolvedUrl);
                return;
              }

              logImageDebug("wx-cloud:getTempFileURL:file-error", {
                fileId,
                status: file && file.status,
                errMsg: file && file.errMsg,
                file,
              });
              resolve(resolveCloudFallback(fileId, "getTempFileURL-empty", file));
            },
            fail: (error) => {
              logImageDebug("wx-cloud:getTempFileURL:fail", {
                fileId,
                error,
                message: error && error.errMsg,
              });
              resolve(resolveCloudFallback(fileId, "getTempFileURL-fail", error));
            },
          });
        }),
    )
    .catch((error) => {
      logImageDebug("wx-cloud:init-fail", {
        cloudEnvId,
        error,
        message: error && error.message,
      });
      return resolveCloudFallback(fileId, "wx-cloud-init-fail", {
        error,
        message: error && error.message,
      });
    });
  // #endif

  // #ifndef MP-WEIXIN
  return Promise.resolve(fileId);
  // #endif
}

export function useCloudImageUrl(source) {
  const imageUrl = shallowRef("");
  let resolveCount = 0;

  watch(
    () => readSource(source),
    async (fileId) => {
      const requestId = ++resolveCount;
      logImageDebug("watch:source", {
        requestId,
        fileId,
      });

      const resolvedUrl = await resolveCloudImageUrl(fileId);
      imageUrl.value = resolvedUrl;

      logImageDebug("watch:resolved", {
        requestId,
        fileId,
        resolvedUrl,
        hasResolvedUrl: !!resolvedUrl,
      });
    },
    { immediate: true },
  );

  return imageUrl;
}

export function previewImageUrl(current, urls) {
  const currentUrl = readSource(current);
  const previewUrls = (Array.isArray(urls) ? urls : [current])
    .map((url) => readSource(url))
    .filter(Boolean);

  if (!currentUrl || !previewUrls.length || typeof uni === "undefined") {
    return;
  }

  uni.previewImage({
    current: currentUrl,
    urls: previewUrls,
  });
}

function readCapsuleStyle() {
  // #ifdef MP-WEIXIN
  try {
    const systemInfo =
      typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
    const menuButton =
      typeof uni.getMenuButtonBoundingClientRect === "function"
        ? uni.getMenuButtonBoundingClientRect()
        : typeof wx !== "undefined" &&
            typeof wx.getMenuButtonBoundingClientRect === "function"
          ? wx.getMenuButtonBoundingClientRect()
          : null;

    if (!menuButton || !menuButton.width || !systemInfo.windowWidth) {
      return capsuleFallbackStyle;
    }

    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const menuTop = Math.max(menuButton.top || statusBarHeight, statusBarHeight);
    const topGap = Math.max(menuTop - statusBarHeight, 6);
    const buttonHeight = Math.max(menuButton.height, 32);
    const safeRight = Math.max(systemInfo.windowWidth - menuButton.left + 8, 104);
    const afterGap = Math.max(topGap + 10, 18);
    const reservedHeight = menuTop + buttonHeight;

    return {
      "--status-bar-height": `${statusBarHeight}px`,
      "--capsule-safe-right": `${safeRight}px`,
      "--capsule-top-gap": `${topGap}px`,
      "--capsule-after-gap": `${afterGap}px`,
      "--capsule-button-height": `${buttonHeight}px`,
      "--capsule-reserved-height": `${reservedHeight}px`,
      "--capsule-block-offset": `${topGap + buttonHeight + afterGap}px`,
    };
  } catch (error) {
    return capsuleFallbackStyle;
  }
  // #endif

  return capsuleFallbackStyle;
}

export function useCapsuleSafeArea() {
  const safeAreaStyle = shallowRef(readCapsuleStyle());

  onMounted(() => {
    safeAreaStyle.value = readCapsuleStyle();
  });

  return safeAreaStyle;
}
