L.U.BaseAction = L.ToolbarAction.extend({
  initialize: function (map) {
    this.map = map
    this.options.toolbarIcon = {
      className: this.options.className,
      tooltip: this.options.tooltip,
    }
    L.ToolbarAction.prototype.initialize.call(this)
    if (this.options.helpMenu && !this.map.helpMenuActions[this.options.className])
      this.map.helpMenuActions[this.options.className] = this
  },
})

L.U.ImportAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'upload-data dark',
    tooltip: `${L._('Import data')} (Ctrl+I)`,
  },

  addHooks: function () {
    this.map.importPanel()
  },
})

L.U.EditPropertiesAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'update-map-settings dark',
    tooltip: L._('Edit map settings'),
  },

  addHooks: function () {
    this.map.edit()
  },
})

L.U.ChangeTileLayerAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'dark update-map-tilelayers',
    tooltip: L._('Change tilelayers'),
  },

  addHooks: function () {
    this.map.updateTileLayers()
  },
})

L.U.ManageDatalayersAction = L.U.BaseAction.extend({
  options: {
    className: 'dark manage-datalayers',
    tooltip: L._('Manage layers'),
  },

  addHooks: function () {
    this.map.manageDatalayers()
  },
})

L.U.UpdateExtentAction = L.U.BaseAction.extend({
  options: {
    className: 'update-map-extent dark',
    tooltip: L._('Save this center and zoom'),
  },

  addHooks: function () {
    this.map.updateExtent()
  },
})

L.U.UpdatePermsAction = L.U.BaseAction.extend({
  options: {
    className: 'update-map-permissions dark',
    tooltip: L._('Update permissions and editors'),
  },

  addHooks: function () {
    this.map.permissions.edit()
  },
})

L.U.DrawMarkerAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'umap-draw-marker dark',
    tooltip: `${L._('Draw a marker')} (Ctrl+M)`,
  },

  addHooks: function () {
    this.map.startMarker()
  },
})

L.U.DrawPolylineAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'umap-draw-polyline dark',
    tooltip: `${L._('Draw a polyline')} (Ctrl+L)`,
  },

  addHooks: function () {
    this.map.startPolyline()
  },
})

L.U.DrawPolygonAction = L.U.BaseAction.extend({
  options: {
    helpMenu: true,
    className: 'umap-draw-polygon dark',
    tooltip: `${L._('Draw a polygon')} (Ctrl+P)`,
  },

  addHooks: function () {
    this.map.startPolygon()
  },
})

L.U.AddPolylineShapeAction = L.U.BaseAction.extend({
  options: {
    className: 'umap-draw-polyline-multi dark',
    tooltip: L._('Add a line to the current multi'),
  },

  addHooks: function () {
    this.map.editedFeature.editor.newShape()
  },
})

L.U.AddPolygonShapeAction = L.U.AddPolylineShapeAction.extend({
  options: {
    className: 'umap-draw-polygon-multi dark',
    tooltip: L._('Add a polygon to the current multi'),
  },
})

L.U.BaseFeatureAction = L.ToolbarAction.extend({
  initialize: function (map, feature, latlng) {
    this.map = map
    this.feature = feature
    this.latlng = latlng
    L.ToolbarAction.prototype.initialize.call(this)
    this.postInit()
  },

  postInit: function () {},

  hideToolbar: function () {
    this.map.removeLayer(this.toolbar)
  },

  addHooks: function () {
    this.onClick({ latlng: this.latlng })
    this.hideToolbar()
  },
})

L.U.CreateHoleAction = L.U.BaseFeatureAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-new-hole',
      tooltip: L._('Start a hole here'),
    },
  },

  onClick: function (e) {
    this.feature.startHole(e)
  },
})

L.U.ToggleEditAction = L.U.BaseFeatureAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-toggle-edit',
      tooltip: L._('Toggle edit mode (⇧+Click)'),
    },
  },

  onClick: function (e) {
    if (this.feature._toggleEditing) this.feature._toggleEditing(e) // Path
    else this.feature.edit(e) // Marker
  },
})

L.U.DeleteFeatureAction = L.U.BaseFeatureAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-delete-all',
      tooltip: L._('Delete this feature'),
    },
  },

  postInit: function () {
    if (!this.feature.isMulti())
      this.options.toolbarIcon.className = 'umap-delete-one-of-one'
  },

  onClick: function (e) {
    this.feature.confirmDelete(e)
  },
})

L.U.DeleteShapeAction = L.U.BaseFeatureAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-delete-one-of-multi',
      tooltip: L._('Delete this shape'),
    },
  },

  onClick: function (e) {
    this.feature.enableEdit().deleteShapeAt(e.latlng)
  },
})

L.U.ExtractShapeFromMultiAction = L.U.BaseFeatureAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-extract-shape-from-multi',
      tooltip: L._('Extract shape to separate feature'),
    },
  },

  onClick: function (e) {
    this.feature.isolateShape(e.latlng)
  },
})

L.U.BaseVertexAction = L.U.BaseFeatureAction.extend({
  initialize: function (map, feature, latlng, vertex) {
    this.vertex = vertex
    L.U.BaseFeatureAction.prototype.initialize.call(this, map, feature, latlng)
  },
})

L.U.DeleteVertexAction = L.U.BaseVertexAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-delete-vertex',
      tooltip: L._('Delete this vertex (Alt+Click)'),
    },
  },

  onClick: function () {
    this.vertex.delete()
  },
})

L.U.SplitLineAction = L.U.BaseVertexAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-split-line',
      tooltip: L._('Split line'),
    },
  },

  onClick: function () {
    this.vertex.split()
  },
})

L.U.ContinueLineAction = L.U.BaseVertexAction.extend({
  options: {
    toolbarIcon: {
      className: 'umap-continue-line',
      tooltip: L._('Continue line'),
    },
  },

  onClick: function () {
    this.vertex.continue()
  },
})

