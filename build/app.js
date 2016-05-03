"use strict";

(function () {
  var options = INSTALL_OPTIONS;
  var elements = [];

  var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i;

  function getVideoID(url) {
    var match = vimeoRegex.exec(url);

    return match ? match[3] : null;
  }

  function addOptionsURL() {
    for (var i = 0; i < options.embeds.length; i++) {
      if (!options.embeds[i].url || !options.embeds[i].location || !options.embeds[i].location.selector) return;

      var info = getVideoID(options.embeds[i].url);

      var embed = "https://player.vimeo.com/video/" + info + "?";

      if (options.embeds[i].autoplay) {
        embed += "autoplay=1&title=0&byline=0&portrait=0";
      } else {
        embed += "title=0&byline=0&portrait=0";
      }

      var element = elements[i] = Eager.createElement(options.embeds[i].location);

      element.innerHTML = "<iframe src=\"" + embed + "\" width=\"640\" height=\"390\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addOptionsURL);
  } else {
    addOptionsURL();
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      elements.forEach(function (element) {
        return Eager.createElement(null, element);
      });
      options = nextOptions;

      addOptionsURL();
    }
  };
})();