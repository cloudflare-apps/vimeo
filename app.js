(function () {
  const elements = []
  let options = INSTALL_OPTIONS

  const vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i

  function getVideoID(url) {
    const match = vimeoRegex.exec(url)

    return match ? match[3] : null 
  }

  function updateElements() {      
    const {embeds} = options

    embeds
      .reverse()
      .filter($ => $.url)
      .forEach(({url, location, autoplay}, i) => {
        const info = getVideoID(url)

        let src = `https://player.vimeo.com/video/${info}?title=0&byline=0&portrait=0`

        if (autoplay) {
          src += "&autoplay=1"
        }

        const element = elements[i] = Eager.createElement(location, elements[i])

        element.innerHTML = `<div style="text-align: center; width: 100%"><iframe src="${src}" width="640" height="360" align="middle" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`
      })
  }
  

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElements)
  }
  else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      elements.forEach(element => Eager.createElement(null, element))
      options = nextOptions

      updateElements()
    }
  }
}())
