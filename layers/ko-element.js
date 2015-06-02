var ko = window.ko;

ko.bindingHandlers.element = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      element.appendChild(value);
    }
};