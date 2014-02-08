/* Contains set of Jasmine tests for FSEditor */

describe("FSEditor must be created", function () {
    var tdgen = FSTestData.generalSuite;

    it("with error when undefined fareStageList passed", function () {
        expect(function () {
            var _ = new FSEditor(null, tdgen.busStopList);
        }).toThrow();
    });
    it("with error when empty array passed to fareStageList", function () {
        expect(function () {
            var _ = new FSEditor([], tdgen.busStopList);
        }).toThrow();
    });
    it("with error when non-array passed to fareStageList", function () {
        expect(function () {
            var _ = new FSEditor({ a: 1, length: 10 }, tdgen.busStopList);
        }).toThrow();
    });

    it("with error when undefined busStopList passed", function () {
        expect(function () {
            var _ = new FSEditor(tdgen.fareStageList, undefined);
        }).toThrow();
    });
    it("with error when empty array passed to busStopList", function () {
        expect(function () {
            var _ = new FSEditor(tdgen.fareStageList, []);
        }).toThrow();
    });
    it("with error when non-array passed to busStopList", function () {
        expect(function () {
            var _ = new FSEditor(tdgen.fareStageList, { a: 1, length: 10 });
        }).toThrow();
    });
});

describe("FSEditor method findFareStage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    it("work correctly with existing fareStageId", function () {
        var expected = tdgen.fareStageList[0];

        var actual = fs.findFareStage(expected.Id);
        expect(actual).toBe(expected);
    });

    it("throw exception for non-existing fareStageId", function () {
        expect(function () {
            var _ = fs.findFareStage("76ada046-30c2-48f7-8e79-d555ab3e1d6c");
        }).toThrow();
    });

    it("throw exception for null or undefined fareStageId", function () {
        expect(function () {
            var _ = fs.findFareStage(null);
        }).toThrow();

        expect(function () {
            var _ = fs.findFareStage(undefined);
        }).toThrow();
    });
});

describe("FSEditor method findBusStop must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    it("work correctly with existing busStopId", function () {
        var expected = tdgen.busStopList[0];

        var actual = fs.findBusStop(expected.Id);
        expect(actual).toBe(expected);
    });

    it("throw exception for non-existing busStopId", function () {
        expect(function () {
            var _ = fs.findBusStop("39129a3b-167b-4e8b-95cc-782c3ed77856");
        }).toThrow();
    });

    it("throw exception for null or undefined busStopId", function () {
        expect(function () {
            var _ = fs.findBusStop(null);
        }).toThrow();

        expect(function () {
            var _ = fs.findBusStop(undefined);
        }).toThrow();
    });
});

describe("Adding fare stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    it("work with correct fare stage", function () {
        var prevLength = fs.Service.length;

        var fareStageToAdd = tdgen.fareStageList[0];
        fs.addFareStage(fareStageToAdd.Id);

        expect(fs.Service.length).toBe(prevLength + 1);
        var actualFareStage = fs.Service[fs.Service.length - 1];
        expect(actualFareStage).toBeDefined();
        expect(actualFareStage.Id).toBe(fareStageToAdd.Id);
        expect(actualFareStage.Stops).toEqual([]);
    });
    it("not make a copy on adding the same fare stage twice", function () {
        var prevLength = fs.Service.length;

        var fareStageToAdd = tdgen.fareStageList[0];
        fs.addFareStage(fareStageToAdd.Id);
        fs.addFareStage(fareStageToAdd.Id);

        expect(fs.Service.length).toBe(prevLength + 2);
        var actualFareStage = fs.Service[fs.Service.length - 1];
        var actualFareStage2 = fs.Service[fs.Service.length - 2];

        expect(actualFareStage).toBeDefined();
        expect(actualFareStage2).toBeDefined();

        expect(actualFareStage.Id).toBe(fareStageToAdd.Id);
        expect(actualFareStage.Stops).toEqual([]);

        expect(actualFareStage).toBe(actualFareStage2);
    });
});

