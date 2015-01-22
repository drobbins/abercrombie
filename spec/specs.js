(function() {
  describe("Abercrombie", function() {
    var ab, evt, x, y;
    ab = null;
    x = 10;
    y = 15;
    evt = {
      clientX: 25,
      clientY: 25,
      target: {
        offsetLeft: 10,
        offsetTop: 10
      }
    };
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
    describe(".paintProbe", function() {
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
    describe(".placeProbe", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        spyOn(ab, "alignCanvases");
        return ab.cvTop = {
          style: {}
        };
      });
      beforeEach(function() {
        return ab.placeProbe();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      it("calls alignCanvases", function() {
        return expect(ab.alignCanvases).toHaveBeenCalled();
      });
      it("changes cvTop's cursor style to crosshair", function() {
        return expect(ab.cvTop.style.cursor).toBe("crosshair");
      });
      it("listens at onclick on cvTop", function() {
        return expect(ab.cvTop.onclick).toEqual(jasmine.any(Function));
      });
      return describe("click listener", function() {
        beforeEach(function() {
          spyOn(ab, "paintProbe");
          spyOn(ab, "getEventCoordinates").and.returnValue([x, y]);
          return ab.cvTop.onclick();
        });
        it("calls getEventCoordinates", function() {
          return expect(ab.getEventCoordinates).toHaveBeenCalled();
        });
        return it("calls paintProbe with the event coordinates", function() {
          return expect(ab.paintProbe).toHaveBeenCalledWith(x, y);
        });
      });
    });
    describe(".getEventCoordinates", function() {
      it("should pass through x and y if given", function() {
        var xx, yy, _ref;
        _ref = ab.getEventCoordinates(evt, x, y), xx = _ref[0], yy = _ref[1];
        expect(xx).toEqual(x);
        return expect(yy).toEqual(y);
      });
      return it("calculates x and y if not given", function() {
        var xx, yy, _ref;
        _ref = ab.getEventCoordinates(evt), xx = _ref[0], yy = _ref[1];
        expect(xx).toEqual(evt.clientX - evt.target.offsetLeft + window.pageXOffset);
        return expect(yy).toEqual(evt.clientY - evt.target.offsetTop + window.pageYOffset);
      });
    });
    describe(".paintRow", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        spyOn(ab, "paintProbe");
        return ab.cvTop = {
          width: 200
        };
      });
      beforeEach(function() {
        return ab.paintRow(y);
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      it("calls paintProbe x,y with the provided y and x = [0..cvTop.width-1] by size.", function() {
        var _i, _ref, _ref1, _results;
        _results = [];
        for (x = _i = 0, _ref = ab.cvTop.width - 1, _ref1 = ab.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
          _results.push(expect(ab.paintProbe).toHaveBeenCalledWith(x, y));
        }
        return _results;
      });
      return it("returns null", function() {
        return expect(ab.paintRow(y)).toBeNull();
      });
    });
    return describe(".paintGrid", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        spyOn(ab, "paintRow");
        return ab.cvTop = {
          height: 200
        };
      });
      beforeEach(function() {
        return ab.paintGrid();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      it("calls paintRow y with y = [0..cvTop.height-1] by size.", function() {
        var _i, _ref, _ref1, _results;
        _results = [];
        for (y = _i = 0, _ref = ab.cvTop.height - 1, _ref1 = ab.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; y = _i += _ref1) {
          _results.push(expect(ab.paintRow).toHaveBeenCalledWith(y));
        }
        return _results;
      });
      return it("returns null", function() {
        return expect(ab.paintGrid()).toBeNull();
      });
    });
  });

}).call(this);