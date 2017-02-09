var Scoreboard = (function () {
    var module = {};

    module.update = function(message) {
        var scoreboardText = "";
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