// Leaflet.Toolbar doesn't allow twice same toolbar class…
L.U.SettingsToolbar = L.Toolbar.Control.extend({
  addTo: function (map) {
    if (map.options.editMode !== 'advanced') return
    L.Toolbar.Control.prototype.addTo.call(this, map)
  },
})
L.U.DrawToolbar = L.Toolbar.Control.extend({
  initialize: function (options) {
    L.Toolbar.Control.prototype.initialize.call(this, options)
    this.map = this.options.map
    this.map.on('seteditedfeature', this.redraw, this)
  },

  appendToContainer: function (container) {
    this.options.actions = []
    if (this.map.options.enableMarkerDraw) {
      this.options.actions.push(L.U.DrawMarkerAction)
    }
    if (this.map.options.enablePolylineDraw) {
      this.options.actions.push(L.U.DrawPolylineAction)
      if (this.map.editedFeature && this.map.editedFeature instanceof L.U.Polyline) {
        this.options.actions.push(L.U.AddPolylineShapeAction)
      }
    }
    if (this.map.options.enablePolygonDraw) {
      this.options.actions.push(L.U.DrawPolygonAction)
      if (this.map.editedFeature && this.map.editedFeature instanceof L.U.Polygon) {
        this.options.actions.push(L.U.AddPolygonShapeAction)
      }
    }
    L.Toolbar.Control.prototype.appendToContainer.call(this, container)
  },

  redraw: function () {
    const container = this._control.getContainer()
    container.innerHTML = ''
    this.appendToContainer(container)
  },
})

L.U.DropControl = L.Class.extend({
  initialize: function (map) {
    this.map = map
    this.dropzone = map._container
  },

  enable: function () {
    L.DomEvent.on(this.dropzone, 'dragenter', this.dragenter, this)
    L.DomEvent.on(this.dropzone, 'dragover', this.dragover, this)
    L.DomEvent.on(this.dropzone, 'drop', this.drop, this)
    L.DomEvent.on(this.dropzone, 'dragleave', this.dragleave, this)
  },

  disable: function () {
    L.DomEvent.off(this.dropzone, 'dragenter', this.dragenter, this)
    L.DomEvent.off(this.dropzone, 'dragover', this.dragover, this)
    L.DomEvent.off(this.dropzone, 'drop', this.drop, this)
    L.DomEvent.off(this.dropzone, 'dragleave', this.dragleave, this)
  },

  dragenter: function (e) {
    L.DomEvent.stop(e)
    this.map.scrollWheelZoom.disable()
    this.dropzone.classList.add('umap-dragover')
  },

  dragover: function (e) {
    L.DomEvent.stop(e)
  },

  drop: function (e) {
    this.map.scrollWheelZoom.enable()
    this.dropzone.classList.remove('umap-dragover')
    L.DomEvent.stop(e)
    for (let i = 0, file; (file = e.dataTransfer.files[i]); i++) {
      this.map.processFileToImport(file)
    }
    this.map.onceDataLoaded(this.map.fitDataBounds)
  },

  dragleave: function () {
    this.map.scrollWheelZoom.enable()
    this.dropzone.classList.remove('umap-dragover')
  },
})

L.U.EditControl = L.Control.extend({
  options: {
    position: 'topright',
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-control-edit-enable')
    const enableEditing = L.DomUtil.createButton(
      '',
      container,
      L._('Edit'),
      map.enableEdit,
      map
    )
    L.DomEvent.on(
      enableEditing,
      'mouseover',
      function () {
        map.ui.tooltip({
          content: `${L._('Switch to edit mode')} (<kbd>Ctrl+E</kbd>)`,
          anchor: enableEditing,
          position: 'bottom',
          delay: 750,
          duration: 5000,
        })
      },
      this
    )

    return container
  },
})

/* Share control */
L.Control.Embed = L.Control.extend({
  options: {
    position: 'topleft',
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-control-embed umap-control')
    const shareButton = L.DomUtil.createButton(
      '',
      container,
      L._('Embed and share this map'),
      map.renderShareBox,
      map
    )
    L.DomEvent.on(shareButton, 'dblclick', L.DomEvent.stopPropagation)
    return container
  },
})

L.U.MoreControls = L.Control.extend({
  options: {
    position: 'topleft',
  },

  onAdd: function () {
    const container = L.DomUtil.create('div', 'umap-control-text')
    const moreButton = L.DomUtil.createButton(
      'umap-control-more',
      container,
      L._('More controls'),
      this.toggle,
      this
    )
    const lessButton = L.DomUtil.createButton(
      'umap-control-less',
      container,
      L._('Hide controls'),
      this.toggle,
      this
    )
    return container
  },

  toggle: function () {
    const pos = this.getPosition(),
      corner = this._map._controlCorners[pos],
      className = 'umap-more-controls'
    if (L.DomUtil.hasClass(corner, className)) L.DomUtil.removeClass(corner, className)
    else L.DomUtil.addClass(corner, className)
  },
})

L.U.PermanentCreditsControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },

  initialize: function (map, options) {
    this.map = map
    L.Control.prototype.initialize.call(this, options)
  },

  onAdd: function () {
    const paragraphContainer = L.DomUtil.create(
        'div',
        'umap-permanent-credits-container'
      ),
      creditsParagraph = L.DomUtil.create('p', '', paragraphContainer)

    this.paragraphContainer = paragraphContainer
    this.setCredits()
    this.setBackground()

    return paragraphContainer
  },

  setCredits: function () {
    this.paragraphContainer.innerHTML = L.Util.toHTML(this.map.options.permanentCredit)
  },

  setBackground: function () {
    if (this.map.options.permanentCreditBackground) {
      this.paragraphContainer.style.backgroundColor = '#FFFFFFB0'
    } else {
      this.paragraphContainer.style.backgroundColor = ''
    }
  },
})

