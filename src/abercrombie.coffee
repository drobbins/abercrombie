class Abercrombie
    constructor: ->
        @id        = "abercrombie"
        @version   = "0.0.1"
        @size      = 100               # Default px size of grid
        @probeSize = 6             # Default px size of probes
        @Abercrombie = Abercrombie  # Abercrombie-ception

    refresh: ->
        @cvTop = document.getElementById "cvTop"
        @ctx   = @cvTop.getContext "2d"

    alignCanvases: ->
        @refresh()
        cvBase            = document.getElementById("cvBase")
        @cvTop.style.left = cvBase.offsetLeft;
        @cvTop.style.top  = cvBase.offsetTop;

    clear: ->
        @getContext().clearRect 0, 0, @getCanvas().width, @getCanvas().height

    clearProbe: (x, y) ->
        @refresh()
        padding = @ctx.lineWidth
        @ctx.clearRect x - padding, y - padding, @probeSize + 2*padding, @probeSize + 2*padding

    countProbes: ->
        @refresh()
        numberOfProbes = Math.ceil(@cvTop.width/@size) * Math.ceil(@cvTop.height/@size)

    countMarkedProbes: ->
        @refresh()
        numberOfMarkedProbes = (Object.keys(@markedVertices).filter (key) => @markedVertices[key]).length

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
            if @start?[0] != @end?[0] or @start?[1] != @end?[1] then return
            vertex = @getNearestVertexToEvent evt, x, y
            @toggleMarkedVertex vertex
            @repaintMarkedVertices()
            @ui.updateCount()
        @cvTop.onmousedown = (evt,x,y) =>
            @start = @getEventCoordinates evt, x, y
        @cvTop.onmouseup = (evt,x,y) =>
            @end = @getEventCoordinates evt, x, y
            x1 = Math.min @start[0], @end[0]
            x2 = Math.max @start[0], @end[0]
            y1 = Math.min @start[1], @end[1]
            y2 = Math.max @start[1], @end[1]
            vx = Math.ceil(x1/@size) * @size    # x of the vertex nearest the upper-left corner
            vy = Math.ceil(y1/@size) * @size    # y of the vertex nearest the upper-left corner
            xs = (x for x in [vx..x2] by @size) # array of the x's of bounded vertices
            ys = (y for y in [vy..y2] by @size) # array of the y's of bounded vertices
            boundedVertices = []
            for x in xs
                for y in ys
                    boundedVertices.push [x,y]
            for vertex in boundedVertices
                @markedVertices[JSON.stringify vertex] = true
            @repaintMarkedVertices()
            @ui.updateCount()

    paintProbe: (x,y) ->
        @refresh()
        @ctx.strokeStyle = "#000000"
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

    ui:
        start: ->
            @msg = document.getElementById "msg"
            @msg.innerText = "Click probes to toggle selection. "
            @countFragment = document.createElement "span"
            @formFragment = @buildFormFragment()
            @msg.appendChild @formFragment
            @msg.appendChild @countFragment
            document.querySelector("#sizeForm").onchange = => @updateGrid()
        updateCount: ->
            numberOfProbes = abercrombie.countProbes()
            numberOfMarkedProbes = abercrombie.countMarkedProbes()
            percentMarked = (numberOfMarkedProbes/numberOfProbes * 100).toPrecision 4
            @countFragment.innerText = "#{numberOfMarkedProbes} of #{numberOfProbes} probes marked (#{percentMarked}%)."
        buildFormFragment: ->
            fragment = document.createElement "form"
            fragment.id = "sizeForm"
            fragment.style.display = "inline"
            fragment.innerHTML = "
                <label for=\"size\">Grid Size:<input name=\"size\" size=\"1\" value=\"#{abercrombie.size}\"/></label>
                <label for=\"probeSize\">Probe Size:<input name=\"probeSize\" size=\"1\" value=\"#{abercrombie.probeSize}\"/></label>
                <span> </span>"
            return fragment
        updateGrid: ->
            abercrombie.markedVertices = {}
            abercrombie.clear()
            abercrombie.size = parseInt document.querySelector("[name=\"size\"]").value, 10
            abercrombie.probeSize = parseInt document.querySelector("[name=\"probeSize\"]").value, 10
            abercrombie.paintGrid()
            abercrombie.markVertices()

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
        "Clear": -> abercrombie.clear()
        "Show Grid": -> abercrombie.paintGrid()
        "Mark Vertices": -> abercrombie.markVertices()
        "Start": ->
            abercrombie.ui.start()
            abercrombie.paintGrid()
            abercrombie.markVertices()
        
    document.getElementById("menu")?.appendChild? imagejs.menu menu, name