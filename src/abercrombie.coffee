class Abercrombie
    constructor: ->
        @id      = "abercrombie"
        @version = "0.0.1"
        @size    = 50               # Default px size of grid/probe.
        @Abercrombie = Abercrombie  # Abercrombie-ception

    refresh: ->
        @cvTop = document.getElementById "cvTop"
        @ctx   = @cvTop.getContext "2d"

    alignCanvases: ->
        @refresh()
        cvBase = document.getElementById("cvBase")
        @cvTop.style.left=cvBase.offsetLeft;
        @cvTop.style.top=cvBase.offsetTop;

    getCanvas: -> document.getElementById("cvTop")

    getContext: -> @getCanvas().getContext("2d")

    paintProbe: (x,y) ->
        ctx = @getContext()
        ctx.strokeRect x, y, @size, @size

    placeProbe: ->
        cv = @getCanvas()
        cv.style.cursor = "crosshair"
        @alignCanvases()
        cv.onclick = (evt,x,y) ->
            if not x then x = evt.clientX-evt.target.offsetLeft+window.pageXOffset
            if not y then y = evt.clientY-evt.target.offsetTop+window.pageYOffset
            @paintProbe(x,y)

    paintGrid: ->
        cv = @getCanvas()
        for y in [0..cv.height-1] by @size
            @paintRow(y)
        return null

    paintRow: (y) ->
        cv = @getCanvas()
        for x in [0..cv.width-1] by @size
            @paintProbe(x,y)
        return null

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
        
    document.getElementById("menu")?.appendChild? imagejs.menu menu, name