L.U.DataLayersControl = L.Control.extend({
  options: {
    position: 'topleft',
  },

  labels: {
    zoomToLayer: L._('Zoom to layer extent'),
    toggleLayer: L._('Show/hide layer'),
    editLayer: L._('Edit'),
  },

  initialize: function (map, options) {
    this.map = map
    L.Control.prototype.initialize.call(this, options)
  },

  _initLayout: function (map) {
    const container = (this._container = L.DomUtil.create(
        'div',
        'leaflet-control-browse umap-control'
      )),
      actions = L.DomUtil.create('div', 'umap-browse-actions', container)
    this._datalayers_container = L.DomUtil.create(
      'ul',
      'umap-browse-datalayers',
      actions
    )

    L.DomUtil.createButton(
      'umap-browse-link',
      actions,
      L._('Browse data'),
      map.openBrowser,
      map
    )

    const toggleButton = L.DomUtil.createButton(
      'umap-browse-toggle',
      container,
      L._('See data layers')
    )
    L.DomEvent.on(toggleButton, 'click', L.DomEvent.stop)

    map.whenReady(function () {
      this.update()
    }, this)

    if (L.Browser.pointer) {
      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation)
      L.DomEvent.on(container, 'MozMousePixelScroll', L.DomEvent.stopPropagation)
    }
    if (!L.Browser.touch) {
      L.DomEvent.on(
        container,
        {
          mouseenter: this.expand,
          mouseleave: this.collapse,
        },
        this
      )
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
      L.DomEvent.on(toggleButton, 'click', L.DomEvent.stop).on(
        toggleButton,
        'click',
        this.expand,
        this
      )
      map.on('click', this.collapse, this)
    }

    return container
  },

  onAdd: function (map) {
    if (!this._container) this._initLayout(map)
    if (map.options.datalayersControl === 'expanded') this.expand()
    return this._container
  },

  onRemove: function (map) {
    this.collapse()
  },

  update: function () {
    if (this._datalayers_container && this._map) {
      this._datalayers_container.innerHTML = ''
      this.map.eachDataLayerReverse(function (datalayer) {
        this.addDataLayer(this._datalayers_container, datalayer)
      }, this)
    }
  },

  expand: function () {
    L.DomUtil.addClass(this._container, 'expanded')
  },

  collapse: function () {
    if (this.map.options.datalayersControl === 'expanded') return
    L.DomUtil.removeClass(this._container, 'expanded')
  },

  addDataLayer: function (container, datalayer, draggable) {
    const datalayerLi = L.DomUtil.create('li', '', container)
    if (draggable)
      L.DomUtil.element(
        'i',
        { className: 'drag-handle', title: L._('Drag to reorder') },
        datalayerLi
      )
    datalayer.renderToolbox(datalayerLi)
    const title = L.DomUtil.add(
      'span',
      'layer-title',
      datalayerLi,
      datalayer.options.name
    )

    datalayerLi.id = `browse_data_toggle_${L.stamp(datalayer)}`
    L.DomUtil.classIf(datalayerLi, 'off', !datalayer.isVisible())

    title.textContent = datalayer.options.name
  },

  newDataLayer: function () {
    const datalayer = this.map.createDataLayer({})
    datalayer.edit()
  },

  openPanel: function () {
    if (!this.map.editEnabled) return
    const container = L.DomUtil.create('ul', 'umap-browse-datalayers')
    this.map.eachDataLayerReverse(function (datalayer) {
      this.addDataLayer(container, datalayer, true)
    }, this)
    const orderable = new L.U.Orderable(container)
    orderable.on(
      'drop',
      function (e) {
        const layer = this.map.datalayers[e.src.dataset.id],
          other = this.map.datalayers[e.dst.dataset.id],
          minIndex = Math.min(e.initialIndex, e.finalIndex)
        if (e.finalIndex === 0) layer.bringToTop()
        else if (e.finalIndex > e.initialIndex) layer.insertBefore(other)
        else layer.insertAfter(other)
        this.map.eachDataLayerReverse((datalayer) => {
          if (datalayer.getRank() >= minIndex) datalayer.isDirty = true
        })
        this.map.indexDatalayers()
      },
      this
    )

    const bar = L.DomUtil.create('div', 'button-bar', container)
    L.DomUtil.createButton(
      'show-on-edit block add-datalayer button',
      bar,
      L._('Add a layer'),
      this.newDataLayer,
      this
    )

    this.map.ui.openPanel({ data: { html: container }, className: 'dark' })
  },
})

L.U.DataLayer.include({
  renderLegend: function (container) {
    if (this.layer.renderLegend) return this.layer.renderLegend(container)
    const color = L.DomUtil.create('span', 'datalayer-color', container)
    color.style.backgroundColor = this.getColor()
  },

  renderToolbox: function (container) {
    const toggle = L.DomUtil.create('i', 'layer-toggle', container),
      zoomTo = L.DomUtil.create('i', 'layer-zoom_to', container),
      edit = L.DomUtil.create('i', 'layer-edit show-on-edit', container),
      table = L.DomUtil.create('i', 'layer-table-edit show-on-edit', container),
      remove = L.DomUtil.create('i', 'layer-delete show-on-edit', container)
    zoomTo.title = L._('Zoom to layer extent')
    toggle.title = L._('Show/hide layer')
    edit.title = L._('Edit')
    table.title = L._('Edit properties in a table')
    remove.title = L._('Delete layer')
    if (this.isReadOnly()) {
      L.DomUtil.addClass(container, 'readonly')
    } else {
      L.DomEvent.on(edit, 'click', this.edit, this)
      L.DomEvent.on(table, 'click', this.tableEdit, this)
      L.DomEvent.on(
        remove,
        'click',
        function () {
          if (!this.isVisible()) return
          if (!confirm(L._('Are you sure you want to delete this layer?'))) return
          this._delete()
          this.map.ui.closePanel()
        },
        this
      )
    }
    L.DomEvent.on(toggle, 'click', this.toggle, this)
    L.DomEvent.on(zoomTo, 'click', this.zoomTo, this)
    L.DomUtil.addClass(container, this.getHidableClass())
    L.DomUtil.classIf(container, 'off', !this.isVisible())
    container.dataset.id = L.stamp(this)
  },

  getHidableElements: function () {
    return document.querySelectorAll(`.${this.getHidableClass()}`)
  },

  getHidableClass: function () {
    return `show_with_datalayer_${L.stamp(this)}`
  },

  propagateRemote: function () {
    const els = this.getHidableElements()
    for (let i = 0; i < els.length; i++) {
      L.DomUtil.classIf(els[i], 'remotelayer', this.isRemoteLayer())
    }
  },

  propagateHide: function () {
    const els = this.getHidableElements()
    for (let i = 0; i < els.length; i++) {
      L.DomUtil.addClass(els[i], 'off')
    }
  },

  propagateShow: function () {
    this.onceLoaded(function () {
      const els = this.getHidableElements()
      for (let i = 0; i < els.length; i++) {
        L.DomUtil.removeClass(els[i], 'off')
      }
    }, this)
  },
})

L.U.DataLayer.addInitHook(function () {
  this.on('hide', this.propagateHide)
  this.on('show', this.propagateShow)
  if (this.isVisible()) this.propagateShow()
})

