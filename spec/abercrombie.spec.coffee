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