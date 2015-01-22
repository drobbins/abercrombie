describe "Abercrombie", ->

    ab = null

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

        cvTop = ctx = null

        beforeEach ->
            cvTop = document.createElement "canvas"
            ctx = cvTop.getContext "2d"
            gId = document.getElementById
            spyOn document, "getElementById"
                .and.callFake (id) ->
                    switch id
                        when "cvTop", "cvBase" then return cvTop
                        else return gId id

        beforeEach ->
            ab.refresh()

        it "Puts the current context and canvas on itself", ->
            expect(document.getElementById).toHaveBeenCalledWith "cvTop"
            expect(ab.cvTop).toBe cvTop
            expect(ab.ctx).toBe ctx

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