L.U.Map.include({
  _openFacet: function () {
    const container = L.DomUtil.create('div', 'umap-facet-search'),
      title = L.DomUtil.add('h3', 'umap-filter-title', container, L._('Facet search')),
      keys = Object.keys(this.getFacetKeys())

    const knownValues = {}

    keys.forEach((key) => {
      knownValues[key] = []
      if (!this.facets[key]) this.facets[key] = []
    })

    this.eachBrowsableDataLayer((datalayer) => {
      datalayer.eachFeature((feature) => {
        keys.forEach((key) => {
          let value = feature.properties[key]
          if (typeof value !== 'undefined' && !knownValues[key].includes(value)) {
            knownValues[key].push(value)
          }
        })
      })
    })

    const filterFeatures = function () {
      let found = false
      this.eachBrowsableDataLayer((datalayer) => {
        datalayer.resetLayer(true)
        if (datalayer.hasDataVisible()) found = true
      })
      // TODO: display a results counter in the panel instead.
      if (!found)
        this.ui.alert({ content: L._('No results for these facets'), level: 'info' })
    }

    const fields = keys.map((current) => [
      `facets.${current}`,
      {
        handler: 'FacetSearch',
        choices: knownValues[current],
        label: this.getFacetKeys()[current],
      },
    ])
    const builder = new L.U.FormBuilder(this, fields, {
      makeDirty: false,
      callback: filterFeatures,
      callbackContext: this,
    })
    container.appendChild(builder.build())

    this.ui.openPanel({ data: { html: container }, actions: [this._aboutLink()] })
  },

  _aboutLink: function () {
    const link = L.DomUtil.create('li', '')
    L.DomUtil.create('i', 'umap-icon-16 umap-caption', link)
    const label = L.DomUtil.create('span', '', link)
    label.textContent = label.title = L._('About')
    L.DomEvent.on(link, 'click', this.displayCaption, this)
    return link
  },

  displayCaption: function () {
    const container = L.DomUtil.create('div', 'umap-caption')
    let title = L.DomUtil.create('h3', '', container)
    title.textContent = this.options.name
    this.permissions.addOwnerLink('h5', container)
    if (this.options.description) {
      const description = L.DomUtil.create('div', 'umap-map-description', container)
      description.innerHTML = L.Util.toHTML(this.options.description)
    }
    const datalayerContainer = L.DomUtil.create('div', 'datalayer-container', container)
    this.eachVisibleDataLayer((datalayer) => {
      if (!datalayer.options.inCaption) return
      const p = L.DomUtil.create('p', 'datalayer-legend', datalayerContainer),
        legend = L.DomUtil.create('span', '', p),
        headline = L.DomUtil.create('strong', '', p),
        description = L.DomUtil.create('span', '', p)
      datalayer.onceLoaded(function () {
        datalayer.renderLegend(legend)
        if (datalayer.options.description) {
          description.innerHTML = L.Util.toHTML(datalayer.options.description)
        }
      })
      datalayer.renderToolbox(headline)
      L.DomUtil.add('span', '', headline, `${datalayer.options.name} `)
    })
    const creditsContainer = L.DomUtil.create('div', 'credits-container', container),
      credits = L.DomUtil.createFieldset(creditsContainer, L._('Credits'))
    title = L.DomUtil.add('h5', '', credits, L._('User content credits'))
    if (this.options.shortCredit || this.options.longCredit) {
      L.DomUtil.add(
        'p',
        '',
        credits,
        L.Util.toHTML(this.options.longCredit || this.options.shortCredit)
      )
    }
    if (this.options.licence) {
      const licence = L.DomUtil.add(
        'p',
        '',
        credits,
        `${L._('Map user content has been published under licence')} `
      )
      L.DomUtil.createLink(
        '',
        licence,
        this.options.licence.name,
        this.options.licence.url
      )
    } else {
      L.DomUtil.add('p', '', credits, L._('No licence has been set'))
    }
    L.DomUtil.create('hr', '', credits)
    title = L.DomUtil.create('h5', '', credits)
    title.textContent = L._('Map background credits')
    const tilelayerCredit = L.DomUtil.create('p', '', credits),
      name = L.DomUtil.create('strong', '', tilelayerCredit),
      attribution = L.DomUtil.create('span', '', tilelayerCredit)
    name.textContent = `${this.selected_tilelayer.options.name} `
    attribution.innerHTML = this.selected_tilelayer.getAttribution()
    L.DomUtil.create('hr', '', credits)
    const umapCredit = L.DomUtil.create('p', '', credits),
      urls = {
        leaflet: 'http://leafletjs.com',
        django: 'https://www.djangoproject.com',
        umap: 'http://wiki.openstreetmap.org/wiki/UMap',
        changelog: 'https://umap-project.readthedocs.io/en/master/changelog/',
        version: this.options.umap_version,
      }
    umapCredit.innerHTML = L._(
      `
      Powered by <a href="{leaflet}">Leaflet</a> and
      <a href="{django}">Django</a>,
      glued by <a href="{umap}">uMap project</a>
      (version <a href="{changelog}">{version}</a>).
      `,
      urls
    )
    const browser = L.DomUtil.create('li', '')
    L.DomUtil.create('i', 'umap-icon-16 umap-list', browser)
    const labelBrowser = L.DomUtil.create('span', '', browser)
    labelBrowser.textContent = labelBrowser.title = L._('Browse data')
    L.DomEvent.on(browser, 'click', this.openBrowser, this)
    const actions = [browser]
    if (this.options.facetKey) {
      const filter = L.DomUtil.create('li', '')
      L.DomUtil.create('i', 'umap-icon-16 umap-add', filter)
      const labelFilter = L.DomUtil.create('span', '', filter)
      labelFilter.textContent = labelFilter.title = L._('Facet search')
      L.DomEvent.on(filter, 'click', this.openFacet, this)
      actions.push(filter)
    }
    this.ui.openPanel({ data: { html: container }, actions: actions })
  },

  EXPORT_TYPES: {
    geojson: {
      formatter: function (map) {
        return JSON.stringify(map.toGeoJSON(), null, 2)
      },
      ext: '.geojson',
      filetype: 'application/json',
    },
    gpx: {
      formatter: function (map) {
        return togpx(map.toGeoJSON())
      },
      ext: '.gpx',
      filetype: 'application/gpx+xml',
    },
    kml: {
      formatter: function (map) {
        return tokml(map.toGeoJSON())
      },
      ext: '.kml',
      filetype: 'application/vnd.google-earth.kml+xml',
    },
    csv: {
      formatter: function (map) {
        const table = []
        map.eachFeature((feature) => {
          const row = feature.toGeoJSON()['properties'],
            center = feature.getCenter()
          delete row['_umap_options']
          row['Latitude'] = center.lat
          row['Longitude'] = center.lng
          table.push(row)
        })
        return csv2geojson.dsv.csvFormat(table)
      },
      ext: '.csv',
      filetype: 'text/csv',
    },
  },

  renderEditToolbar: function () {
    const container = L.DomUtil.create(
      'div',
      'umap-main-edit-toolbox with-transition dark',
      this._controlContainer
    )
    const leftContainer = L.DomUtil.create('div', 'umap-left-edit-toolbox', container)
    const rightContainer = L.DomUtil.create('div', 'umap-right-edit-toolbox', container)
    const logo = L.DomUtil.create('div', 'logo', leftContainer)
    L.DomUtil.createLink('', logo, 'uMap', '/', null, L._('Go to the homepage'))
    const nameButton = L.DomUtil.createButton(
      'map-name',
      leftContainer,
      '',
      this.edit,
      this
    )
    L.DomEvent.on(
      nameButton,
      'mouseover',
      function () {
        this.ui.tooltip({
          content: L._('Edit the title of the map'),
          anchor: nameButton,
          position: 'bottom',
          delay: 500,
          duration: 5000,
        })
      },
      this
    )
    const shareStatusButton = L.DomUtil.createButton(
      'share-status',
      leftContainer,
      '',
      this.permissions.edit,
      this.permissions
    )
    L.DomEvent.on(
      shareStatusButton,
      'mouseover',
      function () {
        this.ui.tooltip({
          content: L._('Update who can see and edit the map'),
          anchor: shareStatusButton,
          position: 'bottom',
          delay: 500,
          duration: 5000,
        })
      },
      this
    )
    const update = () => {
      const status = this.permissions.getShareStatusDisplay()
      nameButton.textContent = this.getDisplayName()
      // status is not set until map is saved once
      if (status) {
        shareStatusButton.textContent = L._('Visibility: {status}', {
          status: status,
        })
      }
    }
    update()
    this.once('saved', L.bind(update, this))
    if (this.options.editMode === 'advanced') {
      L.DomEvent.on(nameButton, 'click', this.edit, this)
      L.DomEvent.on(shareStatusButton, 'click', this.permissions.edit, this.permissions)
    }
    this.on('postsync', L.bind(update, this))
    if (this.options.user) {
      L.DomUtil.createLink(
        'umap-user',
        rightContainer,
        L._(`My Dashboard <span>({username})</span>`, {
          username: this.options.user.name,
        }),
        this.options.user.url
      )
    }
    this.help.link(rightContainer, 'edit')
    const controlEditCancel = L.DomUtil.createButton(
      'leaflet-control-edit-cancel',
      rightContainer,
      L.DomUtil.add('span', '', null, L._('Cancel edits')),
      this.askForReset,
      this
    )
    L.DomEvent.on(
      controlEditCancel,
      'mouseover',
      function () {
        this.ui.tooltip({
          content: `${L._('Cancel')} (<kbd>Ctrl+Z</kbd>)`,
          anchor: controlEditCancel,
          position: 'bottom',
          delay: 500,
          duration: 5000,
        })
      },
      this
    )
    const controlEditDisable = L.DomUtil.createButton(
      'leaflet-control-edit-disable',
      rightContainer,
      L.DomUtil.add('span', '', null, L._('View')),
      function (e) {
        this.disableEdit(e)
        this.ui.closePanel()
      },
      this
    )
    L.DomEvent.on(
      controlEditDisable,
      'mouseover',
      function () {
        this.ui.tooltip({
          content: `${L._('Back to preview')} (<kbd>Ctrl+E</kbd>)`,
          anchor: controlEditDisable,
          position: 'bottom',
          delay: 500,
          duration: 5000,
        })
      },
      this
    )
    const controlEditSave = L.DomUtil.createButton(
      'leaflet-control-edit-save button',
      rightContainer,
      L.DomUtil.add('span', '', null, L._('Save')),
      this.save,
      this
    )
    L.DomEvent.on(
      controlEditSave,
      'mouseover',
      function () {
        this.ui.tooltip({
          content: `${L._('Save current edits')} (<kbd>Ctrl+S</kbd>)`,
          anchor: controlEditSave,
          position: 'bottom',
          delay: 500,
          duration: 5000,
        })
      },
      this
    )
  },

  renderShareBox: function () {
    const container = L.DomUtil.create('div', 'umap-share')
    const embedTitle = L.DomUtil.add('h4', '', container, L._('Embed the map'))
    const iframe = L.DomUtil.create('textarea', 'umap-share-iframe', container)
    const urlTitle = L.DomUtil.add('h4', '', container, L._('Direct link'))
    const exportUrl = L.DomUtil.create('input', 'umap-share-url', container)
    let option
    exportUrl.type = 'text'
    const UIFields = [
      ['dimensions.width', { handler: 'Input', label: L._('width') }],
      ['dimensions.height', { handler: 'Input', label: L._('height') }],
      [
        'options.includeFullScreenLink',
        { handler: 'Switch', label: L._('Include full screen link?') },
      ],
      [
        'options.currentView',
        { handler: 'Switch', label: L._('Current view instead of default map view?') },
      ],
      [
        'options.keepCurrentDatalayers',
        { handler: 'Switch', label: L._('Keep current visible layers') },
      ],
      [
        'options.viewCurrentFeature',
        { handler: 'Switch', label: L._('Open current feature on load') },
      ],
      'queryString.moreControl',
      'queryString.scrollWheelZoom',
      'queryString.miniMap',
      'queryString.scaleControl',
      'queryString.onLoadPanel',
      'queryString.captionBar',
      'queryString.captionMenus',
    ]
    for (let i = 0; i < this.HIDDABLE_CONTROLS.length; i++) {
      UIFields.push(`queryString.${this.HIDDABLE_CONTROLS[i]}Control`)
    }
    const iframeExporter = new L.U.IframeExporter(this)
    const buildIframeCode = () => {
      iframe.innerHTML = iframeExporter.build()
      exportUrl.value = window.location.protocol + iframeExporter.buildUrl()
    }
    buildIframeCode()
    const builder = new L.U.FormBuilder(iframeExporter, UIFields, {
      callback: buildIframeCode,
    })
    const iframeOptions = L.DomUtil.createFieldset(container, L._('Export options'))
    iframeOptions.appendChild(builder.build())
    if (this.options.shortUrl) {
      L.DomUtil.create('hr', '', container)
      L.DomUtil.add('h4', '', container, L._('Short URL'))
      const shortUrl = L.DomUtil.create('input', 'umap-short-url', container)
      shortUrl.type = 'text'
      shortUrl.value = this.options.shortUrl
    }
    L.DomUtil.create('hr', '', container)
    L.DomUtil.add('h4', '', container, L._('Backup data'))
    const downloadUrl = L.Util.template(this.options.urls.map_download, {
      map_id: this.options.umap_id,
    })
    const link = L.DomUtil.createLink(
      'button',
      container,
      L._('Download full data'),
      downloadUrl
    )
    let name = this.options.name || 'data'
    name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    link.setAttribute('download', `${name}.umap`)
    L.DomUtil.create('hr', '', container)
    L.DomUtil.add('h4', '', container, L._('Download data'))
    const typeInput = L.DomUtil.create('select', '', container)
    typeInput.name = 'format'
    const exportCaveat = L.DomUtil.add(
      'small',
      'help-text',
      container,
      L._('Only visible features will be downloaded.')
    )
    for (const key in this.EXPORT_TYPES) {
      if (this.EXPORT_TYPES.hasOwnProperty(key)) {
        option = L.DomUtil.create('option', '', typeInput)
        option.value = key
        option.textContent = this.EXPORT_TYPES[key].name || key
        if (this.EXPORT_TYPES[key].selected) option.selected = true
      }
    }
    L.DomUtil.createButton(
      'button',
      container,
      L._('Download data'),
      () => this.download(typeInput.value),
      this
    )
    this.ui.openPanel({ data: { html: container } })
  },

  importPanel: function () {
    const container = L.DomUtil.create('div', 'umap-upload')
    const title = L.DomUtil.create('h4', '', container)
    const presetBox = L.DomUtil.create('div', 'formbox', container)
    const presetSelect = L.DomUtil.create('select', '', presetBox)
    const fileBox = L.DomUtil.create('div', 'formbox', container)
    const fileInput = L.DomUtil.create('input', '', fileBox)
    const urlInput = L.DomUtil.create('input', '', container)
    const rawInput = L.DomUtil.create('textarea', '', container)
    const typeLabel = L.DomUtil.create('label', '', container)
    const layerLabel = L.DomUtil.create('label', '', container)
    const clearLabel = L.DomUtil.create('label', '', container)
    const submitInput = L.DomUtil.create('input', '', container)
    const map = this
    let option
    const types = ['geojson', 'csv', 'gpx', 'kml', 'osm', 'georss', 'umap']
    title.textContent = L._('Import data')
    fileInput.type = 'file'
    fileInput.multiple = 'multiple'
    submitInput.type = 'button'
    submitInput.value = L._('Import')
    submitInput.className = 'button'
    typeLabel.textContent = L._('Choose the format of the data to import')
    this.help.button(typeLabel, 'importFormats')
    const typeInput = L.DomUtil.create('select', '', typeLabel)
    typeInput.name = 'format'
    layerLabel.textContent = L._('Choose the layer to import in')
    const layerInput = L.DomUtil.create('select', '', layerLabel)
    layerInput.name = 'datalayer'
    urlInput.type = 'text'
    urlInput.placeholder = L._('Provide an URL here')
    rawInput.placeholder = L._('Paste your data here')
    clearLabel.textContent = L._('Replace layer content')
    const clearFlag = L.DomUtil.create('input', '', clearLabel)
    clearFlag.type = 'checkbox'
    clearFlag.name = 'clear'
    this.eachDataLayerReverse((datalayer) => {
      if (datalayer.isLoaded() && !datalayer.isRemoteLayer()) {
        const id = L.stamp(datalayer)
        option = L.DomUtil.create('option', '', layerInput)
        option.value = id
        option.textContent = datalayer.options.name
      }
    })
    L.DomUtil.element(
      'option',
      { value: '', textContent: L._('Import in a new layer') },
      layerInput
    )
    L.DomUtil.element(
      'option',
      { value: '', textContent: L._('Choose the data format') },
      typeInput
    )
    for (let i = 0; i < types.length; i++) {
      option = L.DomUtil.create('option', '', typeInput)
      option.value = option.textContent = types[i]
    }
    if (this.options.importPresets.length) {
      const noPreset = L.DomUtil.create('option', '', presetSelect)
      noPreset.value = noPreset.textContent = L._('Choose a preset')
      for (let j = 0; j < this.options.importPresets.length; j++) {
        option = L.DomUtil.create('option', '', presetSelect)
        option.value = this.options.importPresets[j].url
        option.textContent = this.options.importPresets[j].label
      }
    } else {
      presetBox.style.display = 'none'
    }

    const submit = function () {
      let type = typeInput.value
      const layerId = layerInput[layerInput.selectedIndex].value
      let layer
      if (type === 'umap') {
        this.once('postsync', function () {
          this.setView(this.latLng(this.options.center), this.options.zoom)
        })
      }
      if (layerId) layer = map.datalayers[layerId]
      if (layer && clearFlag.checked) layer.empty()
      if (fileInput.files.length) {
        for (let i = 0, file; (file = fileInput.files[i]); i++) {
          this.processFileToImport(file, layer, type)
        }
      } else {
        if (!type)
          return this.ui.alert({
            content: L._('Please choose a format'),
            level: 'error',
          })
        if (rawInput.value && type === 'umap') {
          try {
            this.importRaw(rawInput.value, type)
          } catch (e) {
            this.ui.alert({ content: L._('Invalid umap data'), level: 'error' })
            console.error(e)
          }
        } else {
          if (!layer) layer = this.createDataLayer()
          if (rawInput.value) layer.importRaw(rawInput.value, type)
          else if (urlInput.value) layer.importFromUrl(urlInput.value, type)
          else if (presetSelect.selectedIndex > 0)
            layer.importFromUrl(presetSelect[presetSelect.selectedIndex].value, type)
        }
      }
    }
    L.DomEvent.on(submitInput, 'click', submit, this)
    L.DomEvent.on(
      fileInput,
      'change',
      (e) => {
        let type = '',
          newType
        for (let i = 0; i < e.target.files.length; i++) {
          newType = L.Util.detectFileType(e.target.files[i])
          if (!type && newType) type = newType
          if (type && newType !== type) {
            type = ''
            break
          }
        }
        typeInput.value = type
      },
      this
    )
    this.ui.openPanel({ data: { html: container }, className: 'dark' })
  },
})

