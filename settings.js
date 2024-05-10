let fontSize = null
let isTipsEnable = null
const defaultFontSize = '16'
const defaultCommonColor = '#ff4aff'
const defaultErrorColor = '#f60a27'
const defaultWarningColor = '#e1cd3f'

const onSizeChange = e => {
  const { value } = e.target;

  chrome.storage.local.set({ "fontSize": value });
}

const onToggleChange = e => {
  const { checked } = e.target;

  chrome.storage.local.set({ "isTipsEnable": checked.toString() });
}

const onColorChange = e => {
  const { value, name } = e.target;

  chrome.storage.local.set({ [name]: value });
}

const addSelectListeners = () => {
  const select = document.getElementById('size-select');
  const toggle = document.getElementById('toggle-input');
  const commonColorSelect = document.getElementById('common-color');
  const warningColorSelect = document.getElementById('warning-color');
  const errorColorSelect = document.getElementById('error-color');

  chrome.storage.local.get(["fontSize", "isTipsEnable"], (storage) => {
    fontSize = typeof storage.fontSize === 'string' && storage.fontSize || defaultFontSize
    const isTipsEnable = typeof storage.isTipsEnable === 'string' && storage.isTipsEnable === 'true'
    const commonColor = typeof storage.commonColor === 'string' && storage.commonColor || defaultCommonColor
    const warningColor = typeof storage.warningColor === 'string' && storage.warningColor || defaultWarningColor
    const errorColor = typeof storage.errorColor === 'string' && storage.errorColor || defaultErrorColor

    if (select) select.value = fontSize

    if (toggle) toggle.checked = isTipsEnable

    if (commonColorSelect) commonColorSelect.value = commonColor

    if (warningColorSelect) warningColorSelect.value = warningColor

    if (errorColorSelect) errorColorSelect.value = errorColor
  });

  if (select) select.addEventListener('change', onSizeChange)

  if (toggle) toggle.addEventListener('change', onToggleChange)

  if (commonColorSelect) commonColorSelect.addEventListener('change', onColorChange)

  if (warningColorSelect) warningColorSelect.addEventListener('change', onColorChange)

  if (errorColorSelect) errorColorSelect.addEventListener('change', onColorChange)
}


document.addEventListener("DOMContentLoaded", () => {
  addSelectListeners()
});