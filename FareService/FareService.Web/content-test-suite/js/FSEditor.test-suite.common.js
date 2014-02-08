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
        expect(actual.Id).toBe(expected.Id);
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
        expect(actual.Id).toBe(expected.Id);
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
