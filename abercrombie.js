(function() {
  var a, abercrombie, id, menu, name, version;

  version = "0.0.1";

  id = "abercrombie";

  imagejs.msg("" + id + " version " + version + " loaded.");

  a = {
    size: 50
  };

  abercrombie = imagejs.modules[id] = {
    alignCanvases: function() {
      var cvBase, cvTop;
      cvTop = abercrombie.getCanvas();
      cvBase = document.getElementById("cvBase");
      cvTop.style.left = cvBase.offsetLeft;
      return cvTop.style.top = cvBase.offsetTop;
    },
    getCanvas: function() {
      return document.getElementById("cvTop");
    },
    getContext: function() {
      return abercrombie.getCanvas().getContext("2d");
    },
    paintProbe: function(x, y) {
      var ctx;
      ctx = abercrombie.getContext();
      return ctx.strokeRect(x, y, a.size, a.size);
    },
    placeProbe: function() {
      var cv;
      cv = abercrombie.getCanvas();
      cv.style.cursor = "crosshair";
      abercrombie.alignCanvases();
      return cv.onclick = function(evt, x, y) {
        if (!x) {
          x = evt.clientX - evt.target.offsetLeft + window.pageXOffset;
        }
        if (!y) {
          y = evt.clientY - evt.target.offsetTop + window.pageYOffset;
        }
        return abercrombie.paintProbe(x, y);
      };
    },
    paintGrid: function() {
      var cv, y, _i, _ref, _ref1;
      cv = abercrombie.getCanvas();
      for (y = _i = 0, _ref = cv.height - 1, _ref1 = a.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; y = _i += _ref1) {
        abercrombie.paintRow(y);
      }
      return null;
    },
    paintRow: function(y) {
      var cv, x, _i, _ref, _ref1;
      cv = abercrombie.getCanvas();
      for (x = _i = 0, _ref = cv.width - 1, _ref1 = a.size; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
        abercrombie.paintProbe(x, y);
      }
      return null;
    }
  };

  window.ab = abercrombie;

  name = "Abercrombie (" + version + ")";

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

  jmat.gId("menu").appendChild(imagejs.menu(menu, name));

}).call(this);
