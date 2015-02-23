(function() {
  var Abercrombie, abercrombie, menu, name, _ref;

  Abercrombie = (function() {
    function Abercrombie() {
      this.id = "abercrombie";
      this.version = "0.0.1";
      this.size = 50;
      this.Abercrombie = Abercrombie;
      this.probes = [];
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

    Abercrombie.prototype.getRandomLocation = function() {
      this.refresh();
      return {
        x: this.cvTop.width * Math.random(),
        y: this.cvTop.height * Math.random()
      };
    };

    Abercrombie.prototype.getPaddedRandomLocation = function() {
      var location, tooCloseToEdge;
      this.refresh();
      tooCloseToEdge = (function(_this) {
        return function(location) {
          return location.x > _this.cvTop.width - _this.size || location.y > _this.cvTop.height - _this.size;
        };
      })(this);
      location = this.getRandomLocation();
      while (tooCloseToEdge(location)) {
        location = this.getRandomLocation();
      }
      return location;
    };

    Abercrombie.prototype.hasProbeOn = function(location) {
      var probe, value, _i, _len, _ref, _ref1, _ref2;
      value = false;
      _ref = this.probes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        probe = _ref[_i];
        if (((probe.x - this.size <= (_ref1 = location.x) && _ref1 <= probe.x + this.size)) && ((probe.y - this.size <= (_ref2 = location.y) && _ref2 <= probe.y + this.size))) {
          value = true;
          break;
        }
      }
      return value;
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

    Abercrombie.prototype.placeRandomProbe = function() {
      var location;
      this.refresh();
      location = this.getPaddedRandomLocation();
      return this.paintProbe(location.x, location.y);
    };

    Abercrombie.prototype.placeDistinctRandomProbe = function() {
      var location;
      this.refresh();
      location = this.getPaddedRandomLocation();
      while (this.hasProbeOn(location)) {
        location = this.getPaddedRandomLocation();
      }
      this.probes.push(location);
      return this.paintProbe(location.x, location.y);
    };

    Abercrombie.prototype.placeRandomProbes = function(count) {
      var n, _i, _results;
      this.refresh();
      _results = [];
      for (n = _i = 1; 1 <= count ? _i <= count : _i >= count; n = 1 <= count ? ++_i : --_i) {
        _results.push(this.placeRandomProbe());
      }
      return _results;
    };

    Abercrombie.prototype.placeDistinctRandomProbes = function(count) {
      var n, _i, _results;
      this.refresh();
      _results = [];
      for (n = _i = 1; 1 <= count ? _i <= count : _i >= count; n = 1 <= count ? ++_i : --_i) {
        _results.push(this.placeDistinctRandomProbe());
      }
      return _results;
    };

    Abercrombie.prototype.paintGrid = function() {
      var y, _i, _ref, _ref1;
      this.refresh();
      for (y = _i = 0, _ref = this.cvTop.height - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; y = _i += _ref1) {
        this.paintRow(y);
      }
      return null;
    };

    Abercrombie.prototype.paintRow = function(y) {
      var x, _i, _ref, _ref1;
      this.refresh();
      for (x = _i = 0, _ref = this.cvTop.width - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
        this.paintProbe(x, y);
      }
      return null;
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
      "Place Random Probe": function() {
        return abercrombie.placeRandomProbe();
      },
      "Place 10 Random Probes": function() {
        return abercrombie.placeRandomProbes(10);
      },
      "Place 10 Distinct Random Probes": function() {
        return abercrombie.placeDistinctRandomProbes(10);
      },
      "Show Grid": function() {
        return abercrombie.paintGrid();
      }
    };
    if ((_ref = document.getElementById("menu")) != null) {
      if (typeof _ref.appendChild === "function") {
        _ref.appendChild(imagejs.menu(menu, name));
      }
    }
  }

}).call(this);