L.U.TileLayerControl = L.Control.extend({
  options: {
    position: 'topleft',
  },

  initialize: function (map, options) {
    this.map = map
    L.Control.prototype.initialize.call(this, options)
  },

  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-control-tilelayers umap-control')
    const changeMapBackgroundButton = L.DomUtil.createButton(
      '',
      container,
      L._('Change map background'),
      this.openSwitcher,
      this
    )
    L.DomEvent.on(changeMapBackgroundButton, 'dblclick', L.DomEvent.stopPropagation)
    return container
  },

  openSwitcher: function (options) {
    this._tilelayers_container = L.DomUtil.create(
      'ul',
      'umap-tilelayer-switcher-container'
    )
    this.buildList(options)
  },

  buildList: function (options) {
    this.map.eachTileLayer(function (tilelayer) {
      if (
        window.location.protocol === 'https:' &&
        tilelayer.options.url_template.indexOf('http:') === 0
      )
        return
      this.addTileLayerElement(tilelayer, options)
    }, this)
    this.map.ui.openPanel({
      data: { html: this._tilelayers_container },
      className: options.className,
    })
  },

  addTileLayerElement: function (tilelayer, options) {
    const selectedClass = this.map.hasLayer(tilelayer) ? 'selected' : '',
      el = L.DomUtil.create('li', selectedClass, this._tilelayers_container),
      img = L.DomUtil.create('img', '', el),
      name = L.DomUtil.create('div', '', el)
    img.src = L.Util.template(tilelayer.options.url_template, this.map.demoTileInfos)
    img.loading = 'lazy'
    name.textContent = tilelayer.options.name
    L.DomEvent.on(
      el,
      'click',
      function () {
        this.map.selectTileLayer(tilelayer)
        if (options && options.callback) options.callback(tilelayer)
      },
      this
    )
  },
})

