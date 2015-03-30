class Abercrombie
    constructor: ->
        @id        = "abercrombie"
        @version   = "0.0.1"
        @size      = 50               # Default px size of grid
        @probeSize = 10             # Default px size of probes
        @Abercrombie = Abercrombie  # Abercrombie-ception

    refresh: ->
        @cvTop = document.getElementById "cvTop"
        @ctx   = @cvTop.getContext "2d"

    alignCanvases: ->
        @refresh()
        cvBase            = document.getElementById("cvBase")
        @cvTop.style.left = cvBase.offsetLeft;
        @cvTop.style.top  = cvBase.offsetTop;

    clearProbe: (x, y) ->
        @refresh()
        @ctx.clearRect x, y, @probeSize, @probeSize

    getCanvas: -> document.getElementById("cvTop")

    getContext: -> @getCanvas().getContext("2d")

    getEventCoordinates: (evt,x,y) ->
        if not x then x = evt.clientX - evt.target.offsetLeft + window.pageXOffset
        if not y then y = evt.clientY - evt.target.offsetTop  + window.pageYOffset
        [x,y]

    getNearestVertexToEvent: (evt, xx, yy) ->
        [x,y] = @getEventCoordinates evt, xx, yy
        vx = if x - Math.floor(x/@size)*@size > (@size/2) then Math.ceil(x/@size)*@size else Math.floor(x/@size)*@size
        vy = if y - Math.floor(y/@size)*@size > (@size/2) then Math.ceil(y/@size)*@size else Math.floor(y/@size)*@size
        [vx, vy]

    getProbeVertexOfEvent: (evt, xx, yy) ->
        [ex, ey] = @getEventCoordinates evt, xx, yy
        [vx, vy] = @getNearestVertexToEvent evt, xx, yy
        if (vx < ex < vx + @probeSize) and (vy < ey < vy + @probeSize)
            return [vx, vy]
        else
            return null

    markVertices: ->
        @refresh()
        @alignCanvases()
        @cvTop.style.cursor = "crosshair"
        @markedVertices = {}
        @cvTop.onclick = (evt,x,y) =>
            vertex = @getNearestVertexToEvent evt, x, y
            @toggleMarkedVertex vertex
            @repaintMarkedVertices()

    paintProbe: (x,y) ->
        @refresh()
        @ctx.strokeRect x, y, @probeSize, @probeSize

    placeProbe: ->
        @refresh()
        @cvTop.style.cursor = "crosshair"
        @alignCanvases()
        @cvTop.onclick = (evt,x,y) =>
            [x,y] = @getEventCoordinates evt, x, y
            @paintProbe(x,y)

    paintGrid: ->
        @refresh()
        for y in [0..@cvTop.height-1] by @size
            @paintRow(y)
        return null

    paintMarkedVertice: (x, y) ->
        @refresh()
        @ctx.strokeStyle = "#ff0000"
        @ctx.strokeRect x, y, @probeSize, @probeSize

    paintRow: (y) ->
        @refresh()
        for x in [0..@cvTop.width-1] by @size
            @paintProbe(x,y)
        return null

    repaintMarkedVertices: ->
        @refresh()
        for key in Object.keys @markedVertices
            vertex = JSON.parse key
            @clearProbe vertex[0], vertex[1]
            if @markedVertices[key]
                @paintMarkedVertice vertex[0], vertex[1]
            else
                @paintProbe vertex[0], vertex[1]

    toggleMarkedVertex: (vertex) ->
        key = JSON.stringify vertex
        if not @markedVertices[key] then @markedVertices[key] = true else @markedVertices[key] = false

# Instantiate Abercrombie
abercrombie = window.abercrombie = window.ab = new Abercrombie()

if imagejs?

    # Load Module
    imagejs.modules[abercrombie.id] = abercrombie

    # Say Hello
    imagejs.msg "#{abercrombie.id} version #{abercrombie.version} loaded."

    # Create the Menu
    name = "Abercrombie (#{abercrombie.version})"
    menu =
        "Clear": -> abercrombie.getContext().clearRect 0, 0, abercrombie.getCanvas().width, abercrombie.getCanvas().height
        "Place Probe": -> abercrombie.placeProbe()
        "Show Grid": -> abercrombie.paintGrid()
        "Mark Vertices": -> abercrombie.markVertices()
        
    document.getElementById("menu")?.appendChild? imagejs.menu menu, name