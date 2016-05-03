(function (){
  const elements = []
  let options = INSTALL_OPTIONS

  const vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i

  function getVideoID(url){
    const match = vimeoRegex.exec(url)

    return match ? match[3] : null 
  }

  function addOptionsURL(){      
    const {embeds} = options

    embeds
      .reverse()
      .filter($ => $.url)
      .forEach(({url, location, autoplay}, i) => {
        const info = getVideoID(url)

        let embed = `https://player.vimeo.com/video/${info}?`

        if (autoplay){
          embed += "autoplay=1&title=0&byline=0&portrait=0"
        }
        else {
          embed += "title=0&byline=0&portrait=0"
        }

        const element = elements[i] = Eager.createElement(location, elements[i])

        element.innerHTML = `<iframe src="${embed}" width="640" height="390" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
      })
  }
  

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addOptionsURL)
  }
  else {
    addOptionsURL()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      elements.forEach(element => Eager.createElement(null, element))
      options = nextOptions

      addOptionsURL()
    }
  }
}())
