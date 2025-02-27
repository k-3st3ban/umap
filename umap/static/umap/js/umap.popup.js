/* Shapes  */

L.U.Popup = L.Popup.extend({
  options: {
    parseTemplate: true,
  },

  initialize: function (feature) {
    this.feature = feature
    this.container = L.DomUtil.create('div', 'umap-popup')
    this.format()
    L.Popup.prototype.initialize.call(this, {}, feature)
    this.setContent(this.container)
  },

  format: function () {
    const mode = this.feature.getOption('popupTemplate') || 'Default',
      klass = L.U.PopupTemplate[mode] || L.U.PopupTemplate.Default
    this.content = new klass(this.feature, this.container)
    this.content.render()
    const els = this.container.querySelectorAll('img,iframe')
    for (let i = 0; i < els.length; i++) {
      this.onElementLoaded(els[i])
    }
    if (!els.length && this.container.textContent.replace('\n', '') === '') {
      this.container.innerHTML = ''
      L.DomUtil.add('h3', '', this.container, this.feature.getDisplayName())
    }
  },

  onElementLoaded: function (el) {
    L.DomEvent.on(
      el,
      'load',
      function () {
        this._updateLayout()
        this._updatePosition()
        this._adjustPan()
      },
      this
    )
  },
})

L.U.Popup.Large = L.U.Popup.extend({
  options: {
    maxWidth: 500,
    className: 'umap-popup-large',
  },
})

L.U.Popup.Panel = L.U.Popup.extend({
  options: {
    zoomAnimation: false,
  },

  allButton: function () {
    const button = L.DomUtil.create('li', '')
    L.DomUtil.create('i', 'umap-icon-16 umap-list', button)
    const label = L.DomUtil.create('span', '', button)
    label.textContent = label.title = L._('See all')
    L.DomEvent.on(button, 'click', this.feature.map.openBrowser, this.feature.map)
    return button
  },

  onAdd: function (map) {
    map.ui.openPanel({
      data: { html: this._content },
      actions: [this.allButton()],
    })

    // fire events as in base class Popup.js:onAdd
    map.fire('popupopen', { popup: this })
    if (this._source) {
      this._source.fire('popupopen', { popup: this }, true)
      if (!(this._source instanceof L.Path)) {
        this._source.on('preclick', L.DomEvent.stopPropagation)
      }
    }
  },

  onRemove: function (map) {
    map.ui.closePanel()

    // fire events as in base class Popup.js:onRemove
    map.fire('popupclose', { popup: this })
    if (this._source) {
      this._source.fire('popupclose', { popup: this }, true)
      if (!(this._source instanceof L.Path)) {
        this._source.off('preclick', L.DomEvent.stopPropagation)
      }
    }
  },

  update: function () {},
  _updateLayout: function () {},
  _updatePosition: function () {},
  _adjustPan: function () {},
})
L.U.Popup.SimplePanel = L.U.Popup.Panel // Retrocompat.

/* Content templates */

L.U.PopupTemplate = {}

