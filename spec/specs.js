(function() {
  describe("Abercrombie", function() {
    it("Defines it's version.", function() {
      return expect(abercrombie.version).toMatch(/^\d\.\d\.\d$/);
    });
    it("Defines it's id.", function() {
      return expect(abercrombie.id).toEqual("abercrombie");
    });
    return it("Is an Abercrombie", function() {
      return expect(abercrombie).toEqual(jasmine.any(abercrombie.Abercrombie));
    });
  });

}).call(this);
