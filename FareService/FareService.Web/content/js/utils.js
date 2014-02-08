ThrowIf = {
    nullOrUndefined: function (obj, message) {
        if (obj == null || typeof obj === "undefined")
            throw message || "Specified value is not defined or null reference.";
    },
    invalidArray: function (array, message) {
        if (!array || !(array instanceof Array) || !array.length)
            throw message || "Specified object is not array.";
    },
    invalidArrayIndex: function (array, index, message) {
        ThrowIf.nullOrUndefined(array, message);
        ThrowIf.nullOrUndefined(index, message);
        if (index < 0 || index >= array.length)
            throw message || "Index is out of range or undefined";
    },
    true: function (condition, message) {
        if (condition)
            throw message || "Operation is not valid due current state.";
    },
    false: function (condition, message) {
        ThrowIf.true(!condition, message);
    }
};