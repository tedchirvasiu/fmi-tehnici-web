require.config({
    //Creeaza alias-uri pentru referintele externe, pentru a evita sa le referim prin cai relative de fiecare data cand avem nevoie de ele
    paths: {
        "EventDispatcher": '../common/event-dispatcher/EventDispatcher'
    }
});

requirejs([
    './Game/Game',
    "./Game/Players/Human",
    "./Game/Players/AI",
    "./Game/Players/PlayStrategies/FirstEmptyPlayStrategy",
    "./Game/Players/PlayStrategies/ExhaustivePlayStrategy"
], function (Game, Human, AI, FirstEmptyPlayStrategy, ExhaustivePlayStrategy) {

    //Detecteaza daca este Internet Explorer si ce versiune
    var internetExplorer = detectIE();
    if (internetExplorer === false || internetExplorer >= 12) {
        //Ataseaza un indicator pentru a putea fi folosit in CSS
        document.documentElement.classList.add('not-ie');
    }

    var gameNode = document.getElementById('game1');
    var game = new Game(gameNode, 3, [new AI("X"), new Human("O"), new AI("♥", new ExhaustivePlayStrategy())]);


    //Navigheaza catre pagina de prezentare a meniului contextual
    var nextBtn = document.getElementsByClassName("next-btn")[0];
    nextBtn.addEventListener("click", function () {
        window.location.href = "../context-menu/index.html";
    });
});


/**
 * Sursa: https://codepen.io/gapcode/pen/vEJNZN
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}