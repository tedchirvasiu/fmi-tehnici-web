//Colectie de functii utilitare.
var Util = window.Util = {
    //Verifica daca parent este unul din parintii lui element.
    hasParent: function (element, parent) {
        var currentParent = element.parentNode;
        while (currentParent != null) {
            if (currentParent === parent) {
                return true;
            }
            currentParent = currentParent.parentNode;
        }
        return false;
    }
};

if (define) {
    define([], function(){
        return Util;
    });
}