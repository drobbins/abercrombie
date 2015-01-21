(function() {
  var abercrombie, id, menu, name, version;

  version = "0.0.1";

  id = "abercrombie";

  imagejs.msg("" + id + " version " + version + " loaded.");

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
      return ctx.strokeRect(x, y, 50, 50);
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
    }
  };

  name = "Abercrombie (" + version + ")";

  menu = {
    "Start": function() {
      return imagejs.msg("You started something good.");
    },
    "Place Probe": function() {
      return abercrombie.placeProbe();
    }
  };

  jmat.gId("menu").appendChild(imagejs.menu(menu, name));

}).call(this);
