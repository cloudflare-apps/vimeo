(function () {
  const elements = []
  let options = INSTALL_OPTIONS
  const CONTAINER_CLASS = "eager-vimeo"
  const FULLSCREEN_ATTRIBUTES = [
    "webkitallowfullscreen",
    "mozallowfullscreen",
    "allowfullscreen"
  ]

  const URL_PATTERN = /vimeo\.com\/?(.*)\/(.*)/i

  function getVideoParams(url = "") {
    const match = URL_PATTERN.exec(url)

    if (!match) return null

    const params = {
      id: match[2],
      type: match[1] || "video"
    }

    if (params.type === "album") params.type = "hubnut/album"

    return params
  }

  function updateElements() {
    const {embeds} = options

    embeds
      .reverse()
      .map($ => ({...$, params: getVideoParams($.url)}))
      .filter($ => $.params)
      .forEach(({params, location, autoplay}, i) => {
        let src = `https://player.vimeo.com/${params.type}/${params.id}?title=0&byline=0&portrait=0`

        if (autoplay) {
          src += "&autoplay=1"
        }

        const element = elements[i] = Eager.createElement(location, elements[i])

        element.className = CONTAINER_CLASS
        const iframe = document.createElement("iframe")

        iframe.addEventListener("load", () => element.setAttribute("data-state", "loaded"))

        iframe.src = src
        iframe.frameBorder = 0
        FULLSCREEN_ATTRIBUTES.forEach(attribute => iframe.setAttribute(attribute, ""))
        element.appendChild(iframe)
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
