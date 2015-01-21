# About this Module
version = "0.0.1"
id      = "abercrombie"

# Say Hello
imagejs.msg "#{id} version #{version} loaded."


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
        ctx.strokeRect x, y, 50, 50
    placeProbe: ->
        cv = abercrombie.getCanvas()
        cv.style.cursor = "crosshair"
        abercrombie.alignCanvases()
        cv.onclick = (evt,x,y) ->
            if not x then x = evt.clientX-evt.target.offsetLeft+window.pageXOffset
            if not y then y = evt.clientY-evt.target.offsetTop+window.pageYOffset
            abercrombie.paintProbe(x,y)


# Create the Menu
name = "Abercrombie (#{version})"
menu =
    "Start": -> imagejs.msg "You started something good."
    "Place Probe": -> abercrombie.placeProbe()
jmat.gId("menu").appendChild imagejs.menu menu, name