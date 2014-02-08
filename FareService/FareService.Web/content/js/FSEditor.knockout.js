// Creates knockout model for FSEditorInstance
function FSEditorViewModel(fsEditor) {
    ThrowIf.nullOrUndefined(fsEditor);
    var self = this;
    self.Editor = fsEditor;
    self.Models = new this.ModelCache(fsEditor);
    self.Directions = ko.observableArray(fsEditor.Directions);

    var modelCache = {};
    self.FareStages = ko.observableArray(ko.utils.arrayMap(fsEditor.Service, function (fareStage) {
        var model = modelCache[fareStage.Id];
        if (!model) {
            model = new self.FareStageViewModel(fareStage, self);
            modelCache[fareStage.Id] = model;
        }
        return model;
    }));

    self.removeFareStageAt = function (index) {
        index = index();
        ThrowIf.nullOrUndefined(index);

        self.Editor.removeFareStageAt(index);
        var underlyingArray = self.FareStages();
        underlyingArray.splice(index, 1);
        self.FareStages(underlyingArray);

        return false;
    };
};

// Model cache
(function() {
    FSEditorViewModel.prototype.ModelCache = function(fsEditor) {
        this.FareStages = ko.utils.arrayMap(fsEditor.FareStageList, function(elem) {
            return {
                Id: elem.Id,
                Title: ko.observable(elem.Title),
                Tags: ko.observableArray(elem.Tags)
            };
        });

        this.BusStops = ko.utils.arrayMap(fsEditor.BusStopList, function(elem) {
            return {
                Id: elem.Id,
                Title: ko.observable(elem.Title)
            };
        });

        var modelCache = {};
        this.FareStageStops = ko.observableArray(
            ko.utils.arrayGetDistinctValues(
                ko.utils.arrayMap(fsEditor.Service, function(fareStage) {
                    var model = modelCache[fareStage.Id];
                    if (!model) {
                        model = new self.FareStageViewModel(fareStage, self);
                        modelCache[fareStage.Id] = model;
                    }
                    return model;
                })));
    };

    FSEditorViewModel.prototype.ModelCache.prototype.findFareStageModel = function(fareStageId) {
        return ko.utils.arrayFirst(this.FareStages, function(elem) { return elem.Id === fareStageId; });
    };

    FSEditorViewModel.prototype.ModelCache.prototype.findBusStopModel = function(busStopId) {
        return ko.utils.arrayFirst(this.BusStops, function(elem) { return elem.Id === busStopId; });
    };

    FSEditorViewModel.prototype.ModelCache.prototype.findFareStageStopModel = function(fareStageId) {
        return ko.utils.arrayFirst(this.FareStageStops, function(elem) { return elem.Id === fareStageId; });
    };

})();

FSEditorViewModel.prototype.FareStageViewModel = function (fareStage, fsEditor) {
    ThrowIf.nullOrUndefined(fareStage);

    var self = this;
    var entityModel = fsEditor.Models.findFareStageModel(fareStage.Id);
    self.Model = entityModel;

    var modelCache = {};
    self.Stops = ko.observableArray(ko.utils.arrayMap(fareStage.Stops, function (busStop) {
        var model = modelCache[busStop.Id];
        if (!model) {
            model = new fsEditor.BusStopViewModel(busStop, self, fsEditor);
            modelCache[busStop.Id] = model;
        }
        return model;
    }));
};

FSEditorViewModel.prototype.BusStopViewModel = function (busStop, fareStage, fsEditor) {
    this.Model = fsEditor.Entities.findBusStop(busStop.Id);
    this.Direction = ko.observable(busStop.Direction);
};