var Scoreboard = (function () {
    var module = {};

    module.update = function(message) {
        var scoreboardText = "";
        message.forEach(function(user) {
            scoreboardText = scoreboardText + "\n" 
            + user.username + ": " + user.point + " pont, " + user.money + "$";
        });
        return scoreboardText;
    }

    return module;
})();
