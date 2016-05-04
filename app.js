(function () {
  const elements = []
  let options = INSTALL_OPTIONS
  const CONTAINER_CLASS = "eager-vimeo"

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

        element.className = CONTAINER_CLASS
        const eagerIframe = document.createElement("iframe")

        eagerIframe.src = `${src}`
        eagerIframe.frameborder = "0"
        element.appendChild(eagerIframe)

        eagerIframe.addEventListener("load", function handle(){
          element.setAttribute("data-state", "loaded")
        })

        // element.innerHTML = `<iframe src="${src}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
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
