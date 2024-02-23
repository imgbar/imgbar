const searchResultsElement = document.querySelector('.search-results')
searchResultsElement.addEventListener('click', async (e) => {
  const searchResultElement = e.target.closest('div')
  const templateId = searchResultElement.dataset.id
  selectedTemplate = await getTemplate(templateId)
  await setupCanvas()
})

const searchInputElement = document.getElementById('search')

document.addEventListener('htmx:afterRequest', (e) => {
  if (e.detail.target === searchResultsElement) {
    searchResultsElement.classList.add('search-results-open')
  }
})

document.addEventListener('click', (e) => {
  if (e.target !== searchResultsElement) {
    searchResultsElement.classList.remove('search-results-open')
  }
})
