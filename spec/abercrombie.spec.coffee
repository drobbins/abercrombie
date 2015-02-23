describe "Abercrombie", ->

    ab = null

    x = 10
    y = 15
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
            expect(ab.ctx.strokeRect).toHaveBeenCalledWith x,y,ab.size,ab.size



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

    describe ".getRandomLocation", ->

        location = null

        beforeEach ->
            spyOn ab, "refresh"
            ab.cvTop = 
                height: 1000
                width: 1000

        beforeEach ->
            location = ab.getRandomLocation()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "returns a random location in the image.", ->
            expect(location.x > -1).toBeTruthy()
            expect(location.y > -1).toBeTruthy()
            expect(location.x < ab.cvTop.width).toBeTruthy()
            expect(location.y < ab.cvTop.height).toBeTruthy()

    describe ".getPaddedRandomLocation", ->
        
        location = null
        cvSize = 1000

        beforeEach ->
            spyOn ab, "refresh"
            callCount = 0
            ab.cvTop = 
                height: cvSize
                width: cvSize
            spyOn Math, "random"
                .and.callFake ->
                    if callCount++ < 2 then 1.0 else 0.75

        beforeEach ->
            location = ab.getPaddedRandomLocation()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "returns a random location in the image, at least .size from the right and bottom edges", ->
            expect(Math.random.calls.count()).toEqual 4
            expect(location.x).toEqual cvSize * 0.75
            expect(location.y).toEqual cvSize * 0.75

    describe ".placeRandomProbe", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "paintProbe"
            spyOn ab, "getPaddedRandomLocation"
                .and.callThrough()
            ab.cvTop = 
                height: 1000
                width: 1000

        beforeEach ->
            ab.placeRandomProbe()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "paints a probe at a random location.", ->
            expect(ab.getPaddedRandomLocation).toHaveBeenCalled()
            expect(ab.paintProbe).toHaveBeenCalled()

    describe ".placeRandomProbes(n)", ->

        n = 15

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "placeRandomProbe"

        beforeEach ->
            ab.placeRandomProbes n

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "calls placeRandomProbe n times", ->
            expect(ab.placeRandomProbe.calls.count()).toEqual n

    describe ".placeDistinctRandomProbe", ->

        beforeEach ->
            spyOn ab, "refresh"
            spyOn ab, "paintProbe"
            ab.cvTop = 
                height: 1000
                width: 1000

        beforeEach ->
            ab.placeDistinctRandomProbe()

        it "calls refresh", ->
            expect(ab.refresh).toHaveBeenCalled()

        it "pushes a probe location onto @probes", ->
            expect(ab.probes.length).toEqual 1

    describe ".hasProbeOn(location)", ->

        includedProbe    = { x: 1, y: 1 }
        notIncludedProbe = { x: 500, y: 500 }
        overlappingProbe = { x: 30, y: 25}

        probes = [
            { x: 1, y: 1 }
            { x: 150, y: 150 }
            { x: 1, y: 150 }
            { x: 150, y: 1 }
        ]


        beforeEach ->
            ab.probes = probes

        it "returns true if @probes contains location", ->
            expect(ab.hasProbeOn includedProbe).toBeTruthy()

        it "returns false if @probes doesn't contain location", ->
            expect(ab.hasProbeOn notIncludedProbe).toBeFalsy()

        it "returns true if @probes contains a probe @size from location", ->
            expect(ab.hasProbeOn overlappingProbe).toBeTruthy()