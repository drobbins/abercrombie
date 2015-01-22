(function() {
  describe("Abercrombie", function() {
    it("Defines its version.", function() {
      return expect(abercrombie.version).toMatch(/^\d\.\d\.\d$/);
    });
    it("Defines its id.", function() {
      return expect(abercrombie.id).toEqual("abercrombie");
    });
    it("Is an Abercrombie", function() {
      return expect(abercrombie).toEqual(jasmine.any(abercrombie.Abercrombie));
    });
    it("Defines its grid size", function() {
      return expect(abercrombie.size).toEqual(jasmine.any(Number));
    });
    return describe(".refresh", function() {
      var ab, ctx, cvTop;
      ab = cvTop = ctx = null;
      beforeEach(function() {
        var gId;
        cvTop = document.createElement("canvas");
        ctx = cvTop.getContext("2d");
        gId = document.getElementById;
        return spyOn(document, "getElementById").and.callFake(function(id) {
          switch (id) {
            case "cvTop":
            case "cvBase":
              return cvTop;
            default:
              return gId(id);
          }
        });
      });
      beforeEach(function() {
        ab = new abercrombie.Abercrombie();
        return ab.refresh();
      });
      return it("Puts the current context and canvas on itself", function() {
        expect(document.getElementById).toHaveBeenCalledWith("cvTop");
        expect(ab.cvTop).toBe(cvTop);
        return expect(ab.ctx).toBe(ctx);
      });
    });
  });

}).call(this);
