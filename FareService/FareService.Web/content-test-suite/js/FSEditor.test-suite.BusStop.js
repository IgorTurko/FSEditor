describe("Adding Bus Stop must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

        fs.addFareStage(tdgen.fareStageList[0].Id);
        fs.addFareStage(tdgen.fareStageList[1].Id);
        fs.addFareStage(tdgen.fareStageList[0].Id);
    });

    it("works correctly on adding one Bus Stop", function () {
        var prevLength = fs.Service()[2].Stops.length;

        fs.addBusStopToFareStageAt(2, tdgen.busStopList[1].Id);

        expect(fs.Service()[2].Stops().length).toBe(prevLength + 1);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service()[0].Stops().length).toBe(prevLength + 1);
    });

    it("work correctly on adding few Bus Stops", function () {
        var prevLength = fs.Service()[2].Stops.length;

        var firstBusStop = tdgen.busStopList[1];
        var secondBusStop = tdgen.busStopList[0];

        fs.addBusStopToFareStageAt(2, firstBusStop.Id);
        fs.addBusStopToFareStageAt(0, secondBusStop.Id);

        expect(fs.Service()[2].Stops().length).toBe(prevLength + 2);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service()[0].Stops().length).toBe(prevLength + 2);

        var fareStage = fs.Service()[0];
        expect(fareStage.Stops()[0].Id).toBe(firstBusStop.Id);
        expect(fareStage.Stops()[0].Direction()).toBe("Inbound");

        expect(fareStage.Stops()[1].Id).toBe(secondBusStop.Id);
        expect(fareStage.Stops()[1].Direction()).toBe("Inbound");
    });

    it("not duplicate Bus Stop on adding stops with the same Id", function () {
        var prevLength = fs.Service()[2].Stops().length;

        var firstBusStop = tdgen.busStopList[1];
        var secondBusStop = tdgen.busStopList[0];

        fs.addBusStopToFareStageAt(2, firstBusStop.Id);
        fs.addBusStopToFareStageAt(0, secondBusStop.Id);
        fs.addBusStopToFareStageAt(0, firstBusStop.Id);

        expect(fs.Service()[2].Stops().length).toBe(prevLength + 3);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service()[0].Stops().length).toBe(prevLength + 3);

        var fareStage = fs.Service()[0];
        expect(fareStage.Stops()[0]).toBe(fareStage.Stops()[2]);
        expect(fareStage.Stops()[0]).not.toBe(fareStage.Stops()[1]);
    });

    it("fail on invalid Fare Stage index", function () {
        expect(function () {
            fs.addBusStopToFareStageAt(10, tdgen.busStopList[1].Id);
        }).toThrow();
    });
});

describe("Removing Bus Stop from Fare Stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var firstStop = tdgen.busStopList[0];
    var secondStop = tdgen.busStopList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

        fs.addFareStage(tdgen.fareStageList[0].Id);
        fs.addBusStopToFareStageAt(0, firstStop.Id);
        fs.addBusStopToFareStageAt(0, secondStop.Id);
        fs.addBusStopToFareStageAt(0, firstStop.Id);
    });

    it("work correctly", function () {
        fs.removeBusStopFromFareStageAt(0, 1);
        expect(fs.Service()[0].Stops().length).toBe(2);
        expect(fs.Service()[0].Stops()[0].Id).toBe(firstStop.Id);
        expect(fs.Service()[0].Stops()[1].Id).toBe(firstStop.Id);
    });

    it("throw on incorrect Fare Stage index", function () {
        expect(function () {
            fs.removeBusStopFromFareStageAt(1, 1);
        }).toThrow();
    });

    it("throw on incorrect Bus Stop index", function () {
        expect(function () {
            fs.removeBusStopFromFareStageAt(0, 5);
        }).toThrow();
    });
});