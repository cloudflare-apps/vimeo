"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function () {
  var elements = [];
  var options = INSTALL_OPTIONS;
  var CONTAINER_CLASS = "eager-vimeo";
  var FULLSCREEN_ATTRIBUTES = ["webkitallowfullscreen", "mozallowfullscreen", "allowfullscreen"];

  var URL_PATTERN = /vimeo\.com\/?(.*)\/(.*)/i;

  function getVideoParams() {
    var url = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

    var match = URL_PATTERN.exec(url);

    if (!match) return null;

    var params = {
      id: match[2],
      type: match[1] || "video"
    };

    if (params.type === "album") params.type = "hubnut/album";

    return params;
  }

  function updateElements() {
    var _options = options;
    var embeds = _options.embeds;


    embeds.reverse().map(function ($) {
      return _extends({}, $, { params: getVideoParams($.url) });
    }).filter(function ($) {
      return $.params;
    }).forEach(function (_ref, i) {
      var params = _ref.params;
      var location = _ref.location;
      var autoplay = _ref.autoplay;

      var src = "https://player.vimeo.com/" + params.type + "/" + params.id + "?title=0&byline=0&portrait=0";

      if (autoplay) {
        src += "&autoplay=1";
      }

      var element = elements[i] = Eager.createElement(location, elements[i]);

      element.className = CONTAINER_CLASS;
      var iframe = document.createElement("iframe");

      iframe.addEventListener("load", function () {
        return element.setAttribute("data-state", "loaded");
      });

      iframe.src = src;
      iframe.frameBorder = 0;
      FULLSCREEN_ATTRIBUTES.forEach(function (attribute) {
        return iframe.setAttribute(attribute, "");
      });
      element.appendChild(iframe);
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