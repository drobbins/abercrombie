describe "Abercrombie", ->

    ab = null

    x = 100
    y = 150
    evt =
        clientX: 25
        clientY: 25
        target:
            offsetLeft: 10
            offsetTop: 10

    beforeEach ->
        ab = new abercrombie.Abercrombie()

    it "Defines its version.", ->
        expect(ab.version).toMatch /^\d\.\d\.\d$/

    it "Defines its id.", ->
        expect(ab.id).toEqual "abercrombie"

    it "Is an Abercrombie", ->
        # abercrombie is an instanceof abercrombie.Abercrombie 
        expect(ab).toEqual jasmine.any abercrombie.Abercrombie

    it "Defines its grid size", ->
        expect(ab.size).toEqual jasmine.any Number

    it "Defines its probe size", ->
        expect(ab.probeSize).toEqual jasmine.any Number

    describe ".refresh", ->

        cvTop = getContext: -> "Context"

        beforeEach ->
            spyOn document, "getElementById"
                .and.returnValue cvTop

        beforeEach ->
            ab.refresh()

        it "Puts the current context and canvas on itself", ->
            expect(document.getElementById).toHaveBeenCalledWith "cvTop"
            expect(ab.cvTop).toBe cvTop
            expect(ab.ctx).toBe cvTop.getContext()

    describe ".alignCanvases", ->

        cvBase = offsetLeft: 26, offsetTop: 142

        beforeEach ->
            spyOn document, "getElementById"
                .and.returnValue cvBase
            spyOn ab, "refresh"
            ab.cvTop = style: {}

        beforeEach ->
            ab.alignCanvases()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "aligns @cvTop with cvBase", ->
            expect(ab.cvTop.style.left).toEqual cvBase.offsetLeft
            expect(ab.cvTop.style.top).toEqual cvBase.offsetTop

    describe ".paintProbe", ->

        beforeEach ->
            spyOn ab, "refresh"
            ab.ctx = jasmine.createSpyObj "ctx", ["strokeRect"]

        beforeEach ->
            ab.paintProbe x,y

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls @ctx.strokeRect with the provided x,y and @size", ->
            expect(ab.ctx.strokeRect).toHaveBeenCalledWith x,y,ab.probeSize,ab.probeSize

        it "sets the @ctx.strokeStyle to #000000 (black)", ->
            expect(ab.ctx.strokeStyle).toEqual "#000000"

    describe ".placeProbe", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "alignCanvases"
            ab.cvTop = style: {}

        beforeEach ->
            ab.placeProbe()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls alignCanvases", ->
            expect(ab.alignCanvases).toHaveBeenCalled()

        it "changes cvTop's cursor style to crosshair", ->
            expect(ab.cvTop.style.cursor).toBe "crosshair"

        it "listens at onclick on cvTop", ->
            expect(ab.cvTop.onclick).toEqual jasmine.any Function

        describe "click listener", ->

            beforeEach ->
                spyOn ab, "paintProbe"
                spyOn ab, "getEventCoordinates"
                    .and.returnValue [x,y]
                ab.cvTop.onclick()

            it "calls getEventCoordinates", ->
                expect(ab.getEventCoordinates).toHaveBeenCalled()

            it "calls paintProbe with the event coordinates", ->
                expect(ab.paintProbe).toHaveBeenCalledWith x,y

    describe ".getEventCoordinates", ->

        it "should pass through x and y if given", ->
            [xx,yy] = ab.getEventCoordinates evt, x, y
            expect(xx).toEqual x
            expect(yy).toEqual y

        it "calculates x and y if not given", ->
            [xx,yy] = ab.getEventCoordinates evt
            expect(xx).toEqual evt.clientX - evt.target.offsetLeft + window.pageXOffset
            expect(yy).toEqual evt.clientY - evt.target.offsetTop  + window.pageYOffset

    describe ".paintRow", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "paintProbe"
            ab.cvTop = width: 200

        beforeEach ->
            ab.paintRow y

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls paintProbe x,y with the provided y and x = [0..cvTop.width-1] by size.", ->
            for x in [0..ab.cvTop.width-1] by ab.size
                expect(ab.paintProbe).toHaveBeenCalledWith x, y

        it "returns null", ->
            expect(ab.paintRow(y)).toBeNull()

    describe ".paintGrid", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "paintRow"
            ab.cvTop = height: 200

        beforeEach ->
            ab.paintGrid()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls paintRow y with y = [0..cvTop.height-1] by size.", ->
            for y in [0..ab.cvTop.height-1] by ab.size
                expect(ab.paintRow).toHaveBeenCalledWith y

        it "returns null", ->
            expect(ab.paintGrid()).toBeNull()

    describe ".getNearestVertexToEvent", ->

        vertex = null
        eventCoordinates = [123,80]
        expectedVertex = [100,100]
        event = "my event"

        beforeEach ->
            spyOn ab, "getEventCoordinates"
                .and.returnValue eventCoordinates
            vertex = ab.getNearestVertexToEvent event

        it "gets the eventCoordinates from getEventCoordinates", ->
            expect(ab.getEventCoordinates).toHaveBeenCalledWith event, undefined, undefined

        it "returns the nearest vertex coordinates", ->
            expect(vertex).toEqual expectedVertex

    describe ".getProbeVertexOfEvent", ->
        
        expectedVertex = [100,100]
        eventCoordinates = [123,80]
        event = "my event"
        vertex = null
        spy = null

        beforeEach ->
            spyOn ab, "getNearestVertexToEvent"
                .and.returnValue expectedVertex
            spy = spyOn ab, "getEventCoordinates"
                .and.returnValue eventCoordinates

        beforeEach ->
            vertex = ab.getProbeVertexOfEvent event

        it "gets the event coordinates", ->
            expect(ab.getEventCoordinates).toHaveBeenCalledWith event, undefined, undefined

        it "gets the nearest vertex", ->
            expect(ab.getNearestVertexToEvent).toHaveBeenCalledWith event, undefined, undefined

        describe "for events not in probes", ->

            it "returns null if x < probe.x", ->
                spy.and.returnValue [99,105]
                vertex = ab.getProbeVertexOfEvent event
                expect(vertex).toBeNull()

            it "returns null if y < probe.y", ->
                spy.and.returnValue [105,95]
                vertex = ab.getProbeVertexOfEvent event
                expect(vertex).toBeNull()

            it "returns null if x > probe.x + probeSize", ->
                spy.and.returnValue [111,105]
                vertex = ab.getProbeVertexOfEvent event
                expect(vertex).toBeNull()

            it "returns null if y > probe.y + probeSize", ->
                spy.and.returnValue [105,115]
                vertex = ab.getProbeVertexOfEvent event
                expect(vertex).toBeNull()

        describe "for events in probes", ->

            eventCoordinates = [105,105]

            beforeEach ->
                spy.and.returnValue [105,105]

            it "returns the nearest vertex of the nearest probe", ->
                expect(vertex).toEqual expectedVertex

    describe ".markVertices", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "alignCanvases"
            ab.cvTop = style: {}

        beforeEach ->
            ab.markVertices()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls alignCanvases", ->
            expect(ab.alignCanvases).toHaveBeenCalled()

        it "changes cvTop's cursor style to crosshair", ->
            expect(ab.cvTop.style.cursor).toBe "crosshair"

        it "listens at onclick on cvTop", ->
            expect(ab.cvTop.onclick).toEqual jasmine.any Function

        it "creates an empty object @markedVertices", ->
            expect(ab.markedVertices).toEqual jasmine.any Object

        describe "click listener", ->

            vertex = [100,100]

            beforeEach ->
                spyOn ab, "getNearestVertexToEvent"
                    .and.returnValue vertex
                spyOn ab, "repaintMarkedVertices"
                spyOn ab, "toggleMarkedVertex"
                ab.ui = jasmine.createSpyObj "ui", ["updateCount"]
                ab.cvTop.onclick()

            it "gets the nearest vertex", ->
                expect(ab.getNearestVertexToEvent).toHaveBeenCalled()

            it "toggles the nearest vertex into/out of @markedVertices", ->
                expect(ab.toggleMarkedVertex).toHaveBeenCalledWith vertex

            it "calls repaintMarkedVertices", ->
                expect(ab.repaintMarkedVertices).toHaveBeenCalled()

    describe ".paintMarkedVertice", ->

        beforeEach ->
            spyOn ab, "refresh"
            ab.ctx = jasmine.createSpyObj "ctx", ["strokeRect"]

        beforeEach ->
            ab.paintMarkedVertice x,y

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls @ctx.strokeRect at the provided x,y and @size/4", ->
            expect(ab.ctx.strokeRect).toHaveBeenCalledWith x, y, ab.probeSize, ab.probeSize

        it "sets the @ctx.strokeStyle to #ff0000 (red)", ->
            expect(ab.ctx.strokeStyle).toEqual "#ff0000"

    describe ".repaintMarkedVertices", ->

        markedVertices = { "[100,150]": true, "[200,250]": true, "[100,250]": false}

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "paintMarkedVertice"
            spyOn ab, "paintProbe"
            spyOn ab, "clearProbe"
            ab.markedVertices = markedVertices

        beforeEach ->
            ab.repaintMarkedVertices()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls clearProbe with each vertex in @markedVertices", ->
            expectVertex = (key) ->
                vertex = JSON.parse key
                expect(ab.clearProbe).toHaveBeenCalledWith vertex[0], vertex[1]
            expectVertex key for key in Object.keys(markedVertices)
            expect(ab.clearProbe.calls.count()).toEqual 3

        it "calls paintMarkedVertice with each vertex marked true in @markedVertices", ->
            expectVertex = (key) ->
                vertex = JSON.parse key
                expect(ab.paintMarkedVertice).toHaveBeenCalledWith vertex[0], vertex[1]
            expectVertex key for key in Object.keys(markedVertices) when markedVertices[key]
            expect(ab.paintMarkedVertice.calls.count()).toEqual 2

        it "calls paintProbe with each vertex marked false in @markedVertices", ->
            expectVertex = (key) ->
                vertex = JSON.parse key
                expect(ab.paintProbe).toHaveBeenCalledWith vertex[0], vertex[1]
            expectVertex key for key in Object.keys(markedVertices) when not markedVertices[key]
            expect(ab.paintProbe.calls.count()).toEqual 1

    describe ".toggleMarkedVertex", ->

        vertex = [100, 150]
        markedVertices = {}

        beforeEach ->
            ab.markedVertices = markedVertices

        it "toggles the vertex in markedVertices between true and false", ->
            ab.toggleMarkedVertex vertex
            expect(markedVertices).toEqual { "[100,150]": true }
            ab.toggleMarkedVertex vertex
            expect(markedVertices).toEqual { "[100,150]": false }
            ab.toggleMarkedVertex vertex
            expect(markedVertices).toEqual { "[100,150]": true }

    describe ".clearProbe", ->

        beforeEach ->
            spyOn ab, "refresh"
            ab.ctx = jasmine.createSpyObj "ctx", ["clearRect"]
            ab.ctx.lineWidth = 1

        beforeEach ->
            ab.clearProbe x,y

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls @ctx.clearRect with the provided x,y and @probeSize, padded by lineWidth", ->
            padding = ab.ctx.lineWidth
            expect(ab.ctx.clearRect).toHaveBeenCalledWith x-padding,y-padding,ab.probeSize+2*padding,ab.probeSize+2*padding

    describe ".countProbes", ->

        result = null

        beforeEach ->
            spyOn ab, "refresh"
            ab.cvTop = height: 1207, width:  1023

        beforeEach ->
            result = ab.countProbes()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "returns the integer number of probes, calculated from height, width, and size", ->
            expect(result).toEqual 525

    describe ".countMarkedProbes", ->

        result = null
        markedVertices = { "[100,150]": true, "[200,250]": true, "[100,250]": false}

        beforeEach ->
            spyOn ab, "refresh"
            ab.markedVertices = markedVertices

        beforeEach ->
            result = ab.countMarkedProbes()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "returns the number of marked probes.", ->
            expect(result).toEqual 2