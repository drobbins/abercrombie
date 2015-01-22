describe "Abercrombie", ->

    it "Defines its version.", ->
        expect(abercrombie.version).toMatch /^\d\.\d\.\d$/

    it "Defines its id.", ->
        expect(abercrombie.id).toEqual "abercrombie"

    it "Is an Abercrombie", ->
        # abercrombie is an instanceof abercrombie.Abercrombie 
        expect(abercrombie).toEqual jasmine.any abercrombie.Abercrombie

    it "Defines its grid size", ->
        expect(abercrombie.size).toEqual jasmine.any Number

    describe ".refresh", ->

        ab = cvTop = ctx = null

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
            ab = new abercrombie.Abercrombie()
            ab.refresh()

        it "Puts the current context and canvas on itself", ->
            expect(document.getElementById).toHaveBeenCalledWith "cvTop"
            expect(ab.cvTop).toBe cvTop
            expect(ab.ctx).toBe ctx