L.U.AttributionControl = L.Control.Attribution.extend({
  options: {
    prefix: '',
  },

  _update: function () {
    L.Control.Attribution.prototype._update.call(this)
    // Use our how container, so we can hide/show on small screens
    const credits = this._container.innerHTML
    this._container.innerHTML = ''
    const container = L.DomUtil.add(
      'div',
      'attribution-container',
      this._container,
      credits
    )
    if (this._map.options.shortCredit) {
      L.DomUtil.add(
        'span',
        '',
        container,
        ` — ${L.Util.toHTML(this._map.options.shortCredit)}`
      )
    }
    if (this._map.options.captionMenus) {
      const link = L.DomUtil.add('a', '', container, ` — ${L._('About')}`)
      L.DomEvent.on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', this._map.displayCaption, this._map)
        .on(link, 'dblclick', L.DomEvent.stop)
    }
    if (window.top === window.self && this._map.options.captionMenus) {
      // We are not in iframe mode
      L.DomUtil.createLink('', container, ` — ${L._('Home')}`, '/')
    }
    if (this._map.options.captionMenus) {
      L.DomUtil.createLink(
        '',
        container,
        ` — ${L._('Powered by uMap')}`,
        'https://github.com/umap-project/umap/'
      )
    }
    L.DomUtil.createLink('attribution-toggle', this._container, '')
  },
})

