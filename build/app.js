"use strict";

(function () {
  var elements = [];
  var options = INSTALL_OPTIONS;
  var CONTAINER_CLASS = "eager-vimeo";

  var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i;

  function getVideoID(url) {
    var match = vimeoRegex.exec(url);

    return match ? match[3] : null;
  }

  function updateElements() {
    var _options = options;
    var embeds = _options.embeds;


    embeds.reverse().filter(function ($) {
      return $.url;
    }).forEach(function (_ref, i) {
      var url = _ref.url;
      var location = _ref.location;
      var autoplay = _ref.autoplay;

      var info = getVideoID(url);

      var src = "https://player.vimeo.com/video/" + info + "?title=0&byline=0&portrait=0";

      if (autoplay) {
        src += "&autoplay=1";
      }

      var element = elements[i] = Eager.createElement(location, elements[i]);

      element.className = CONTAINER_CLASS;
      var eagerIframe = document.createElement("iframe");

      eagerIframe.src = "" + src;
      eagerIframe.frameborder = "0";
      element.appendChild(eagerIframe);

      eagerIframe.addEventListener("load", function handle() {
        element.setAttribute("data-state", "loaded");
      });

      // element.innerHTML = `<iframe src="${src}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElements);
  } else {
    updateElements();
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      elements.forEach(function (element) {
        return Eager.createElement(null, element);
      });
      options = nextOptions;

      updateElements();
    }
  };
})();