describe("Removing fare stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[1].Id);
    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[1].Id);

    it("work correctly", function () {
        var prevLength = fs.Service.length;

        fs.removeFareStageAt(2);

        expect(fs.Service.length).toBe(prevLength - 1);
        expect(fs.Service[2].Id).toBe(tdgen.fareStageList[0].Id);
    });

    it("fail for null index", function () {
        expect(function () { fs.removeFareStageAt(null); }).toThrow();
        expect(function () { fs.removeFareStageAt(undefined); }).toThrow();
    });

    it("fail for negative index", function () {
        expect(function () { fs.removeFareStageAt(-1); }).toThrow();
    });

    it("fail for too large index", function () {
        expect(function () { fs.removeFareStageAt(fs.Service.length); }).toThrow();
    });
});

describe("Adding Bus Stop must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

        fs.addFareStage(tdgen.fareStageList[0].Id);
        fs.addFareStage(tdgen.fareStageList[1].Id);
        fs.addFareStage(tdgen.fareStageList[0].Id);
    });

    it("works correct on adding one Bus Stop", function () {
        var prevLength = fs.Service[2].Stops.length;

        fs.addBusStopToFareStageAt(2, tdgen.busStopList[1].Id);

        expect(fs.Service[2].Stops.length).toBe(prevLength + 1);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service[0].Stops.length).toBe(prevLength + 1);
    });

    it("work correct on adding few Bus Stops", function () {
        var prevLength = fs.Service[2].Stops.length;

        var firstBusStop = tdgen.busStopList[1];
        var secondBusStop = tdgen.busStopList[0];

        fs.addBusStopToFareStageAt(2, firstBusStop.Id);
        fs.addBusStopToFareStageAt(0, secondBusStop.Id);

        expect(fs.Service[2].Stops.length).toBe(prevLength + 2);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service[0].Stops.length).toBe(prevLength + 2);

        var fareStage = fs.Service[0];
        expect(fareStage.Stops[0].Id).toBe(firstBusStop.Id);
        expect(fareStage.Stops[0].Direction).toBe("Inbound");

        expect(fareStage.Stops[1].Id).toBe(secondBusStop.Id);
        expect(fareStage.Stops[1].Direction).toBe("Inbound");
    });

    it("not duplicate Bus Stop on adding stops with the same Id", function () {
        var prevLength = fs.Service[2].Stops.length;

        var firstBusStop = tdgen.busStopList[1];
        var secondBusStop = tdgen.busStopList[0];

        fs.addBusStopToFareStageAt(2, firstBusStop.Id);
        fs.addBusStopToFareStageAt(0, secondBusStop.Id);
        fs.addBusStopToFareStageAt(0, firstBusStop.Id);

        expect(fs.Service[2].Stops.length).toBe(prevLength + 3);
        // Also control the same instance of Fare Stage at index 0.
        expect(fs.Service[0].Stops.length).toBe(prevLength + 3);

        var fareStage = fs.Service[0];
        expect(fareStage.Stops[0]).toBe(fareStage.Stops[2]);
        expect(fareStage.Stops[0]).not.toBe(fareStage.Stops[1]);
    });

    it("fail on invalid Fare Stage index", function () {
        expect(function() {
            fs.addBusStopToFareStageAt(10, tdgen.busStopList[1].Id);
        }).toThrow();
    });
});

describe("Removing Bus Stop from Fare Stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

        fs.addFareStage(tdgen.fareStageList[0].Id);
        fs.addBusStopToFareStageAt(0, tdgen.busStopList[0].Id);
        fs.addBusStopToFareStageAt(0, tdgen.busStopList[1].Id);
        fs.addBusStopToFareStageAt(0, tdgen.busStopList[0].Id);
    });


    it("work correctly", function() {
        fs.removeBusStopFromFareStageAt();
    });
});