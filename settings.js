let fontSize = null
let isTipsEnable = null
let resetButton = null
let select = null
let toggle = null
let commonColorSelect = null
let warningColorSelect = null
let errorColorSelect = null
let textColorSelect = null
const defaultFontSize = '16'
const defaultCommonColor = '#ff4aff'
const defaultErrorColor = '#f60a27'
const defaultWarningColor = '#e1cd3f'
const defaultTextColor = '#ffffff'

const showResetButton = () => {
  resetButton.classList.remove("hidden");
}

const onSizeChange = e => {
  const { value } = e.target;

  chrome.storage.local.set({ "fontSize": value });

  showResetButton()
}

const onToggleChange = e => {
  const { checked } = e.target;

  chrome.storage.local.set({ "isTipsEnable": checked.toString() });

  showResetButton()
}

const onColorChange = e => {
  const { value, name } = e.target;

  chrome.storage.local.set({ [name]: value });

  showResetButton()
}

const resetLocalValues = () => {
  if (select) select.value = defaultFontSize

  if (toggle) toggle.checked = false

  if (commonColorSelect) commonColorSelect.value = defaultCommonColor

  if (warningColorSelect) warningColorSelect.value = defaultWarningColor

  if (errorColorSelect) errorColorSelect.value = defaultErrorColor

  if (textColorSelect) textColorSelect.value = defaultTextColor
}

const resetSettings = () => {
  chrome.storage.local.set({
    "fontSize": '',
    "isTipsEnable": '',
    "commonColor": '',
    "warningColor": '',
    "errorColor": '',
    "textColor": ''
  })

  resetLocalValues()
  resetButton.classList.add("hidden");
}

const addSelectListeners = () => {
  select = document.getElementById('size-select');
  toggle = document.getElementById('toggle-input');
  commonColorSelect = document.getElementById('common-color');
  warningColorSelect = document.getElementById('warning-color');
  errorColorSelect = document.getElementById('error-color');
  textColorSelect = document.getElementById('text-color');
  resetButton = document.getElementById('reset-button');

  chrome.storage.local.get(["fontSize", "isTipsEnable", "commonColor", "warningColor", "errorColor", "textColor"], (storage) => {
    if ( !(typeof storage.fontSize === 'string' && storage.fontSize) &&
      !(typeof storage.commonColor === 'string' && storage.commonColor) &&
      !(typeof storage.warningColor === 'string' && storage.warningColor) &&
      !(typeof storage.errorColor === 'string' && storage.errorColor) &&
      !(typeof storage.textColor === 'string' && storage.textColor) &&
      resetButton
    ) {
      resetButton.classList.add("hidden");
    }

    fontSize = typeof storage.fontSize === 'string' && storage.fontSize || defaultFontSize
    const isTipsEnable = typeof storage.isTipsEnable === 'string' && storage.isTipsEnable === 'true'
    const commonColor = typeof storage.commonColor === 'string' && storage.commonColor || defaultCommonColor
    const warningColor = typeof storage.warningColor === 'string' && storage.warningColor || defaultWarningColor
    const errorColor = typeof storage.errorColor === 'string' && storage.errorColor || defaultErrorColor
    const textColor = typeof storage.textColor === 'string' && storage.textColor || defaultTextColor

    if (select) select.value = fontSize

    if (toggle) toggle.checked = isTipsEnable

    if (commonColorSelect) commonColorSelect.value = commonColor

    if (warningColorSelect) warningColorSelect.value = warningColor

    if (errorColorSelect) errorColorSelect.value = errorColor

    if (textColorSelect) textColorSelect.value = textColor
  });

  if (select) select.addEventListener('change', onSizeChange)

  if (toggle) toggle.addEventListener('change', onToggleChange)

  if (commonColorSelect) commonColorSelect.addEventListener('change', onColorChange)

  if (warningColorSelect) warningColorSelect.addEventListener('change', onColorChange)

  if (errorColorSelect) errorColorSelect.addEventListener('change', onColorChange)

  if (textColorSelect) textColorSelect.addEventListener('change', onColorChange)

  if (resetButton) resetButton.addEventListener('click', resetSettings)
}


document.addEventListener("DOMContentLoaded", () => {
  addSelectListeners()
});