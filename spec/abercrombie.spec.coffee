describe "Abercrombie", ->

    it "Defines it's version.", ->
        expect(abercrombie.version).toMatch /^\d\.\d\.\d$/

    it "Defines it's id.", ->
        expect(abercrombie.id).toEqual "abercrombie"

    it "Is an Abercrombie", ->
        # abercrombie is an instanceof abercrombie.Abercrombie 
        expect(abercrombie).toEqual jasmine.any abercrombie.Abercrombie