let sizeDrawer = null
let timer = null
let observer = null
const defaultFontSize = '16'
let defaultCommonColor = '#ff4aff'
let defaultErrorColor = '#f60a27'
let defaultWarningColor = '#e1cd3f'
let defaultTextColor = '#ffffff'
let defaultColor = defaultCommonColor
let errorColor = defaultErrorColor
let warningColor = defaultWarningColor
let textColor = defaultTextColor
let fontSize = defaultFontSize
let isTipsEnable = false

const yCoefficient = {
  '14': 0,
  '15': -1,
  '16': -1,
  '17': -1.5,
  '18': -2,

}

const onElementChange = (ignoreFormatted = false) => {
  const svgEl = sizeDrawer.children && sizeDrawer.children.length && sizeDrawer.children.item(0)

  if (!svgEl) {
    observer.disconnect()
    sizeDrawer = null
    setObserver()

    return
  }

  const resultFontSize = `${fontSize}px`
  const sizeDif = +fontSize - +defaultFontSize

  const textElements = []

  for (let i = 0; i < svgEl.children.length; i++) {
    const prevEl = svgEl.children[i - 1]
    const el = svgEl.children.item(i)
    const elTag = el.tagName
    const isTextElement = el.tagName === 'text'


    if (isTextElement && el.textContent) {
      el.style.setProperty("font-size", resultFontSize)
      el.style.setProperty("fill", textColor)

      const x = el.x.baseVal[0].value
      const y = el.y.baseVal[0].value

      textElements.push({ x, y, value: el.textContent, index: i })

      if (el.textContent.includes('.')) {
        if (isTipsEnable) {
          prevEl.setAttribute('fill', errorColor)
        } else {
          prevEl.setAttribute('fill', defaultColor)
        }
      } else {
        prevEl.setAttribute('fill', defaultColor)
      }
    }

    if (el.ry && el.rx && el.ry.baseVal.value === 8 && el.rx.baseVal.value === 8 && (!el.formatted || ignoreFormatted)) {
      const width = el.formatted ? el.defaultWidth : el.width.baseVal.value
      const height = el.formatted ? el.defaultHeight : el.height.baseVal.value
      const x = el.formatted ? el.defaultX : el.x.baseVal.value
      const y = el.formatted ? el.defaultY : el.y.baseVal.value
      const sizeElementDif = 1 + ((6 + sizeDif) / 10)

      const formattedHeight = (height * sizeElementDif).toString()
      const formattedWidth = (width * sizeElementDif - 5).toString()
      const withDif =  Math.floor(+formattedWidth - width)
      const heightDif =  Math.floor(+formattedHeight - height + 2)

      const formattedX = (x - (withDif / 4)).toString()
      const formattedY = (y - (heightDif / 2) + yCoefficient[fontSize]).toString()

      el.setAttribute('width', formattedWidth)
      el.setAttribute('height', formattedHeight)

      el.setAttribute('x', formattedX)
      el.setAttribute('y', formattedY)

      if (!el.formatted) {
        el.formatted = 'true'
        el.defaultWidth = width.toString()
        el.defaultHeight = height.toString()
        el.defaultX = x.toString()
        el.defaultY = y.toString()
      }
    }

    if ((elTag === 'rect' || elTag === 'path') && (!el.ry || el.ry.baseVal.value !== 8)) {
      el.setAttribute('stroke', defaultColor)
    }

    if (i === svgEl.children.length - 1 && textElements.length === 4) {
      const xCoords = textElements.map(coords => coords.x)
      const yCoords = textElements.map(coords => coords.y)

      const left = textElements.find(el => el.x === Math.min(...xCoords))
      const right = textElements.find(el => el.x === Math.max(...xCoords))
      const top = textElements.find(el => el.y === Math.max(...yCoords))
      const bottom = textElements.find(el => el.y === Math.min(...yCoords))

      if (Math.abs(top.value - bottom.value) <= 3 && Math.abs(top.value - bottom.value) > 0 && top.value < 30 && bottom.value < 30 && top.value !== bottom.value) {
        const topBudge = svgEl.children[top.index - 1]
        const bottomBudge = svgEl.children[bottom.index - 1]

        if (isTipsEnable) {
          if (topBudge.getAttribute('fill') !== errorColor) topBudge.setAttribute('fill', warningColor)

          if (bottomBudge.getAttribute('fill') !== errorColor) bottomBudge.setAttribute('fill', warningColor)
        } else {
          topBudge.setAttribute('fill', defaultColor)
          bottomBudge.setAttribute('fill', defaultColor)
        }

      }

      if (Math.abs(left.value - right.value) <= 3 && Math.abs(left.value - right.value) > 0 && left.value < 30 && right.value < 30 && top.value !== right.value) {
        const leftBudge = svgEl.children[left.index - 1]
        const rightBudge = svgEl.children[right.index - 1]

        if (isTipsEnable) {
          if (leftBudge.getAttribute('fill') !== errorColor) leftBudge.setAttribute('fill', warningColor)
          if (rightBudge.getAttribute('fill') !== errorColor) rightBudge.setAttribute('fill', warningColor)
        } else {
          leftBudge.setAttribute('fill', defaultColor)
          rightBudge.setAttribute('fill', defaultColor)
        }
      }
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

const setStorageListeners = () => {
  chrome.storage.local.onChanged.addListener(
    e => {
      if (e.fontSize) fontSize = e.fontSize.newValue || defaultFontSize

      if (e.isTipsEnable) isTipsEnable = e.isTipsEnable.newValue === "true"

      if (e.commonColor) defaultColor = e.commonColor.newValue || defaultCommonColor

      if (e.warningColor) warningColor = e.warningColor.newValue || defaultWarningColor

      if (e.errorColor) errorColor = e.errorColor.newValue || defaultErrorColor

      if (e.textColor) textColor = e.textColor.newValue || defaultTextColor

      onElementChange(true)
    }
  )
}

const getStorageValue = () => {
  chrome.storage.local.get(["fontSize", "isTipsEnable", "commonColor", "warningColor", "errorColor", "textColor"], (storage) => {
    fontSize = storage.fontSize || defaultFontSize
    isTipsEnable = storage.isTipsEnable === "true"

    if (storage.commonColor) defaultColor = storage.commonColor || defaultCommonColor
    if (storage.warningColor) warningColor = storage.warningColor || defaultWarningColor
    if (storage.errorColor) errorColor = storage.errorColor || defaultErrorColor
    if (storage.errorColor) textColor = storage.textColor || defaultTextColor
  });
}

const initScript = () => {
  setObserver()
  setStorageListeners()
  getStorageValue()
}

const init = () => {
  if (document.readyState !== "loading") {
    setTimeout(() => initScript(), 0)
  } else {
    document.addEventListener("DOMContentLoaded", () => initScript())
  }
}

init()
