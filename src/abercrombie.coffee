class Abercrombie
    constructor: ->
        @id      = "abercrombie"
        @version = "0.0.1"
        @size    = 50               # Default px size of grid/probe.
        @Abercrombie = Abercrombie  # Abercrombie-ception
        @probes  = []

    refresh: ->
        @cvTop = document.getElementById "cvTop"
        @ctx   = @cvTop.getContext "2d"

    alignCanvases: ->
        @refresh()
        cvBase            = document.getElementById("cvBase")
        @cvTop.style.left = cvBase.offsetLeft;
        @cvTop.style.top  = cvBase.offsetTop;

    getCanvas: -> document.getElementById("cvTop")

    getContext: -> @getCanvas().getContext("2d")

    getEventCoordinates: (evt,x,y) ->
        if not x then x = evt.clientX - evt.target.offsetLeft + window.pageXOffset
        if not y then y = evt.clientY - evt.target.offsetTop  + window.pageYOffset
        [x,y]

    getRandomLocation: ->
        @refresh()
        return {
            x: @cvTop.width * Math.random()
            y: @cvTop.height * Math.random()
        }

    getPaddedRandomLocation: ->
        @refresh()
        tooCloseToEdge = (location) =>
            location.x > @cvTop.width - @size or location.y > @cvTop.height - @size
        location = @getRandomLocation()
        location = @getRandomLocation() while tooCloseToEdge location
        return location

    hasProbeOn: (location) ->
        value = false
        for probe in @probes
            if (probe.x - @size <= location.x <= probe.x + @size) and (probe.y - @size <= location.y <= probe.y + @size)
                value = true
                break
        value

    paintProbe: (x,y) ->
        @refresh()
        @ctx.strokeRect x, y, @size, @size

    placeProbe: ->
        @refresh()
        @cvTop.style.cursor = "crosshair"
        @alignCanvases()
        @cvTop.onclick = (evt,x,y) =>
            [x,y] = @getEventCoordinates evt, x, y
            @paintProbe(x,y)

    placeRandomProbe: ->
        @refresh()
        location = @getPaddedRandomLocation()
        @paintProbe location.x, location.y

    placeDistinctRandomProbe: ->
        @refresh()
        location = @getPaddedRandomLocation()
        location = @getPaddedRandomLocation() while @hasProbeOn location
        @probes.push location
        @paintProbe location.x, location.y
    
    placeRandomProbes: (count) ->
        @refresh()
        @placeRandomProbe() for n in [1..count]

    placeDistinctRandomProbes: (count) ->
        @refresh()
        @placeDistinctRandomProbe() for n in [1..count]

    paintGrid: ->
        @refresh()
        for y in [0..@cvTop.height-1] by @size
            @paintRow(y)
        return null

    paintRow: (y) ->
        @refresh()
        for x in [0..@cvTop.width-1] by @size
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
        "Place Random Probe": -> abercrombie.placeRandomProbe()
        "Place 10 Random Probes": -> abercrombie.placeRandomProbes(10)
        "Place 10 Distinct Random Probes": -> abercrombie.placeDistinctRandomProbes(10)
        "Show Grid": -> abercrombie.paintGrid()
        
    document.getElementById("menu")?.appendChild? imagejs.menu menu, name