(function (){
  let element
  let options = INSTALL_OPTIONS

  const vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i

  function parseURL(url){
    const match = vimeoRegex.exec(url)
    let id

    if (match){
      id = match[3]
    }
    else {
      if (!match) return null
    }

    return {id: id}
  }

  function add(){
    for (let i = 0; i < options.embeds.length; i++){
      if (!options.embeds[i].url || !options.embeds[i].location || !options.embeds[i].location.selector) return

      const info = parseURL(options.embeds[i].url)

      if (!info)
        continue

      let embed = `https://player.vimeo.com/video/${info.id}?`

      if (options.embeds[i].autoplay){
        embed += "autoplay=1&title=0&byline=0&portrait=0"
      }
      else {
        embed += "title=0&byline=0&portrait=0"
      }

      element = Eager.createElement(options.embeds[i].location)
      element.innerHTML = `<iframe src="${embed}" width="640" height="390" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", add)
  }
  else {
    add()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      options = nextOptions

      add()
    }
  }
}())
