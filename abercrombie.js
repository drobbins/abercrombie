(function() {
  var id, menu, name, version;

  version = "0.0.1";

  id = "abercrombie";

  imagejs.msg("" + id + " version " + version + " loaded.");

  name = "Abercrombie (" + version + ")";

  menu = {
    "Start": function() {
      return imagejs.msg("You started something good.");
    }
  };

  jmat.gId("menu").appendChild(imagejs.menu(menu, name));

}).call(this);