L.U.StarControl = L.Control.extend({
  options: {
    position: 'topleft',
  },

  onAdd: function (map) {
    const status = map.options.starred ? ' starred' : ''
    const container = L.DomUtil.create(
      'div',
      `leaflet-control-star umap-control${status}`
    )
    const starMapButton = L.DomUtil.createButton(
      '',
      container,
      L._('Star this map'),
      map.star,
      map
    )
    L.DomEvent.on(starMapButton, 'dblclick', L.DomEvent.stopPropagation)
    return container
  },
})

L.U.Search = L.PhotonSearch.extend({
  initialize: function (map, input, options) {
    L.PhotonSearch.prototype.initialize.call(this, map, input, options)
    this.options.url = map.options.urls.search
    if (map.options.maxBounds) this.options.bbox = map.options.maxBounds.toBBoxString()
  },

  onBlur: function (e) {
    // Overrided because we don't want to hide the results on blur.
    this.fire('blur')
  },

  formatResult: function (feature, el) {
    const self = this
    const tools = L.DomUtil.create('span', 'search-result-tools', el),
      zoom = L.DomUtil.create('i', 'feature-zoom_to', tools),
      edit = L.DomUtil.create('i', 'feature-edit show-on-edit', tools)
    zoom.title = L._('Zoom to this place')
    edit.title = L._('Save this location as new feature')
    // We need to use "mousedown" because Leaflet.Photon listen to mousedown
    // on el.
    L.DomEvent.on(zoom, 'mousedown', (e) => {
      L.DomEvent.stop(e)
      self.zoomToFeature(feature)
    })
    L.DomEvent.on(edit, 'mousedown', (e) => {
      L.DomEvent.stop(e)
      const datalayer = self.map.defaultEditDataLayer()
      const layer = datalayer.geojsonToFeatures(feature)
      layer.isDirty = true
      layer.edit()
    })
    this._formatResult(feature, el)
  },

  zoomToFeature: function (feature) {
    const zoom = Math.max(this.map.getZoom(), 16) // Never unzoom.
    this.map.setView(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      zoom
    )
  },

  onSelected: function (feature) {
    this.zoomToFeature(feature)
    this.map.ui.closePanel()
  },
})

L.U.SearchControl = L.Control.extend({
  options: {
    position: 'topleft',
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-control-search umap-control')
    L.DomEvent.disableClickPropagation(container)
    L.DomUtil.createButton(
      '',
      container,
      L._('Search a place name'),
      (e) => {
        L.DomEvent.stop(e)
        this.openPanel(map)
      },
      this
    )
    return container
  },

  openPanel: function (map) {
    const options = {
      limit: 10,
      noResultLabel: L._('No results'),
    }
    if (map.options.photonUrl) options.url = map.options.photonUrl
    const container = L.DomUtil.create('div', '')

    const title = L.DomUtil.create('h3', '', container)
    title.textContent = L._('Search location')
    const input = L.DomUtil.create('input', 'photon-input', container)
    const resultsContainer = L.DomUtil.create('div', 'photon-autocomplete', container)
    this.search = new L.U.Search(map, input, options)
    const id = Math.random()
    this.search.on('ajax:send', () => {
      map.fire('dataloading', { id: id })
    })
    this.search.on('ajax:return', () => {
      map.fire('dataload', { id: id })
    })
    this.search.resultsContainer = resultsContainer
    map.ui.once('panel:ready', () => {
      input.focus()
    })
    map.ui.openPanel({ data: { html: container } })
  },
})

L.Control.MiniMap.include({
  initialize: function (layer, options) {
    L.Util.setOptions(this, options)
    this._layer = this._cloneLayer(layer)
  },

  onMainMapBaseLayerChange: function (e) {
    const layer = this._cloneLayer(e.layer)
    if (this._miniMap.hasLayer(this._layer)) {
      this._miniMap.removeLayer(this._layer)
    }
    this._layer = layer
    this._miniMap.addLayer(this._layer)
  },

  _cloneLayer: function (layer) {
    return new L.TileLayer(layer._url, L.Util.extend({}, layer.options))
  },
})

L.Control.Loading.include({
  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'umap-loader', map._controlContainer)
    map.on('baselayerchange', this._layerAdd, this)
    this._addMapListeners(map)
    this._map = map
  },

  _showIndicator: function () {
    L.DomUtil.addClass(this._map._container, 'umap-loading')
  },

  _hideIndicator: function () {
    L.DomUtil.removeClass(this._map._container, 'umap-loading')
  },
})

/*
 * Make it dynamic
 */
