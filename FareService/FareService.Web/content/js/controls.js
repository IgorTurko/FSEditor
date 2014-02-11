controls = {
    init: function() {
        controls.autocomplete.init();
    },
    autocomplete: {
        init: function () {
            //ko.bindingHandlers.ko_autocomplete = {
            //    init: function (element, params) {
            //        $(element).autocomplete(params());
            //    },
            //    update: function (element, params) {
            //        $(element).autocomplete("option", "source", params().source);
            //    }
            //};
            //$("[data-control='autocomplete'").autocomplete({
            //    source: availableTags,
            //    minLength: 0
            //}).bind('focus', function () { $(this).autocomplete("search"); });
        }
    }
};