L.U.PopupTemplate.Default = L.Class.extend({
  initialize: function (feature, container) {
    this.feature = feature
    this.container = container
  },

  renderTitle: function () {},

  renderBody: function () {
    const template = this.feature.getOption('popupContentTemplate')
    const target = this.feature.getOption('outlinkTarget')
    const container = L.DomUtil.create('div', 'umap-popup-container')
    let content = ''
    let properties
    let center
    properties = this.feature.extendedProperties()
    // Resolve properties inside description
    properties.description = L.Util.greedyTemplate(
      this.feature.properties.description || '',
      properties
    )
    content = L.Util.greedyTemplate(template, properties)
    content = L.Util.toHTML(content, { target: target })
    container.innerHTML = content
    return container
  },

  renderFooter: function () {
    if (this.feature.hasPopupFooter()) {
      const footer = L.DomUtil.create('ul', 'umap-popup-footer', this.container),
        previousLi = L.DomUtil.create('li', 'previous', footer),
        zoomLi = L.DomUtil.create('li', 'zoom', footer),
        nextLi = L.DomUtil.create('li', 'next', footer),
        next = this.feature.getNext(),
        prev = this.feature.getPrevious()
      // Fixme: remove me when this is merged and released
      // https://github.com/Leaflet/Leaflet/pull/9052
      L.DomEvent.disableClickPropagation(footer)
      if (next)
        nextLi.title = L._('Go to «{feature}»', {
          feature: next.properties.name || L._('next'),
        })
      if (prev)
        previousLi.title = L._('Go to «{feature}»', {
          feature: prev.properties.name || L._('previous'),
        })
      zoomLi.title = L._('Zoom to this feature')
      L.DomEvent.on(nextLi, 'click', () => {
        if (next) next.zoomTo({ callback: next.view })
      })
      L.DomEvent.on(previousLi, 'click', () => {
        if (prev) prev.zoomTo({ callback: prev.view })
      })
      L.DomEvent.on(
        zoomLi,
        'click',
        function () {
          this.zoomTo()
        },
        this.feature
      )
    }
  },

  render: function () {
    const title = this.renderTitle()
    if (title) this.container.appendChild(title)
    const body = this.renderBody()
    if (body) L.DomUtil.add('div', 'umap-popup-content', this.container, body)
    this.renderFooter()
  },
})

L.U.PopupTemplate.BaseWithTitle = L.U.PopupTemplate.Default.extend({
  renderTitle: function () {
    let title
    if (this.feature.getDisplayName()) {
      title = L.DomUtil.create('h3', 'popup-title')
      title.textContent = this.feature.getDisplayName()
    }
    return title
  },
})

L.U.PopupTemplate.Table = L.U.PopupTemplate.BaseWithTitle.extend({
  formatRow: function (key, value) {
    if (value.indexOf('http') === 0) {
      value = `<a href="${value}" target="_blank">${value}</a>`
    }
    return value
  },

  addRow: function (container, key, value) {
    const tr = L.DomUtil.create('tr', '', container)
    L.DomUtil.add('th', '', tr, key)
    L.DomUtil.add('td', '', tr, this.formatRow(key, value))
  },

  renderBody: function () {
    const table = L.DomUtil.create('table')

    for (const key in this.feature.properties) {
      if (typeof this.feature.properties[key] === 'object' || key === 'name') continue
      // TODO, manage links (url, mailto, wikipedia...)
      this.addRow(table, key, L.Util.escapeHTML(this.feature.properties[key]).trim())
    }
    return table
  },
})

L.U.PopupTemplate.GeoRSSImage = L.U.PopupTemplate.BaseWithTitle.extend({
  options: {
    minWidth: 300,
    maxWidth: 500,
    className: 'umap-popup-large umap-georss-image',
  },

  renderBody: function () {
    const container = L.DomUtil.create('a')
    container.href = this.feature.properties.link
    container.target = '_blank'
    if (this.feature.properties.img) {
      const img = L.DomUtil.create('img', '', container)
      img.src = this.feature.properties.img
      // Sadly, we are unable to override this from JS the clean way
      // See https://github.com/Leaflet/Leaflet/commit/61d746818b99d362108545c151a27f09d60960ee#commitcomment-6061847
      img.style.maxWidth = `${this.options.maxWidth}px`
      img.style.maxHeight = `${this.options.maxWidth}px`
      this.onElementLoaded(img)
    }
    return container
  },
})

L.U.PopupTemplate.GeoRSSLink = L.U.PopupTemplate.Default.extend({
  options: {
    className: 'umap-georss-link',
  },

  renderBody: function () {
    const title = this.renderTitle(this),
      a = L.DomUtil.add('a')
    a.href = this.feature.properties.link
    a.target = '_blank'
    a.appendChild(title)
    return a
  },
})
