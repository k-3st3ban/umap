L.U.Icon = L.DivIcon.extend({
  initialize: function (map, options) {
    this.map = map
    const default_options = {
      iconSize: null, // Made in css
      iconUrl: this.map.getDefaultOption('iconUrl'),
      feature: null,
    }
    options = L.Util.extend({}, default_options, options)
    L.Icon.prototype.initialize.call(this, options)
    this.feature = this.options.feature
    if (this.feature && this.feature.isReadOnly()) {
      this.options.className += ' readonly'
    }
  },

  _getIconUrl: function (name) {
    let url
    if (this.feature && this.feature._getIconUrl(name))
      url = this.feature._getIconUrl(name)
    else url = this.options[`${name}Url`]
    return this.formatUrl(url, this.feature)
  },

  _getColor: function () {
    let color
    if (this.feature) color = this.feature.getDynamicOption('color')
    else if (this.options.color) color = this.options.color
    else color = this.map.getDefaultOption('color')
    return color
  },

  _getOpacity: function () {
    if (this.feature) return this.feature.getOption('iconOpacity')
    return this.map.getDefaultOption('iconOpacity')
  },

  formatUrl: function (url, feature) {
    return L.Util.greedyTemplate(url || '', feature ? feature.extendedProperties() : {})
  },

  onAdd: function () {},
})

L.U.Icon.Default = L.U.Icon.extend({
  default_options: {
    iconAnchor: new L.Point(16, 40),
    popupAnchor: new L.Point(0, -40),
    tooltipAnchor: new L.Point(16, -24),
    className: 'umap-div-icon',
  },

  initialize: function (map, options) {
    options = L.Util.extend({}, this.default_options, options)
    L.U.Icon.prototype.initialize.call(this, map, options)
  },

  _setIconStyles: function (img, name) {
    L.U.Icon.prototype._setIconStyles.call(this, img, name)
    const color = this._getColor(),
      opacity = this._getOpacity()
    this.elements.container.style.backgroundColor = color
    this.elements.arrow.style.borderTopColor = color
    this.elements.container.style.opacity = opacity
    this.elements.arrow.style.opacity = opacity
  },

  onAdd: function () {
    const src = this._getIconUrl('icon')
    // Decide whether to switch svg to white or not, but do it
    // only for internal SVG, as invert could do weird things
    if (src.startsWith('/') && src.endsWith('.svg')) {
      const bgcolor = this._getColor()
      // Must be called after icon container is added to the DOM
      if (L.DomUtil.contrastedColor(this.elements.container, bgcolor)) {
        this.elements.img.style.filter = 'invert(1)'
      }
    }
  },

  createIcon: function () {
    this.elements = {}
    this.elements.main = L.DomUtil.create('div')
    this.elements.container = L.DomUtil.create(
      'div',
      'icon_container',
      this.elements.main
    )
    this.elements.arrow = L.DomUtil.create('div', 'icon_arrow', this.elements.main)
    const src = this._getIconUrl('icon')
    if (src) {
      // An url.
      if (
        src.startsWith('http') ||
        src.startsWith('/') ||
        src.startsWith('data:image')
      ) {
        this.elements.img = L.DomUtil.create('img', null, this.elements.container)
        this.elements.img.src = src
      } else {
        this.elements.span = L.DomUtil.create('span', null, this.elements.container)
        this.elements.span.textContent = src
      }
    }
    this._setIconStyles(this.elements.main, 'icon')
    return this.elements.main
  },
})

L.U.Icon.Circle = L.U.Icon.extend({
  initialize: function (map, options) {
    const default_options = {
      popupAnchor: new L.Point(0, -6),
      tooltipAnchor: new L.Point(6, 0),
      className: 'umap-circle-icon',
    }
    options = L.Util.extend({}, default_options, options)
    L.U.Icon.prototype.initialize.call(this, map, options)
  },

  _setIconStyles: function (img, name) {
    L.U.Icon.prototype._setIconStyles.call(this, img, name)
    this.elements.main.style.backgroundColor = this._getColor()
    this.elements.main.style.opacity = this._getOpacity()
  },

  createIcon: function () {
    this.elements = {}
    this.elements.main = L.DomUtil.create('div')
    this.elements.main.innerHTML = '&nbsp;'
    this._setIconStyles(this.elements.main, 'icon')
    return this.elements.main
  },
})

L.U.Icon.Drop = L.U.Icon.Default.extend({
  default_options: {
    iconAnchor: new L.Point(16, 42),
    popupAnchor: new L.Point(0, -42),
    tooltipAnchor: new L.Point(16, -24),
    className: 'umap-drop-icon',
  },
})

L.U.Icon.Ball = L.U.Icon.Default.extend({
  default_options: {
    iconAnchor: new L.Point(8, 30),
    popupAnchor: new L.Point(0, -28),
    tooltipAnchor: new L.Point(8, -23),
    className: 'umap-ball-icon',
  },

  createIcon: function () {
    this.elements = {}
    this.elements.main = L.DomUtil.create('div')
    this.elements.container = L.DomUtil.create(
      'div',
      'icon_container',
      this.elements.main
    )
    this.elements.arrow = L.DomUtil.create('div', 'icon_arrow', this.elements.main)
    this._setIconStyles(this.elements.main, 'icon')
    return this.elements.main
  },

  _setIconStyles: function (img, name) {
    L.U.Icon.prototype._setIconStyles.call(this, img, name)
    const color = this._getColor('color')
    let background
    if (L.Browser.ielt9) {
      background = color
    } else if (L.Browser.webkit) {
      background = `-webkit-gradient( radial, 6 38%, 0, 6 38%, 8, from(white), to(${color}) )`
    } else {
      background = `radial-gradient(circle at 6px 38% , white -4px, ${color} 8px) repeat scroll 0 0 transparent`
    }
    this.elements.container.style.background = background
    this.elements.container.style.opacity = this._getOpacity()
  },
})

L.U.Icon.Cluster = L.DivIcon.extend({
  options: {
    iconSize: [40, 40],
  },

  initialize: function (datalayer, cluster) {
    this.datalayer = datalayer
    this.cluster = cluster
  },

  createIcon: function () {
    const container = L.DomUtil.create('div', 'leaflet-marker-icon marker-cluster'),
      div = L.DomUtil.create('div', '', container),
      span = L.DomUtil.create('span', '', div),
      backgroundColor = this.datalayer.getColor()
    span.textContent = this.cluster.getChildCount()
    div.style.backgroundColor = backgroundColor
    return container
  },

  computeTextColor: function (el) {
    let color
    const backgroundColor = this.datalayer.getColor()
    if (this.datalayer.options.cluster && this.datalayer.options.cluster.textColor) {
      color = this.datalayer.options.cluster.textColor
    }
    return color || L.DomUtil.TextColorFromBackgroundColor(el, backgroundColor)
  },
})
