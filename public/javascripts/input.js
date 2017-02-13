var Input = (function () {
    var module = {};

    module.initialize = function (socket) {
        var canvas = document.getElementById('playcanvas');
        canvas.addEventListener('click', function(event) {
            var x = event.pageX - canvas.offsetLeft,
                y = event.pageY - canvas.offsetTop;
            socket.emit('action', decideClick(x), decideClick(y));
        });
    }

    function decideClick (coord) {
        var worldCoord = coord / 64 + 0.5;
        return Math.round(worldCoord);
    }

    return module;
})();
