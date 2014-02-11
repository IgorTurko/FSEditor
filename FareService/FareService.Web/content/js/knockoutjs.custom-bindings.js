(function () {
    ko.bindingHandlers.shortcut = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            ko.utils.registerEventHandler(element, "keydown", function (event) {
                if (event.which < 20)
                    return;

                var shortcuts = valueAccessor();
                if (!shortcuts || !shortcuts.length)
                    return;

                var keyInfo = [];
                if (event.ctrlKey)
                    keyInfo.push("Ctrl");
                if (event.altKey)
                    keyInfo.push("Alt");
                keyInfo.push(String.fromCharCode(event.which));
                var currentShortcut = keyInfo.join("+");

                ko.utils.arrayForEach(shortcuts, function (shortcut) {

                    var handlerReturnValue;
                    var handlerFunction = shortcut["handler"];
                    if (!handlerFunction)
                        return;

                    if (shortcut["keyCombination"] == currentShortcut) {

                        try {
                            // Take all the event args, and prefix with the viewmodel
                            var argsForHandler = ko.utils.makeArray(arguments);
                            viewModel = bindingContext['$data'];
                            argsForHandler.unshift(viewModel);
                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                        } finally {
                            if (handlerReturnValue !== true) {
                                // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }

                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }

                });
            });
        },
        update: function () {

        }
    };
})();