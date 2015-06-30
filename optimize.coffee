guessDimentions = (el) ->
  computed = getComputedStyle el

  if el.height
    height = el.height
  else if el.style.height
    height = parseFloat el.style.height
  else if computed.height
    height = parseFloat computed.height

  if el.width
    width = el.width
  else if el.style.width
    width = el.style.width
  else if computed.width
    width = parseFloat computed.width

  return {height, width}

optimizeSrc = (el) ->
  if /firesize.com/.test(el.src)
    return

  size = guessDimentions(el)

  proto = document.location.protocol
  if proto is 'file:'
    proto = 'http:'

  "#{ proto }//firesize.com/#{ size.width or '' }x#{ size.height or '' }/g_none/#{ el.src }"

selector = 'img:not(.no-firesize)'
TIME_LIMIT = 3000

checkNode = (addedNode) ->
  switch addedNode.nodeType
    when 1
      if addedNode.matches(selector)
        optimizedSrc = optimizeSrc addedNode
        origSrc = addedNode.src

        if optimizedSrc isnt origSrc
          do (origSrc, addedNode) ->
            loaded = false

            done = ->
              addedNode.removeEventListener 'error', errorHandler
              addedNode.removeEventListener 'load', loadHandler

              clearTimeout timeout

            swap = ->
              addedNode.src = origSrc

            addedNode.addEventListener 'error', errorHandler = ->
              swap()
              done()

            addedNode.addEventListener 'load', loadHandler = ->
              loaded = true
              done()

            timeout = setTimeout ->
              if not loaded
                swap()
                done()

            , TIME_LIMIT

          addedNode.src = optimizedSrc

if window.MutationObserver?
  observer = new MutationObserver (mutations) ->
    for mutation in mutations
      for addedNode in mutation.addedNodes
        checkNode(addedNode)

  observer.observe document.documentElement,
    childList: true
    subtree: true
