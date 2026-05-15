<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
page {
  min-height: 100%;
  background: #f2f5ef;
  color: #171b17;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue',
    Helvetica, sans-serif;
  letter-spacing: 0;
}

view,
text,
button,
input,
textarea,
scroll-view,
image {
  box-sizing: border-box;
}

button {
  font-family: inherit;
  letter-spacing: 0;
}
</style>
