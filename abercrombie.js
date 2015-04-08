(function() {
  var Abercrombie, abercrombie, menu, name, _ref;

  Abercrombie = (function() {
    function Abercrombie() {
      this.id = "abercrombie";
      this.version = "0.0.1";
      this.size = 50;
      this.probeSize = 10;
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

    Abercrombie.prototype.clear = function() {
      return this.getContext().clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    };

    Abercrombie.prototype.clearProbe = function(x, y) {
      var padding;
      this.refresh();
      padding = this.ctx.lineWidth;
      return this.ctx.clearRect(x - padding, y - padding, this.probeSize + 2 * padding, this.probeSize + 2 * padding);
    };

    Abercrombie.prototype.countProbes = function() {
      var numberOfProbes;
      this.refresh();
      return numberOfProbes = Math.ceil(this.cvTop.width / this.size) * Math.ceil(this.cvTop.height / this.size);
    };

    Abercrombie.prototype.countMarkedProbes = function() {
      var numberOfMarkedProbes;
      this.refresh();
      return numberOfMarkedProbes = (Object.keys(this.markedVertices).filter((function(_this) {
        return function(key) {
          return _this.markedVertices[key];
        };
      })(this))).length;
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

    Abercrombie.prototype.getProbeVertexOfEvent = function(evt, xx, yy) {
      var ex, ey, vx, vy, _ref, _ref1;
      _ref = this.getEventCoordinates(evt, xx, yy), ex = _ref[0], ey = _ref[1];
      _ref1 = this.getNearestVertexToEvent(evt, xx, yy), vx = _ref1[0], vy = _ref1[1];
      if (((vx < ex && ex < vx + this.probeSize)) && ((vy < ey && ey < vy + this.probeSize))) {
        return [vx, vy];
      } else {
        return null;
      }
    };

    Abercrombie.prototype.markVertices = function() {
      this.refresh();
      this.alignCanvases();
      this.cvTop.style.cursor = "crosshair";
      this.markedVertices = {};
      this.cvTop.onclick = (function(_this) {
        return function(evt, x, y) {
          var vertex;
          vertex = _this.getNearestVertexToEvent(evt, x, y);
          _this.toggleMarkedVertex(vertex);
          _this.repaintMarkedVertices();
          return _this.ui.updateCount();
        };
      })(this);
      return this.cvTop.mousedown = (function(_this) {
        return function(evt, x, y) {
          return _this.start = _this.getEventCoordinates(evt, x, y);
        };
      })(this);
    };

    Abercrombie.prototype.paintProbe = function(x, y) {
      this.refresh();
      this.ctx.strokeStyle = "#000000";
      return this.ctx.strokeRect(x, y, this.probeSize, this.probeSize);
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
      this.refresh();
      this.ctx.strokeStyle = "#ff0000";
      return this.ctx.strokeRect(x, y, this.probeSize, this.probeSize);
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
        this.clearProbe(vertex[0], vertex[1]);
        if (this.markedVertices[key]) {
          _results.push(this.paintMarkedVertice(vertex[0], vertex[1]));
        } else {
          _results.push(this.paintProbe(vertex[0], vertex[1]));
        }
      }
      return _results;
    };

    Abercrombie.prototype.toggleMarkedVertex = function(vertex) {
      var key;
      key = JSON.stringify(vertex);
      if (!this.markedVertices[key]) {
        return this.markedVertices[key] = true;
      } else {
        return this.markedVertices[key] = false;
      }
    };

    Abercrombie.prototype.ui = {
      start: function() {
        this.msg = document.getElementById("msg");
        this.msg.innerText = "Click probes to toggle selection. ";
        this.countFragment = document.createElement("span");
        this.formFragment = this.buildFormFragment();
        this.msg.appendChild(this.formFragment);
        this.msg.appendChild(this.countFragment);
        return document.querySelector("#sizeForm").onchange = (function(_this) {
          return function() {
            return _this.updateGrid();
          };
        })(this);
      },
      updateCount: function() {
        var numberOfMarkedProbes, numberOfProbes, percentMarked;
        numberOfProbes = abercrombie.countProbes();
        numberOfMarkedProbes = abercrombie.countMarkedProbes();
        percentMarked = (numberOfMarkedProbes / numberOfProbes * 100).toPrecision(4);
        return this.countFragment.innerText = "" + numberOfMarkedProbes + " of " + numberOfProbes + " probes marked (" + percentMarked + "%).";
      },
      buildFormFragment: function() {
        var fragment;
        fragment = document.createElement("form");
        fragment.id = "sizeForm";
        fragment.style.display = "inline";
        fragment.innerHTML = "<label for=\"size\">Grid Size:<input name=\"size\" size=\"1\" value=\"" + abercrombie.size + "\"/></label> <label for=\"probeSize\">Probe Size:<input name=\"probeSize\" size=\"1\" value=\"" + abercrombie.probeSize + "\"/></label> <span> </span>";
        return fragment;
      },
      updateGrid: function() {
        abercrombie.markedVertices = {};
        abercrombie.clear();
        abercrombie.size = parseInt(document.querySelector("[name=\"size\"]").value, 10);
        abercrombie.probeSize = parseInt(document.querySelector("[name=\"probeSize\"]").value, 10);
        abercrombie.paintGrid();
        return abercrombie.markVertices();
      }
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
        return abercrombie.clear();
      },
      "Show Grid": function() {
        return abercrombie.paintGrid();
      },
      "Mark Vertices": function() {
        return abercrombie.markVertices();
      },
      "Start": function() {
        abercrombie.ui.start();
        abercrombie.paintGrid();
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
