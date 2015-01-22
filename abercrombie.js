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

    Abercrombie.prototype.paintProbe = function(x, y) {
      var ctx;
      ctx = this.getContext();
      return ctx.strokeRect(x, y, this.size, this.size);
    };

    Abercrombie.prototype.placeProbe = function() {
      var cv;
      cv = this.getCanvas();
      cv.style.cursor = "crosshair";
      this.alignCanvases();
      return cv.onclick = function(evt, x, y) {
        if (!x) {
          x = evt.clientX - evt.target.offsetLeft + window.pageXOffset;
        }
        if (!y) {
          y = evt.clientY - evt.target.offsetTop + window.pageYOffset;
        }
        return this.paintProbe(x, y);
      };
    };

    Abercrombie.prototype.paintGrid = function() {
      var cv, y, _i, _ref, _ref1;
      cv = this.getCanvas();
      for (y = _i = 0, _ref = cv.height - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; y = _i += _ref1) {
        this.paintRow(y);
      }
      return null;
    };

    Abercrombie.prototype.paintRow = function(y) {
      var cv, x, _i, _ref, _ref1;
      cv = this.getCanvas();
      for (x = _i = 0, _ref = cv.width - 1, _ref1 = this.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
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
