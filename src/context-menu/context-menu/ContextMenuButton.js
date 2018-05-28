define([
    "EventDispatcher",
    "./ContextMenuItem"
], function(EventDispatcher, ContextMenuItem) {
    
    //Clasa unui buton cu iconita din meniul de context.
    var ContextMenuButton = function (text, icon, iconColor) {

        ContextMenuItem.call(this, document.createElement("div"));

        this.eventDispatcher = new EventDispatcher(null, {
            context: this
        });

        this.element.classList.add("context-menu-item");

        if (icon) {
            this.icon = document.createElement("i");
            this.icon.classList.add("icon");
            this.icon.classList.add("fa");
            this.icon.classList.add(icon);
            this.icon.style.paddingLeft = "10px";
            this.icon.style.width = "18px";
            this.icon.style.color = iconColor;

            this.element.appendChild(this.icon);

            this.textElement = document.createElement("span");
            this.textElement.style.paddingLeft = "4px";
            this.textElement.innerText = text;

            this.element.appendChild(this.icon);
            this.element.appendChild(this.textElement);
        } else {
            this.element.style.paddingLeft = "32px";
            this.element.innerText = text;
        }

        this.element.addEventListener("click", function (ev) {
            this.trigger("click", ev);
        }.bind(this));
    };
    
    //Mosteneste de la ContextMenuItem.
    var fn = ContextMenuButton.prototype = Object.create(ContextMenuItem.prototype);
    fn.constructor = ContextMenuButton;

    //Ataseaza functiile de dispecerizare a evenimentelor direct de prototipul item-ului (on, off, trigger, etc.).
    EventDispatcher.prototype.attachToObject.call(null, fn);

    return ContextMenuButton;
});