L.U.ContextMenu = L.Map.ContextMenu.extend({
  _createItems: function (e) {
    this._map.setContextMenuItems(e)
    L.Map.ContextMenu.prototype._createItems.call(this)
  },

  _showAtPoint: function (pt, e) {
    this._items = []
    this._container.innerHTML = ''
    this._createItems(e)
    L.Map.ContextMenu.prototype._showAtPoint.call(this, pt, e)
  },
})

L.U.IframeExporter = L.Evented.extend({
  options: {
    includeFullScreenLink: true,
    currentView: false,
    keepCurrentDatalayers: false,
    viewCurrentFeature: false,
  },

  queryString: {
    scaleControl: false,
    miniMap: false,
    scrollWheelZoom: false,
    zoomControl: true,
    editMode: 'disabled',
    moreControl: true,
    searchControl: null,
    tilelayersControl: null,
    embedControl: null,
    datalayersControl: true,
    onLoadPanel: 'none',
    captionBar: false,
    captionMenus: true,
  },

  dimensions: {
    width: '100%',
    height: '300px',
  },

  initialize: function (map) {
    this.map = map
    this.baseUrl = L.Util.getBaseUrl()
    // Use map default, not generic default
    this.queryString.onLoadPanel = this.map.options.onLoadPanel
  },

  getMap: function () {
    return this.map
  },

  buildUrl: function (options) {
    const datalayers = []
    if (this.options.viewCurrentFeature && this.map.currentFeature) {
      this.queryString.feature = this.map.currentFeature.getSlug()
    }
    if (this.options.keepCurrentDatalayers) {
      this.map.eachDataLayer((datalayer) => {
        if (datalayer.isVisible() && datalayer.umap_id) {
          datalayers.push(datalayer.umap_id)
        }
      })
      this.queryString.datalayers = datalayers.join(',')
    } else {
      delete this.queryString.datalayers
    }
    const currentView = this.options.currentView ? window.location.hash : ''
    const queryString = L.extend({}, this.queryString, options)
    return `${this.baseUrl}?${L.Util.buildQueryString(queryString)}${currentView}`
  },

  build: function () {
    const iframeUrl = this.buildUrl()
    let code = `<iframe width="${this.dimensions.width}" height="${this.dimensions.height}" frameborder="0" allowfullscreen allow="geolocation" src="${iframeUrl}"></iframe>`
    if (this.options.includeFullScreenLink) {
      const fullUrl = this.buildUrl({ scrollWheelZoom: true })
      code += `<p><a href="${fullUrl}">${L._('See full screen')}</a></p>`
    }
    return code
  },
})

L.U.Editable = L.Editable.extend({
  initialize: function (map, options) {
    L.Editable.prototype.initialize.call(this, map, options)
    this.on(
      'editable:drawing:start editable:drawing:click editable:drawing:move',
      this.drawingTooltip
    )
    this.on('editable:drawing:end', this.closeTooltip)
    // Layer for items added by users
    this.on('editable:drawing:cancel', (e) => {
      if (e.layer._latlngs && e.layer._latlngs.length < e.layer.editor.MIN_VERTEX)
        e.layer.del()
      if (e.layer instanceof L.U.Marker) e.layer.del()
    })
    this.on('editable:drawing:commit', function (e) {
      e.layer.isDirty = true
      if (this.map.editedFeature !== e.layer) e.layer.edit(e)
    })
    this.on('editable:editing', (e) => {
      const layer = e.layer
      layer.isDirty = true
      if (layer._tooltip && layer.isTooltipOpen()) {
        layer._tooltip.setLatLng(layer.getCenter())
        layer._tooltip.update()
      }
    })
    this.on('editable:vertex:ctrlclick', (e) => {
      const index = e.vertex.getIndex()
      if (index === 0 || (index === e.vertex.getLastIndex() && e.vertex.continue))
        e.vertex.continue()
    })
    this.on('editable:vertex:altclick', (e) => {
      if (e.vertex.editor.vertexCanBeDeleted(e.vertex)) e.vertex.delete()
    })
    this.on('editable:vertex:rawclick', this.onVertexRawClick)
  },

  createPolyline: function (latlngs) {
    return new L.U.Polyline(this.map, latlngs, this._getDefaultProperties())
  },

  createPolygon: function (latlngs) {
    return new L.U.Polygon(this.map, latlngs, this._getDefaultProperties())
  },

  createMarker: function (latlng) {
    return new L.U.Marker(this.map, latlng, this._getDefaultProperties())
  },

  _getDefaultProperties: function () {
    const result = {}
    if (this.map.options.featuresHaveOwner && this.map.options.hasOwnProperty('user')) {
      result.geojson = { properties: { owner: this.map.options.user.id } }
    }
    return result
  },

  connectCreatedToMap: function (layer) {
    // Overrided from Leaflet.Editable
    const datalayer = this.map.defaultEditDataLayer()
    datalayer.addLayer(layer)
    layer.isDirty = true
    return layer
  },

  drawingTooltip: function (e) {
    if (e.layer instanceof L.Marker && e.type == 'editable:drawing:start') {
      this.map.ui.tooltip({ content: L._('Click to add a marker') })
    }
    if (!(e.layer instanceof L.Polyline)) {
      // only continue with Polylines and Polygons
      return
    }

    let content = L._('Drawing')
    let measure
    if (e.layer.editor._drawnLatLngs) {
      // when drawing (a Polyline or Polygon)
      if (!e.layer.editor._drawnLatLngs.length) {
        // when drawing first point
        if (e.layer instanceof L.Polygon) {
          content = L._('Click to start drawing a polygon')
        } else if (e.layer instanceof L.Polyline) {
          content = L._('Click to start drawing a line')
        }
      } else {
        const tmpLatLngs = e.layer.editor._drawnLatLngs.slice()
        tmpLatLngs.push(e.latlng)
        measure = e.layer.getMeasure(tmpLatLngs)

        if (e.layer.editor._drawnLatLngs.length < e.layer.editor.MIN_VERTEX) {
          // when drawing second point
          content = L._('Click to continue drawing')
        } else {
          // when drawing third point (or more)
          content = L._('Click last point to finish shape')
        }
      }
    } else {
      // when moving an existing point
      measure = e.layer.getMeasure()
    }
    if (measure) {
      if (e.layer instanceof L.Polygon) {
        content += L._(' (area: {measure})', { measure: measure })
      } else if (e.layer instanceof L.Polyline) {
        content += L._(' (length: {measure})', { measure: measure })
      }
    }
    if (content) {
      this.map.ui.tooltip({ content: content })
    }
  },

  closeTooltip: function () {
    this.map.ui.closeTooltip()
  },

  onVertexRawClick: function (e) {
    e.layer.onVertexRawClick(e)
    L.DomEvent.stop(e)
    e.cancel()
  },
})
