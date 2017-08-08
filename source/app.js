(function () {
  if (!window.addEventListener) return // Check for IE9+

  const UPDATE_DELAY = 1500
  const FULLSCREEN_ATTRIBUTES = [
    'webkitallowfullscreen',
    'mozallowfullscreen',
    'allowfullscreen'
  ]
  const elements = []
  let options = INSTALL_OPTIONS
  let updateTimeout

  const URL_PATTERN = /vimeo\.com\/?(.*)\/(.*)/i

  function getVideoParams (url = '') {
    const match = URL_PATTERN.exec(url)

    if (!match) return null

    const params = {
      id: match[2],
      type: match[1] || 'video'
    }

    // Albums aren't official supported in the previewer since they use
    // Flash in an sandboxed iframe. Perhaps they'll one day work!
    if (params.type === 'album') params.type = 'hubnut/album'

    return params
  }

  function updateElements () {
    options.embeds
      .reverse()
      .map($ => ({...$, params: getVideoParams($.url)}))
      .filter($ => $.params)
      .forEach(({params, autoplay, location}, i) => {
        let src = `https://player.vimeo.com/${params.type}/${params.id}?title=0&byline=0&portrait=0`

        if (autoplay) src += '&autoplay=1'

        const element = elements[i] = INSTALL.createElement(location, elements[i])
        element.setAttribute('app', 'vimeo')

        const iframe = document.createElement('iframe')

        iframe.src = src
        iframe.frameBorder = 0
        FULLSCREEN_ATTRIBUTES.forEach(attribute => iframe.setAttribute(attribute, ''))

        element.appendChild(iframe)
      })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElements)
  } else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      clearTimeout(updateTimeout)
      options = nextOptions

      updateTimeout = setTimeout(() => {
        elements.forEach(element => INSTALL.createElement(null, element))

        updateElements()
      }, UPDATE_DELAY)
    }
  }
}())
