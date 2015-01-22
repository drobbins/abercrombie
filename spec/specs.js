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
      var cvTop;
      cvTop = {
        getContext: function() {
          return "Context";
        }
      };
      beforeEach(function() {
        return spyOn(document, "getElementById").and.returnValue(cvTop);
      });
      beforeEach(function() {
        return ab.refresh();
      });
      return it("Puts the current context and canvas on itself", function() {
        expect(document.getElementById).toHaveBeenCalledWith("cvTop");
        expect(ab.cvTop).toBe(cvTop);
        return expect(ab.ctx).toBe(cvTop.getContext());
      });
    });
    describe(".alignCanvases", function() {
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
    return describe(".paintProbe", function() {
      var x, y;
      x = 10;
      y = 15;
      beforeEach(function() {
        spyOn(ab, "refresh");
        return ab.ctx = jasmine.createSpyObj("ctx", ["strokeRect"]);
      });
      beforeEach(function() {
        return ab.paintProbe(x, y);
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      return it("calls @ctx.strokeRect with the provided x,y and @size", function() {
        return expect(ab.ctx.strokeRect).toHaveBeenCalledWith(x, y, ab.size, ab.size);
      });
    });
  });

}).call(this);
