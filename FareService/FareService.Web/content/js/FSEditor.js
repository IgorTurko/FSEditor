/* Contains business logic for FSEditor class */
function FSEditor(fareStageList, busStopList) {
    ThrowIf.invalidArray(fareStageList, "Fare Stage collection is emtpy or not a collection.");
    ThrowIf.invalidArray(busStopList, "Bus Stop collection is emtpy or not a collection.");

    this.FareStageList = fareStageList;
    this.BusStopList = busStopList;

    this.Service = [];
};

function FareStageModel(fareStageEntity) {
    ThrowIf.nullOrUndefined(fareStageEntity, "Specified fare stage is not valid.");

    this.Id = fareStageEntity.Id;
    this.Stops = [];
};

function BusStopModel(busStopEntity) {
     ThrowIf.nullOrUndefined(busStopEntity, "Specified bus stop is not valid.");

    this.Id = busStopEntity.Id;
    this.Direction = FSEditor.prototype.Directions[0];
};

FSEditor.prototype.Directions = ["Inbound", "Outbound", "Inbound and Outbound"];

/// Finds fare stage with specified id.
FSEditor.prototype.findFareStage = function (fareStageId) {
    ThrowIf.nullOrUndefined(fareStageId, "Specified fare stage is not valid.");

    for (var i = 0; i < this.FareStageList.length; i++) {
        var currentFareStage = this.FareStageList[i];
        if (currentFareStage.Id === fareStageId)
            return currentFareStage;
    }
    throw "Fare Stage with Id=" + fareStageId + " is not found.";
};

FSEditor.prototype.findBusStop = function (busStopId) {
    if (!busStopId)
        throw "Specified bus stop is not valid.";

    for (var i = 0; i < this.BusStopList.length; i++) {
        var currentBusStop = this.BusStopList[i];
        if (currentBusStop.Id === busStopId)
            return currentBusStop;
    }
    throw "Bus Stop with Id=" + busStopId + " is not found.";
};

/// Adds fare stage with specified id at the end of fare stage collection.
FSEditor.prototype.addFareStage = function (fareStageId) {
    ThrowIf.nullOrUndefined(fareStageId, "fareStageId is not valid.");

    var fareStage = this.findFareStage(fareStageId);
    var model = new FareStageModel(fareStage);

    for (var i = 0; i < this.Service.length; i++) {
        var current = this.Service[i];
        if (current.Id === fareStage.Id) {
            model = current;
            break;
        }
    }

    this.Service.push(model);
};

// Removes fare stage at specified position.
FSEditor.prototype.removeFareStageAt = function (index) {
    ThrowIf.invalidArrayIndex(this.Service, index, "Index is out of range or undefined");

    this.Service.splice(index, 1);
};

// Adds Bus Stop at the end of stops of Fare Stage at specified index.
FSEditor.prototype.addBusStopToFareStageAt = function (fareStageIndex, busStopId) {
    ThrowIf.invalidArrayIndex(this.Service, fareStageIndex, "Fare Stage index is out of range or undefined");

    var fareStage = this.Service[fareStageIndex];
    var busStop = this.findBusStop(busStopId);
    var busStopModel = new BusStopModel(busStop);

    for (var i = 0; i < fareStage.Stops.length; i++) {
        var current = fareStage.Stops[i];
        if (current.Id === busStop.Id) {
            busStopModel = current;
            break;
        }
    }

    fareStage.Stops.push(busStopModel);
};

// Removes Bus Stop at specified index from Fare Stage at specified index.
FSEditor.prototype.removeBusStopFromFareStageAt = function (fareStageIndex, busStopIndex) {
    ThrowIf.invalidArrayIndex(this.Service, fareStageIndex);

    var fareStage = this.Service[fareStageIndex];

    ThrowIf.invalidArrayIndex(fareStage.Stops, busStopIndex, "Bus Stop index is out of range or undefined");

    fareStage.Stops.splice(busStopIndex, 1);
};