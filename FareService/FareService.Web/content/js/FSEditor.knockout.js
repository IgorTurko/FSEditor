// Creates knockout model for FSEditorInstance
function FSEditorViewModel(fsEditor) {
    ThrowIf.nullOrUndefined(fsEditor);

    this.Editor = fsEditor;

    var fareStages = [];
    var modelCache = {};
    for (var i = 0; i < fsEditor.Service.length; i++) {
        var current = fsEditor.Service[i];
        var model = modelCache[current.Id];
        if (!model) {
            var fareStageEntity = fsEditor.findFareStage(current.Id);
            model = new this.FareStageViewModel(current, fareStageEntity, this);
            modelCache[current.Id] = model;
        }
        fareStages.push(model);
    }
    this.FareStages = ko.observableArray(fareStages);


};

FSEditorViewModel.prototype.FareStageViewModel = function (fareStageLink, fareStageEntity, editorViewModel) {
    this.Id = fareStageEntity.Id;
    this.Title = fareStageEntity.Title;
    this.Tags = fareStageEntity.Tags;

    var busStops = [];
    var modelCache = {};
    for (var i = 0; i < fareStageLink.Stops.length; i++) {
        var current = fareStageLink.Stops[i];
        var model = modelCache[current.Id];
        if (!model) {
            var busStopEntity = editorViewModel.Editor.findBusStop(current.Id);
            model = new editorViewModel.BusStopViewModel(current, busStopEntity, this, editorViewModel);
            modelCache[current.Id] = model;
        }
        busStops.push(model);
    }
    this.Stops = ko.observableArray(busStops);
};

FSEditorViewModel.prototype.BusStopViewModel = function(busStopLink, busStopEntity, fareStageViewModel, editorViewModel) {
    this.Id = busStopEntity.Id;
    this.Title = busStopEntity.Title;
    this.Direction = ko.observable(busStopLink.Direction);
};