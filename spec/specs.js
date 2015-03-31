(function() {
  describe("Abercrombie", function() {
    var ab, evt, x, y;
    ab = null;
    x = 100;
    y = 150;
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
    it("Defines its probe size", function() {
      return expect(ab.probeSize).toEqual(jasmine.any(Number));
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
      it("calls @ctx.strokeRect with the provided x,y and @size", function() {
        return expect(ab.ctx.strokeRect).toHaveBeenCalledWith(x, y, ab.probeSize, ab.probeSize);
      });
      return it("sets the @ctx.strokeStyle to #000000 (black)", function() {
        return expect(ab.ctx.strokeStyle).toEqual("#000000");
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
    describe(".paintGrid", function() {
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
    describe(".getNearestVertexToEvent", function() {
      var event, eventCoordinates, expectedVertex, vertex;
      vertex = null;
      eventCoordinates = [123, 80];
      expectedVertex = [100, 100];
      event = "my event";
      beforeEach(function() {
        spyOn(ab, "getEventCoordinates").and.returnValue(eventCoordinates);
        return vertex = ab.getNearestVertexToEvent(event);
      });
      it("gets the eventCoordinates from getEventCoordinates", function() {
        return expect(ab.getEventCoordinates).toHaveBeenCalledWith(event, void 0, void 0);
      });
      return it("returns the nearest vertex coordinates", function() {
        return expect(vertex).toEqual(expectedVertex);
      });
    });
    describe(".getProbeVertexOfEvent", function() {
      var event, eventCoordinates, expectedVertex, spy, vertex;
      expectedVertex = [100, 100];
      eventCoordinates = [123, 80];
      event = "my event";
      vertex = null;
      spy = null;
      beforeEach(function() {
        spyOn(ab, "getNearestVertexToEvent").and.returnValue(expectedVertex);
        return spy = spyOn(ab, "getEventCoordinates").and.returnValue(eventCoordinates);
      });
      beforeEach(function() {
        return vertex = ab.getProbeVertexOfEvent(event);
      });
      it("gets the event coordinates", function() {
        return expect(ab.getEventCoordinates).toHaveBeenCalledWith(event, void 0, void 0);
      });
      it("gets the nearest vertex", function() {
        return expect(ab.getNearestVertexToEvent).toHaveBeenCalledWith(event, void 0, void 0);
      });
      describe("for events not in probes", function() {
        it("returns null if x < probe.x", function() {
          spy.and.returnValue([99, 105]);
          vertex = ab.getProbeVertexOfEvent(event);
          return expect(vertex).toBeNull();
        });
        it("returns null if y < probe.y", function() {
          spy.and.returnValue([105, 95]);
          vertex = ab.getProbeVertexOfEvent(event);
          return expect(vertex).toBeNull();
        });
        it("returns null if x > probe.x + probeSize", function() {
          spy.and.returnValue([111, 105]);
          vertex = ab.getProbeVertexOfEvent(event);
          return expect(vertex).toBeNull();
        });
        return it("returns null if y > probe.y + probeSize", function() {
          spy.and.returnValue([105, 115]);
          vertex = ab.getProbeVertexOfEvent(event);
          return expect(vertex).toBeNull();
        });
      });
      return describe("for events in probes", function() {
        eventCoordinates = [105, 105];
        beforeEach(function() {
          return spy.and.returnValue([105, 105]);
        });
        return it("returns the nearest vertex of the nearest probe", function() {
          return expect(vertex).toEqual(expectedVertex);
        });
      });
    });
    describe(".markVertices", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        spyOn(ab, "alignCanvases");
        return ab.cvTop = {
          style: {}
        };
      });
      beforeEach(function() {
        return ab.markVertices();
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
      it("creates an empty object @markedVertices", function() {
        return expect(ab.markedVertices).toEqual(jasmine.any(Object));
      });
      return describe("click listener", function() {
        var vertex;
        vertex = [100, 100];
        beforeEach(function() {
          spyOn(ab, "getNearestVertexToEvent").and.returnValue(vertex);
          spyOn(ab, "repaintMarkedVertices");
          spyOn(ab, "toggleMarkedVertex");
          ab.ui = jasmine.createSpyObj("ui", ["updateCount"]);
          return ab.cvTop.onclick();
        });
        it("gets the nearest vertex", function() {
          return expect(ab.getNearestVertexToEvent).toHaveBeenCalled();
        });
        it("toggles the nearest vertex into/out of @markedVertices", function() {
          return expect(ab.toggleMarkedVertex).toHaveBeenCalledWith(vertex);
        });
        return it("calls repaintMarkedVertices", function() {
          return expect(ab.repaintMarkedVertices).toHaveBeenCalled();
        });
      });
    });
    describe(".paintMarkedVertice", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        return ab.ctx = jasmine.createSpyObj("ctx", ["strokeRect"]);
      });
      beforeEach(function() {
        return ab.paintMarkedVertice(x, y);
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      it("calls @ctx.strokeRect at the provided x,y and @size/4", function() {
        return expect(ab.ctx.strokeRect).toHaveBeenCalledWith(x, y, ab.probeSize, ab.probeSize);
      });
      return it("sets the @ctx.strokeStyle to #ff0000 (red)", function() {
        return expect(ab.ctx.strokeStyle).toEqual("#ff0000");
      });
    });
    describe(".repaintMarkedVertices", function() {
      var markedVertices;
      markedVertices = {
        "[100,150]": true,
        "[200,250]": true,
        "[100,250]": false
      };
      beforeEach(function() {
        spyOn(ab, "refresh");
        spyOn(ab, "paintMarkedVertice");
        spyOn(ab, "paintProbe");
        spyOn(ab, "clearProbe");
        return ab.markedVertices = markedVertices;
      });
      beforeEach(function() {
        return ab.repaintMarkedVertices();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      it("calls clearProbe with each vertex in @markedVertices", function() {
        var expectVertex, key, _i, _len, _ref;
        expectVertex = function(key) {
          var vertex;
          vertex = JSON.parse(key);
          return expect(ab.clearProbe).toHaveBeenCalledWith(vertex[0], vertex[1]);
        };
        _ref = Object.keys(markedVertices);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          expectVertex(key);
        }
        return expect(ab.clearProbe.calls.count()).toEqual(3);
      });
      it("calls paintMarkedVertice with each vertex marked true in @markedVertices", function() {
        var expectVertex, key, _i, _len, _ref;
        expectVertex = function(key) {
          var vertex;
          vertex = JSON.parse(key);
          return expect(ab.paintMarkedVertice).toHaveBeenCalledWith(vertex[0], vertex[1]);
        };
        _ref = Object.keys(markedVertices);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (markedVertices[key]) {
            expectVertex(key);
          }
        }
        return expect(ab.paintMarkedVertice.calls.count()).toEqual(2);
      });
      return it("calls paintProbe with each vertex marked false in @markedVertices", function() {
        var expectVertex, key, _i, _len, _ref;
        expectVertex = function(key) {
          var vertex;
          vertex = JSON.parse(key);
          return expect(ab.paintProbe).toHaveBeenCalledWith(vertex[0], vertex[1]);
        };
        _ref = Object.keys(markedVertices);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (!markedVertices[key]) {
            expectVertex(key);
          }
        }
        return expect(ab.paintProbe.calls.count()).toEqual(1);
      });
    });
    describe(".toggleMarkedVertex", function() {
      var markedVertices, vertex;
      vertex = [100, 150];
      markedVertices = {};
      beforeEach(function() {
        return ab.markedVertices = markedVertices;
      });
      return it("toggles the vertex in markedVertices between true and false", function() {
        ab.toggleMarkedVertex(vertex);
        expect(markedVertices).toEqual({
          "[100,150]": true
        });
        ab.toggleMarkedVertex(vertex);
        expect(markedVertices).toEqual({
          "[100,150]": false
        });
        ab.toggleMarkedVertex(vertex);
        return expect(markedVertices).toEqual({
          "[100,150]": true
        });
      });
    });
    describe(".clearProbe", function() {
      beforeEach(function() {
        spyOn(ab, "refresh");
        ab.ctx = jasmine.createSpyObj("ctx", ["clearRect"]);
        return ab.ctx.lineWidth = 1;
      });
      beforeEach(function() {
        return ab.clearProbe(x, y);
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      return it("calls @ctx.clearRect with the provided x,y and @probeSize, padded by lineWidth", function() {
        var padding;
        padding = ab.ctx.lineWidth;
        return expect(ab.ctx.clearRect).toHaveBeenCalledWith(x - padding, y - padding, ab.probeSize + 2 * padding, ab.probeSize + 2 * padding);
      });
    });
    describe(".countProbes", function() {
      var result;
      result = null;
      beforeEach(function() {
        spyOn(ab, "refresh");
        return ab.cvTop = {
          height: 1207,
          width: 1023
        };
      });
      beforeEach(function() {
        return result = ab.countProbes();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      return it("returns the integer number of probes, calculated from height, width, and size", function() {
        return expect(result).toEqual(525);
      });
    });
    return describe(".countMarkedProbes", function() {
      var markedVertices, result;
      result = null;
      markedVertices = {
        "[100,150]": true,
        "[200,250]": true,
        "[100,250]": false
      };
      beforeEach(function() {
        spyOn(ab, "refresh");
        return ab.markedVertices = markedVertices;
      });
      beforeEach(function() {
        return result = ab.countMarkedProbes();
      });
      it("calls refresh", function() {
        return expect(ab.refresh).toHaveBeenCalled();
      });
      return it("returns the number of marked probes.", function() {
        return expect(result).toEqual(2);
      });
    });
  });

}).call(this);
