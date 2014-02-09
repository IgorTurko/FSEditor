/* Contains business logic for FSEditor class */
function FSEditor(fareStageList, busStopList) {
    ThrowIf.invalidArray(fareStageList, "Fare Stage collection is emtpy or not a collection.");
    ThrowIf.invalidArray(busStopList, "Bus Stop collection is emtpy or not a collection.");

    this.FareStageList = ko.observableArray(ko.utils.arrayMap(fareStageList, function (entity) {
        return {
            Id: entity.Id,
            Title: ko.observable(entity.Title),
            Tags: ko.observableArray(entity.Tags)
        };
    }));
    this.BusStopList = ko.observableArray(ko.utils.arrayMap(busStopList, function (entity) {
        return {
            Id: entity.Id,
            Title: ko.observable(entity.Title)
        };
    }));

    this.Service = ko.observableArray([]);
};

// Constructors and internal methods.
(function () {
    FSEditor.prototype.FareStageModel = function (fareStageEntity) {
        ThrowIf.nullOrUndefined(fareStageEntity, "Specified fare stage is not valid.");
        this.FareStage = fareStageEntity;
        this.Id = fareStageEntity.Id;
        this.Stops = ko.observableArray([]);
    };

    FSEditor.prototype.BusStopModel = function (busStopEntity) {
        ThrowIf.nullOrUndefined(busStopEntity, "Specified bus stop is not valid.");

        this.BusStop = busStopEntity;
        this.Id = busStopEntity.Id;
        this.Direction = ko.observable(FSEditor.prototype.Directions[0]);
    };

    FSEditor.prototype.Directions = ["Inbound", "Outbound", "Inbound and Outbound"];

    FSEditor.prototype.findFareStage = function (fareStageId) {
        ThrowIf.nullOrUndefined(fareStageId, "Specified fare stage is not valid.");

        for (var i = 0; i < this.FareStageList().length; i++) {
            var currentFareStage = this.FareStageList()[i];
            if (currentFareStage.Id === fareStageId)
                return currentFareStage;
        }
        throw "Fare Stage with Id=" + fareStageId + " is not found.";
    };

    FSEditor.prototype.findBusStop = function (busStopId) {
        if (!busStopId)
            throw "Specified bus stop is not valid.";

        for (var i = 0; i < this.BusStopList().length; i++) {
            var currentBusStop = this.BusStopList()[i];
            if (currentBusStop.Id === busStopId)
                return currentBusStop;
        }
        throw "Bus Stop with Id=" + busStopId + " is not found.";
    };

})();

// Fare stage methods
(function () {
    // Adds fare stage with specified id at the end of fare stage collection.
    FSEditor.prototype.addFareStage = function (fareStageId) {
        ThrowIf.nullOrUndefined(fareStageId, "fareStageId is not valid.");

        var fareStage = this.findFareStage(fareStageId);
        var model = new this.FareStageModel(fareStage);

        var list = this.Service();
        for (var i = 0; i < list.length; i++) {
            var current = list[i];
            if (current.Id === fareStage.Id) {
                model = current;
                break;
            }
        }

        this.Service.push(model);
    };

    // Removes fare stage at specified position.
    FSEditor.prototype.removeFareStageAt = function (index) {
        ThrowIf.invalidArrayIndex(this.Service(), index, "Index is out of range or undefined");

        this.Service.splice(index, 1);
    };

    // Returns true if fare stage at specified index could be moved one position up.
    FSEditor.prototype.canMoveFareStageUp = function (fareStageIndex) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex, "Fare Stage index is not valid.");
        return fareStageIndex > 0;
    };

    // Moves fare stage at specified index to one position up.
    FSEditor.prototype.moveFareStageUp = function (fareStageIndex) {
        ThrowIf.false(this.canMoveFareStageUp(fareStageIndex), "Fare stage can't be moved.");

        var elemToMove = this.Service()[fareStageIndex];
        this.Service.splice(fareStageIndex, 1);
        this.Service.splice(fareStageIndex - 1, 0, elemToMove);
    };

    // Returns true if fare stage at specified index could be moved one position down.
    FSEditor.prototype.canMoveFareStageDown = function (fareStageIndex) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex, "Fare Stage index is not valid.");
        return this.Service().length > 1 && fareStageIndex < this.Service().length - 1;
    };

    // Moves fare stage at specified index to one position down.
    FSEditor.prototype.moveFareStageDown = function (fareStageIndex) {
        ThrowIf.false(this.canMoveFareStageDown(fareStageIndex), "Fare stage can't be moved.");

        var elemToMove = this.Service()[fareStageIndex];
        this.Service.splice(fareStageIndex, 1);
        this.Service.splice(fareStageIndex + 1, 0, elemToMove);
    };
})();

// Bus stop methods
(function () {
    // Adds Bus Stop at the end of stops of Fare Stage at specified index.
    FSEditor.prototype.addBusStopToFareStageAt = function (fareStageIndex, busStopId) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex, "Fare Stage index is out of range or undefined");

        var fareStage = this.Service()[fareStageIndex];
        var busStop = this.findBusStop(busStopId);
        var busStopModel = new this.BusStopModel(busStop);

        var list = fareStage.Stops();
        for (var i = 0; i < list.length; i++) {
            var current = list[i];
            if (current.Id === busStop.Id) {
                busStopModel = current;
                break;
            }
        }
        fareStage.Stops.push(busStopModel);
    };

    // Removes Bus Stop at specified index from Fare Stage at specified index.
    FSEditor.prototype.removeBusStopFromFareStageAt = function (fareStageIndex, busStopIndex) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex);

        var fareStage = this.Service()[fareStageIndex];

        ThrowIf.invalidArrayIndex(fareStage.Stops(), busStopIndex, "Bus Stop index is out of range or undefined");

        fareStage.Stops.splice(busStopIndex, 1);
    };

    FSEditor.prototype.canMoveBusStopUp = function (fareStageIndex, busStopIndex) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex, "Fare Stage index is not valid.");
        var fareStage = this.Service()[fareStageIndex];
        ThrowIf.invalidArrayIndex(fareStage.Stops(), busStopIndex, "Bus Stop index is not valid.");
        return busStopIndex > 0;
    };

    FSEditor.prototype.canMoveBusStopDown = function (fareStageIndex, busStopIndex) {
        ThrowIf.invalidArrayIndex(this.Service(), fareStageIndex, "Fare Stage index is not valid.");
        var fareStage = this.Service()[fareStageIndex];
        ThrowIf.invalidArrayIndex(fareStage.Stops(), busStopIndex, "Bus Stop index is not valid.");
        return fareStage.Stops().length > 1 && busStopIndex < fareStage.Stops().length - 1;
    };

    FSEditor.prototype.moveBusStopUp = function (fareStageIndex, busStopIndex) {
        ThrowIf.false(this.canMoveBusStopUp(fareStageIndex, busStopIndex), "Bus stop cannot be moved up.");

        var fareStage = this.Service()[fareStageIndex];

        var elemToMove = fareStage.Stops()[busStopIndex];

        fareStage.Stops.splice(busStopIndex, 1);
        fareStage.Stops.splice(busStopIndex - 1, 0, elemToMove);
    };

    FSEditor.prototype.moveBusStopDown = function(fareStageIndex, busStopIndex) {
        ThrowIf.false(this.canMoveBusStopDown(fareStageIndex, busStopIndex));

        var fareStage = this.Service()[fareStageIndex];
        var elemToMove = fareStage.Stops()[busStopIndex];
        fareStage.Stops.splice(busStopIndex, 1);
        fareStage.Stops.splice(busStopIndex + 1, 0, elemToMove);
    };
})();