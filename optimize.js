(function() {
  var checkNode, guessDimentions, observer, optimizeSrc, selector;

  guessDimentions = function(el) {
    var computed, height, width;
    computed = getComputedStyle(el);
    if (el.height) {
      height = el.height;
    } else if (el.style.height) {
      height = parseFloat(el.style.height);
    } else if (computed.height) {
      height = parseFloat(computed.height);
    }
    if (el.width) {
      width = el.width;
    } else if (el.style.width) {
      width = el.style.width;
    } else if (computed.width) {
      width = parseFloat(computed.width);
    }
    return {
      height: height,
      width: width
    };
  };

  optimizeSrc = function(el) {
    var proto, size;
    if (/firesize.com/.test(el.src)) {
      return;
    }
    size = guessDimentions(el);
    proto = document.location.protocol;
    if (proto === 'file:') {
      proto = 'http:';
    }
    return "" + proto + "//firesize.com/" + (size.width || '') + "x" + (size.height || '') + "/g_none/" + el.src;
  };

  selector = 'img:not(.no-firesize)';

  checkNode = function(addedNode) {
    switch (addedNode.nodeType) {
      case 1:
        if (addedNode.matches(selector)) {
          return addedNode.src = optimizeSrc(addedNode);
        }
    }
  };

  if (window.MutationObserver != null) {
    observer = new MutationObserver(function(mutations) {
      var addedNode, mutation, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        _results.push((function() {
          var _j, _len1, _ref, _results1;
          _ref = mutation.addedNodes;
          _results1 = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            addedNode = _ref[_j];
            _results1.push(checkNode(addedNode));
          }
          return _results1;
        })());
      }
      return _results;
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

}).call(this);
