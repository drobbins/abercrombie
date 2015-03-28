(function() {
  var Abercrombie, abercrombie, menu, name, _ref;

  Abercrombie = (function() {
    function Abercrombie() {
      this.id = "abercrombie";
      this.version = "0.0.1";
      this.size = 50;
      this.Abercrombie = Abercrombie;
    }

    Abercrombie.prototype.refresh = function() {
      this.cvTop = document.getElementById("cvTop");
      return this.ctx = this.cvTop.getContext("2d");
    };

    Abercrombie.prototype.alignCanvases = function() {
      var cvBase;
      this.refresh();
      cvBase = document.getElementById("cvBase");
      this.cvTop.style.left = cvBase.offsetLeft;
      return this.cvTop.style.top = cvBase.offsetTop;
    };

    Abercrombie.prototype.getCanvas = function() {
      return document.getElementById("cvTop");
    };

    Abercrombie.prototype.getContext = function() {
      return this.getCanvas().getContext("2d");
    };

    Abercrombie.prototype.getEventCoordinates = function(evt, x, y) {
      if (!x) {
        x = evt.clientX - evt.target.offsetLeft + window.pageXOffset;
      }
      if (!y) {
        y = evt.clientY - evt.target.offsetTop + window.pageYOffset;
      }
      return [x, y];
    };

    Abercrombie.prototype.getNearestVertexToEvent = function(evt, xx, yy) {
      var vx, vy, x, y, _ref;
      _ref = this.getEventCoordinates(evt, xx, yy), x = _ref[0], y = _ref[1];
      vx = x - Math.floor(x / this.size) * this.size > (this.size / 2) ? Math.ceil(x / this.size) * this.size : Math.floor(x / this.size) * this.size;
      vy = y - Math.floor(y / this.size) * this.size > (this.size / 2) ? Math.ceil(y / this.size) * this.size : Math.floor(y / this.size) * this.size;
      return [vx, vy];
    };

    Abercrombie.prototype.markVertices = function() {
      this.refresh();
      this.alignCanvases();
      this.cvTop.style.cursor = "crosshair";
      this.markedVertices = {};
      return this.cvTop.onclick = (function(_this) {
        return function(evt, x, y) {
          var vertex;
          vertex = _this.getNearestVertexToEvent(evt, x, y);
          if (_this.markedVertices[JSON.stringify(vertex)]) {
            delete _this.markedVertices[JSON.stringify(vertex)];
          } else {
            _this.markedVertices[JSON.stringify(vertex)] = true;
          }
          return _this.repaintMarkedVertices();
        };
      })(this);
    };

    Abercrombie.prototype.paintProbe = function(x, y) {
      this.refresh();
      return this.ctx.strokeRect(x, y, this.size, this.size);
    };

    Abercrombie.prototype.placeProbe = function() {
      this.refresh();
      this.cvTop.style.cursor = "crosshair";
      this.alignCanvases();
      return this.cvTop.onclick = (function(_this) {
        return function(evt, x, y) {
          var _ref;
          _ref = _this.getEventCoordinates(evt, x, y), x = _ref[0], y = _ref[1];
          return _this.paintProbe(x, y);
        };
      })(this);
    };

    Abercrombie.prototype.paintGrid = function() {
      var y, _i, _ref, _ref1;
      this.refresh();
      for (y = _i = 0, _ref = this.cvTop.height - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; y = _i += _ref1) {
        this.paintRow(y);
      }
      return null;
    };

    Abercrombie.prototype.paintMarkedVertice = function(x, y) {
      var size;
      this.refresh();
      size = this.size / 4;
      return this.ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    };

    Abercrombie.prototype.paintRow = function(y) {
      var x, _i, _ref, _ref1;
      this.refresh();
      for (x = _i = 0, _ref = this.cvTop.width - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
        this.paintProbe(x, y);
      }
      return null;
    };

    Abercrombie.prototype.repaintMarkedVertices = function() {
      var key, vertex, _i, _len, _ref, _results;
      this.refresh();
      _ref = Object.keys(this.markedVertices);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        vertex = JSON.parse(key);
        _results.push(this.paintMarkedVertice(vertex[0], vertex[1]));
      }
      return _results;
    };

    return Abercrombie;

  })();

  abercrombie = window.abercrombie = window.ab = new Abercrombie();

  if (typeof imagejs !== "undefined" && imagejs !== null) {
    imagejs.modules[abercrombie.id] = abercrombie;
    imagejs.msg("" + abercrombie.id + " version " + abercrombie.version + " loaded.");
    name = "Abercrombie (" + abercrombie.version + ")";
    menu = {
      "Clear": function() {
        return abercrombie.getContext().clearRect(0, 0, abercrombie.getCanvas().width, abercrombie.getCanvas().height);
      },
      "Place Probe": function() {
        return abercrombie.placeProbe();
      },
      "Show Grid": function() {
        return abercrombie.paintGrid();
      },
      "Mark Vertices": function() {
        return abercrombie.markVertices();
      }
    };
    if ((_ref = document.getElementById("menu")) != null) {
      if (typeof _ref.appendChild === "function") {
        _ref.appendChild(imagejs.menu(menu, name));
      }
    }
  }

}).call(this);
