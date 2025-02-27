from playwright.sync_api import expect


def test_draw_polyline(page, live_server, tilelayer):
    page.goto(f"{live_server.url}/en/map/new/")

    # Click on the Draw a line button on a new map.
    create_line = page.locator(".leaflet-control-toolbar ").get_by_title(
        "Draw a polyline (Ctrl+L)"
    )
    create_line.click()

    # Check no line is present by default.
    # We target with the color, because there is also the drawing line guide (dash-array)
    # around
    lines = page.locator(".leaflet-overlay-pane path[stroke='DarkBlue']")
    guide = page.locator(".leaflet-overlay-pane > svg > g > path")
    expect(lines).to_have_count(0)
    expect(guide).to_have_count(0)

    # Click on the map, it will create a line.
    map = page.locator("#map")
    map.click(position={"x": 200, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    # Click again to finish
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(0)


def test_clicking_esc_should_finish_line(page, live_server, tilelayer):
    page.goto(f"{live_server.url}/en/map/new/")

    # Click on the Draw a line button on a new map.
    create_line = page.locator(".leaflet-control-toolbar ").get_by_title(
        "Draw a polyline (Ctrl+L)"
    )
    create_line.click()

    # Check no line is present by default.
    # We target with the color, because there is also the drawing line guide (dash-array)
    # around
    lines = page.locator(".leaflet-overlay-pane path[stroke='DarkBlue']")
    guide = page.locator(".leaflet-overlay-pane > svg > g > path")
    expect(lines).to_have_count(0)
    expect(guide).to_have_count(0)

    # Click on the map, it will create a line.
    map = page.locator("#map")
    map.click(position={"x": 200, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    # Click ESC to finish
    page.keyboard.press("Escape")
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(0)


def test_draw_polygon(page, live_server, tilelayer):
    page.goto(f"{live_server.url}/en/map/new/")

    # Click on the Draw a polygon button on a new map.
    create_line = page.locator(".leaflet-control-toolbar ").get_by_title(
        "Draw a polygon (Ctrl+P)"
    )
    create_line.click()

    # Check no polygon is present by default.
    # We target with the color, because there is also the drawing line guide (dash-array)
    # around
    lines = page.locator(".leaflet-overlay-pane path[stroke='DarkBlue']")
    guide = page.locator(".leaflet-overlay-pane > svg > g > path")
    expect(lines).to_have_count(0)
    expect(guide).to_have_count(0)

    # Click on the map, it will create a polygon.
    map = page.locator("#map")
    map.click(position={"x": 200, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(2)
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(2)
    # Click again to finish
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(0)


def test_clicking_esc_should_finish_polygon(page, live_server, tilelayer):
    page.goto(f"{live_server.url}/en/map/new/")

    # Click on the Draw a polygon button on a new map.
    create_line = page.locator(".leaflet-control-toolbar ").get_by_title(
        "Draw a polygon (Ctrl+P)"
    )
    create_line.click()

    # Check no polygon is present by default.
    # We target with the color, because there is also the drawing line guide (dash-array)
    # around
    lines = page.locator(".leaflet-overlay-pane path[stroke='DarkBlue']")
    guide = page.locator(".leaflet-overlay-pane > svg > g > path")
    expect(lines).to_have_count(0)
    expect(guide).to_have_count(0)

    # Click on the map, it will create a polygon.
    map = page.locator("#map")
    map.click(position={"x": 200, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(1)
    map.click(position={"x": 100, "y": 200})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(2)
    map.click(position={"x": 100, "y": 100})
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(2)
    # Click ESC to finish
    page.keyboard.press("Escape")
    expect(lines).to_have_count(1)
    expect(guide).to_have_count(0)
