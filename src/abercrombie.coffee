# About this Module
version = "0.0.1"
id      = "abercrombie"

# Say Hello
imagejs.msg "#{id} version #{version} loaded."


# Data
a =
    size: 50


# The magic (tm) happens here
abercrombie = imagejs.modules[id] =
    alignCanvases: ->
        cvTop = abercrombie.getCanvas()
        cvBase = document.getElementById("cvBase")
        cvTop.style.left=cvBase.offsetLeft;
        cvTop.style.top=cvBase.offsetTop;
    getCanvas: -> document.getElementById("cvTop")
    getContext: -> abercrombie.getCanvas().getContext("2d")
    paintProbe: (x,y) ->
        ctx = abercrombie.getContext()
        ctx.strokeRect x, y, a.size, a.size
    placeProbe: ->
        cv = abercrombie.getCanvas()
        cv.style.cursor = "crosshair"
        abercrombie.alignCanvases()
        cv.onclick = (evt,x,y) ->
            if not x then x = evt.clientX-evt.target.offsetLeft+window.pageXOffset
            if not y then y = evt.clientY-evt.target.offsetTop+window.pageYOffset
            abercrombie.paintProbe(x,y)
    paintGrid: ->
        cv = abercrombie.getCanvas()
        for y in [0..cv.height-1] by a.size
            abercrombie.paintRow(y)
        return null
    paintRow: (y) ->
        cv = abercrombie.getCanvas()
        for x in [0..cv.width-1] by a.size
            abercrombie.paintProbe(x,y)
        return null


window.ab = abercrombie

# Create the Menu
name = "Abercrombie (#{version})"
menu =
    "Clear": -> abercrombie.getContext().clearRect 0, 0, abercrombie.getCanvas().width, abercrombie.getCanvas().height
    "Place Probe": -> abercrombie.placeProbe()
    "Show Grid": -> abercrombie.paintGrid()
    
jmat.gId("menu").appendChild imagejs.menu menu, name