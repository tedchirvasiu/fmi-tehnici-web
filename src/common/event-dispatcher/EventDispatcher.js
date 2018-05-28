//Author: Chirvasiu Teodor
window.EventDispatcher = (function () {
    'use strict'

    var EventDispatcher = function (obj, config) {

        if (obj) {
            //Returns obj with event proxy methods attached.
            return (new init(config)).attachToObject(obj);
        } else {
            //Returns a new event dispatcher
            return new init(config);
        }
    };

    var init = function (config) {

        this.callbacks = {};        //Object: Structure { eventName: [callbacks] }; Example: { onDelete: [ function() { ... }, ... ] }
        this.anyCallbacks = [];     //Array: Callbacks triggered by any event. The first parameter must be the event name.

        if (config != null) {
            this.setContext(config.context);
        }
    };

    //Attach event proxy functions to an object to be able to make calls like "obj.on(...)", "obj.off(...)", "obj.trigger(...)" and so on.
    var attachToObject = function (obj) {

        //"this" here represents the eventDispatcher
        obj.eventDispatcher = this;

        //"this" here represents the object (obj), not the event dispatcher
        obj.trigger = function (eventName, args) {    //ES6:, ...args
            var _args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
            return this.eventDispatcher.trigger.apply(this.eventDispatcher, _args);
        };
        obj.on = function (eventName, callback) {
            return this.eventDispatcher.on(eventName, callback);
        };
        obj.off = function (eventName, callback) {
            return this.eventDispatcher.off(eventName, callback);
        };
        obj.onAny = function (callback) {
            return this.eventDispatcher.onAny(callback);
        };
        obj.offAny = function (callback) {
            return this.eventDispatcher.offAny(callback);
        };

        return obj;
    };

    //Trigger an event.
    var trigger = function (eventName, args) { //ES6:, ...args

        var evtCallbacks = this.callbacks[eventName.toLowerCase()];
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
        //https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        //"Using slice on arguments prevents optimizations in some JavaScript engines (V8 for example)"
        var _args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

        if (evtCallbacks) {
            //for (var callback of evtCallbacks) { //ES6
            var len = evtCallbacks.length
            for (var i = 0; i < len; i++) {
                var callback = evtCallbacks[i];
                //callback.apply(this, args);
                callback.apply(this.context, _args.slice(1));
            }
        }

        //for (var callback of this.anyCallbacks) { //ES6
        //  callback.call(this.context, eventName, ...args);
        //}
        var len = this.anyCallbacks.length;
        for (var i = 0; i < len; i++) {
            var callback = this.anyCallbacks[i];
            callback.apply(this.context, _args);
        }
    };

    //Subscribe a callback to an event.
    var on = function (eventName, callback) {
        var lwrEvtName = eventName.toLowerCase();

        if (!this.callbacks[lwrEvtName]) {
            this.callbacks[lwrEvtName] = [callback];
        } else {
            this.callbacks[lwrEvtName].push(callback);
        }
    };

    //Unsubscribe a callback from an event.
    var off = function (eventName, callback) {

        var lwrEvtName = eventName.toLowerCase();
        var evtCallbacks = this.callbacks[lwrEvtName];

        if (evtCallbacks) {

            var index = evtCallbacks.indexOf(callback);

            if (index !== -1) {
                evtCallbacks.splice(index, 1);

                if (evtCallbacks.length === 0) {
                    delete this.callbacks[lwrEvtName];
                }
            }
        }
    };

    //Subscribe a callback triggered by any event.
    var onAny = function (callback) {
        this.anyCallbacks.push(callback);
    };

    //Unsubscribe a callback triggered by any event.
    var offAny = function (callback) {
        var index = this.anyCallbacks.indexOf(callback);

        if (index !== -1) {
            this.anyCallbacks.splice(index, 1);
        }
    };

    //Link this event dispatcher to another. When the specified eventDispatcher fires an event, this event dispatcher will fire the same event.
    var registerTo = function (eventDispatcher) {

        //ES6
        //this.delegationFunction = (eventName, ...args) => {
        //    this.trigger(eventName, ...args);
        //};
        this.delegationFunction = function (eventName, args) {
            var _args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
            this.trigger.apply(this.context, _args);
        }.bind(this);

        eventDispatcher.onAny(this.delegationFunction);
    };

    //Unregister this event dispatcher from another event dispatcher.
    var unregisterFrom = function (eventDispatcher) {
        eventDispatcher.offAny(this.delegationFunction);
    };

    //Set the context from which the callbacks are called.
    var setContext = function (context) {
        this.context = context;
    };

    var clear = function () {

        //Clear the callbacks object
        for (var ev in this.callbacks) {
            if (this.callbacks.hasOwnProperty(ev)) {
                delete this.callbacks[ev];
            }
        }

        //Clear the anyCallbacks array
        var len = this.anyCallbacks.length;
        for (var i = 0; i < len; i++) {
            this.anyCallbacks.pop();
        }
    };

    EventDispatcher.fn = EventDispatcher.prototype = {

        constructor: EventDispatcher,
        init: init,

        attachToObject: attachToObject,
        trigger: trigger,
        on: on,
        off: off,
        onAny: onAny,
        offAny: offAny,
        registerTo: registerTo,
        unregisterFrom: unregisterFrom,

        setContext: setContext,

        clear: clear
    };

    //Give the init function the eventDispacher prototype for later instantiation
    init.prototype = EventDispatcher.fn;

    return EventDispatcher;
})();

if (define) {
    define([], function() {
        return window.EventDispatcher;
    });
}