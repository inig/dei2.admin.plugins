let domtoimage = require('dom-to-image')
let axios = require('axios')
let ZpmCapture = {}

ZpmCapture.install = function (Vue, opts) {
  if (ZpmCapture.installed) return

  this.ZpmCapture = {}

  Vue.prototype.screenshot = function (args) {
    return new Promise((resolve, reject) => {
      let _params = {
        el: document.documentElement,
        fileName: 'screenshot.png',
        fileSize: 2 * 1024 * 1024
      }
      let params = Object.assign(_params, args)

      let _uploadUrl = 'https://talkapi.dei2.com/Zpm/user/uploadScreenshot?phonenum=' + params.phonenum + '&token=' + params.token + '&ms=' + params.fileSize + '&accept=jpg;png;jpeg'

      if (args.rename) {
        _uploadUrl = _uploadUrl + '&rn=' + args.rename
      }

      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      domtoimage.toBlob(params.el)
        .then((blob) => {
          let form = new FormData()
          form.append('file', blob, params.fileName)
          axios.post(_uploadUrl, form, config)
            .then(response => {
              if (response.status === 200) {
                resolve(response)
              } else {
                reject(response)
              }
            })
        })
        .catch(function (err) {
          reject(err)
        })
    }).catch(error => {
      console.log(error)
    })
  }
}

export default ZpmCapture
