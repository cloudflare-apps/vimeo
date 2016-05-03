"use strict";

(function () {
  var elements = [];
  var options = INSTALL_OPTIONS;

  var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i;

  function getVideoID(url) {
    var match = vimeoRegex.exec(url);

    return match ? match[3] : null;
  }

  function addOptionsURL() {
    var _options = options;
    var embeds = _options.embeds;


    embeds.reverse().filter(function ($) {
      return $.url;
    }).forEach(function (_ref, i) {
      var url = _ref.url;
      var location = _ref.location;
      var autoplay = _ref.autoplay;

      var info = getVideoID(url);

      var embed = "https://player.vimeo.com/video/" + info + "?";

      if (autoplay) {
        embed += "autoplay=1&title=0&byline=0&portrait=0";
      } else {
        embed += "title=0&byline=0&portrait=0";
      }

      var element = elements[i] = Eager.createElement(location, elements[i]);

      element.innerHTML = "<iframe src=\"" + embed + "\" width=\"640\" height=\"390\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
    });
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