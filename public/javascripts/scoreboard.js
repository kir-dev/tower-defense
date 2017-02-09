var Scoreboard = (function () {
    var module = {};

    function compare(a,b) {
      if (a.point< b.point)
        return 1;
      if (a.point > b.point)
        return -1;
      return 0;
    }

    module.update = function(message) {
        var scoreboardText = "";
        message.sort(compare);
        message.forEach(function(user) {
            scoreboardText = scoreboardText + "<tr><td><b>"
            + user.username + "</b></td><td>"
             + user.point + " pont</td><td> "
             + user.money + " $ </td></tr>";
        });
        return scoreboardText;
    }

    return module;
})();
