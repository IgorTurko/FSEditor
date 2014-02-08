FSEditorSampleData = {
    fareStageList: [{
        Id: "ea08a70f-0980-41c0-a0e6-3cbfe891b158",
        Title: "Fare Stage A",
        Tags: ["Tag 1", "Tag 2"]
    }, {
        Id: "9f9e9dde-d8ab-4297-af17-1ff53e703b0f",
        Title: "Fare Stage B",
        Tags: ["Tag 2", "Tag 3"]
    }, {
        Id: "a69947b7-b809-42a1-90fc-1f68197cd3d6",
        Title: "Fare Stage C",
        Tags: ["Tag 1", "Tag 2"]
    }, {
        Id: "12be35c5-a1d9-44e4-a5c0-b60d54ced55f",
        Title: "Fare Stage D",
        Tags: ["Tag 1", "Tag 2"]
    }
    ],
    busStopList: [{
        Id: "c099306e-f3f6-46a0-9d2b-a846e599f88f",
        Title: "Bus Stop 1"
    }, {
        Id: "d165f399-e9cf-492f-b5c8-549ef1394b04",
        Title: "Bus Stop 2"
    }, {
        Id: "d099ef61-0243-4b61-8005-301674d94913",
        Title: "Bus Stop 3"
    }, {
        Id: "a5195661-5387-4b7d-9206-e71462797013",
        Title: "Bus Stop 4"
    }, {
        Id: "0cde33bf-aee8-4ddb-946e-0ebb6b4e37cc",
        Title: "Bus Stop 5"
    }]
};

function CreateSampleFSEditor() {
    var result = new FSEditor(FSEditorSampleData.fareStageList, FSEditorSampleData.busStopList);
    result.addFareStage(FSEditorSampleData.fareStageList[0].Id);
    result.addBusStopToFareStageAt(0, FSEditorSampleData.busStopList[0].Id);
    result.addBusStopToFareStageAt(0, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(0, FSEditorSampleData.busStopList[4].Id);
    result.addBusStopToFareStageAt(0, FSEditorSampleData.busStopList[2].Id);
    result.addBusStopToFareStageAt(0, FSEditorSampleData.busStopList[3].Id);

    result.addFareStage(FSEditorSampleData.fareStageList[1].Id);
    result.addBusStopToFareStageAt(1, FSEditorSampleData.busStopList[4].Id);
    result.addBusStopToFareStageAt(1, FSEditorSampleData.busStopList[2].Id);

    result.addFareStage(FSEditorSampleData.fareStageList[0].Id);

    result.addFareStage(FSEditorSampleData.fareStageList[2].Id);
    result.addBusStopToFareStageAt(3, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(3, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(3, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(3, FSEditorSampleData.busStopList[4].Id);

    result.addFareStage(FSEditorSampleData.fareStageList[2].Id);
    result.addBusStopToFareStageAt(4, FSEditorSampleData.busStopList[4].Id);
    result.addBusStopToFareStageAt(4, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(4, FSEditorSampleData.busStopList[1].Id);
    result.addBusStopToFareStageAt(4, FSEditorSampleData.busStopList[0].Id);

    result.addFareStage(FSEditorSampleData.fareStageList[3].Id);
    result.addBusStopToFareStageAt(5, FSEditorSampleData.busStopList[3].Id);

    return result;
}