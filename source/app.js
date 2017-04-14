(function () {
  'use strict'

  const TIME_LIMIT = 3000
  const SELECTOR = 'img:not(.no-firesize)'

  const {getComputedStyle, MutationObserver} = window

  function getDimensions (el) {
    let height
    let width

    const computed = getComputedStyle(el)

    if (el.height) {
      height = el.height
    } else if (el.style.height) {
      height = parseFloat(el.style.height)
    } else if (computed.height) {
      height = parseFloat(computed.height)
    }

    if (el.width) {
      width = el.width
    } else if (el.style.width) {
      width = el.style.width
    } else if (computed.width) {
      width = parseFloat(computed.width)
    }

    return {height, width}
  }

  function optimizeSrc (el) {
    if (/firesize.com/.test(el.src)) return

    const size = getDimensions(el)
    let {protocol} = document.location

    if (protocol === 'file:') {
      protocol = 'http:'
    }

    return `${protocol}//firesize.com/${size.width || ''}x${size.height || ''}/g_none/${el.src}`
  }

  function checkNode (addedNode) {
    if (addedNode.nodeType !== 1 || !addedNode.matches(SELECTOR)) return

    let optimizedSrc = optimizeSrc(addedNode)
    let origSrc = addedNode.src

    if (optimizedSrc === origSrc) return

    let loaded = false
    let timeout

    function errorHandler () {
      swap()
      done()
    }

    function loadHandler () {
      loaded = true
      done()
    }

    function done () {
      addedNode.removeEventListener('error', errorHandler)
      addedNode.removeEventListener('load', loadHandler)
      clearTimeout(timeout)
    }

    function swap () {
      addedNode.src = origSrc
    }

    addedNode.addEventListener('error', errorHandler)
    addedNode.addEventListener('load', loadHandler)

    timeout = setTimeout(() => {
      if (loaded) return

      swap()
      done()
    }, TIME_LIMIT)

    addedNode.src = optimizedSrc
  }

  if (MutationObserver) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        Array.prototype.slice.call(mutation.addedNodes).forEach(checkNode)
      })
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }
}())
