(function() {
  describe("Abercrombie", function() {
    var ab;
    ab = null;
    beforeEach(function() {
      return ab = new abercrombie.Abercrombie();
    });
    it("Defines its version.", function() {
      return expect(ab.version).toMatch(/^\d\.\d\.\d$/);
    });
    it("Defines its id.", function() {
      return expect(ab.id).toEqual("abercrombie");
    });
    it("Is an Abercrombie", function() {
      return expect(ab).toEqual(jasmine.any(abercrombie.Abercrombie));
    });
    it("Defines its grid size", function() {
      return expect(ab.size).toEqual(jasmine.any(Number));
    });
    describe(".refresh", function() {
      var ctx, cvTop;
      cvTop = ctx = null;
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
        return ab.refresh();
      });
      return it("Puts the current context and canvas on itself", function() {
        expect(document.getElementById).toHaveBeenCalledWith("cvTop");
        expect(ab.cvTop).toBe(cvTop);
        return expect(ab.ctx).toBe(ctx);
      });
    });
    return describe(".alignCanvases", function() {
      var cvBase;
      cvBase = {
        offsetLeft: 26,
        offsetTop: 142
      };
      beforeEach(function() {
        spyOn(document, "getElementById").and.returnValue(cvBase);
        spyOn(ab, "refresh");
        return ab.cvTop = {
          style: {}
        };
      });
      beforeEach(function() {
        return ab.alignCanvases();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      return it("aligns @cvTop with cvBase", function() {
        expect(ab.cvTop.style.left).toEqual(cvBase.offsetLeft);
        return expect(ab.cvTop.style.top).toEqual(cvBase.offsetTop);
      });
    });
  });

}).call(this);
