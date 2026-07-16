const STORAGE_KEY = 'autora_oculta_member_project'

const fields = ['title', 'pen', 'female', 'male', 'premise', 'hook', 'conflict', 'tags']

function $(id) {
  return document.getElementById(id)
}

function loadProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function fillForm(data) {
  $('p_title').value = data.title || ''
  $('p_pen').value = data.pen || ''
  $('p_female').value = data.female || ''
  $('p_male').value = data.male || ''
  $('p_premise').value = data.premise || ''
  $('p_hook').value = data.hook || ''
  $('p_conflict').value = data.conflict || ''
  $('p_tags').value = data.tags || ''
}

function readForm() {
  return {
    title: $('p_title').value.trim(),
    pen: $('p_pen').value.trim(),
    female: $('p_female').value.trim(),
    male: $('p_male').value.trim(),
    premise: $('p_premise').value.trim(),
    hook: $('p_hook').value.trim(),
    conflict: $('p_conflict').value.trim(),
    tags: $('p_tags').value.trim(),
  }
}

function saveProject() {
  const data = readForm()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    $('saveStatus').textContent = 'Guardado en este dispositivo.'
  } catch {
    $('saveStatus').textContent = 'No se pudo guardar (modo privado / almacenamiento lleno).'
  }
}

function applyPlaceholders(text) {
  const p = { ...loadProject(), ...readForm() }
  return text
    .replaceAll('{{TITULO}}', p.title || 'TU TÍTULO')
    .replaceAll('{{SEUDONIMO}}', p.pen || 'TU SEUDÓNIMO')
    .replaceAll('{{ELLA}}', p.female || 'la protagonista')
    .replaceAll('{{EL}}', p.male || 'el interés amoroso')
    .replaceAll('{{PREMISA}}', p.premise || 'tu premisa')
    .replaceAll('{{CONFLICTO}}', p.conflict || 'tu conflicto')
    .replaceAll('{{N}}', '3')
    .replaceAll('{{FUNCION_CAPITULO}}', 'primer roce peligroso + cliffhanger')
}

function showPanel(id) {
  document.querySelectorAll('.panel').forEach((el) => el.classList.remove('active'))
  document.querySelectorAll('.nav a').forEach((el) => el.classList.remove('active'))
  const panel = document.getElementById('panel-' + id)
  const link = document.querySelector(`.nav a[data-panel="${id}"]`)
  if (panel) panel.classList.add('active')
  if (link) link.classList.add('active')
  window.scrollTo({ top: 0, behavior: 'smooth' })
  history.replaceState(null, '', '#' + id)
}

function initNav() {
  document.querySelectorAll('.nav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      showPanel(a.dataset.panel)
    })
  })
  document.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => showPanel(btn.getAttribute('data-go')))
  })
  const hash = (location.hash || '#inicio').replace('#', '')
  showPanel(hash || 'inicio')
}

function initCopy() {
  document.querySelectorAll('.prompt[data-copy]').forEach((box) => {
    const body = box.querySelector('.prompt-body')
    const btn = box.querySelector('button.copy')
    if (!body || !btn) return
    btn.addEventListener('click', async () => {
      const text = applyPlaceholders(body.textContent || '')
      try {
        await navigator.clipboard.writeText(text)
        btn.textContent = 'Copiado'
        setTimeout(() => {
          btn.textContent = 'Copiar prompt'
        }, 1600)
      } catch {
        btn.textContent = 'Selecciona y copia manual'
      }
    })
  })
}

function initProject() {
  fillForm(loadProject())
  $('saveProject')?.addEventListener('click', saveProject)
  $('clearProject')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY)
    fillForm({})
    $('saveStatus').textContent = 'Datos locales borrados.'
  })
}

initNav()
initCopy()
initProject()
