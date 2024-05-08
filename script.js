let sizeDrawer = null
let timer = null
let observer = null

const onElementChange = () => {
  const svgEl = sizeDrawer.children && sizeDrawer.children.length && sizeDrawer.children.item(0)

  if (!svgEl) {
    observer.disconnect()
    sizeDrawer = null
    setObserver()

    return
  }

  for (let i = 0; i < svgEl.children.length; i++) {
    const prevEl = svgEl.children[i - 1]
    const el = svgEl.children.item(i)
    const attentionColor = '#f60a27'

    if (el.textContent && el.textContent.includes('.')) {
      prevEl.setAttribute('fill', attentionColor)
    }
    if (el.ry && el.rx && el.ry.baseVal.value === 8 && el.rx.baseVal.value === 8 && !el.formatted) {
      const width = el.width.baseVal.value
      const height = el.height.baseVal.value
      const x = el.x.baseVal.value
      const y = el.y.baseVal.value

      const formattedHeight = (height + 6).toString()
      const formattedWidth = (width + 6).toString()

      const formattedX = (x - 3).toString()
      const formattedY = (y - 3).toString()
      el.setAttribute('width', formattedWidth)
      el.setAttribute('height', formattedHeight)

      el.setAttribute('x', formattedX)
      el.setAttribute('y', formattedY)
      el.formatted = 'true'
    }
  }
}

const setObserver = () => {
  timer && clearTimeout(timer)

  if (sizeDrawer) return

  sizeDrawer = document.querySelector('div[data-auto="svgContainer"]')

  if (!sizeDrawer) {
    timer = setTimeout(() => setObserver(), 2000);

    return
  }

  const svgEl = sizeDrawer.children && sizeDrawer.children.length && sizeDrawer.children[0]

  // Create an observer instance linked to the callback function
  const config = { childList: true, subtree: true };
  observer = new MutationObserver(onElementChange);

  // Start observing the target node for configured mutations
  observer.observe(svgEl, config);
}

const init = () => {
  if (document.readyState !== "loading") {
    setTimeout(() => setObserver(), 0); // Or setTimeout(onReady, 0); if you want it consistently async
  } else {
    document.addEventListener("DOMContentLoaded", setObserver);
  }
}

init();