describe("Adding fare stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    it("work with correct fare stage", function () {
        var prevLength = fs.Service().length;

        var fareStageToAdd = tdgen.fareStageList[0];
        fs.addFareStage(fareStageToAdd.Id);

        expect(fs.Service().length).toBe(prevLength + 1);
        var actualFareStage = fs.Service()[fs.Service().length - 1];
        expect(actualFareStage).toBeDefined();
        expect(actualFareStage.Id).toBe(fareStageToAdd.Id);
        expect(actualFareStage.Stops()).toEqual([]);
    });
    it("not make a copy on adding the same fare stage twice", function () {
        var prevLength = fs.Service().length;

        var fareStageToAdd = tdgen.fareStageList[0];
        fs.addFareStage(fareStageToAdd.Id);
        fs.addBusStopToFareStageAt(0, tdgen.busStopList[1].Id);

        fs.addFareStage(fareStageToAdd.Id);

        expect(fs.Service().length).toBe(prevLength + 2);
        var actualFareStage = fs.Service()[fs.Service().length - 1];
        var actualFareStage2 = fs.Service()[fs.Service().length - 2];

        expect(actualFareStage).toBeDefined();
        expect(actualFareStage2).toBeDefined();

        expect(actualFareStage.Id).toBe(fareStageToAdd.Id);
        expect(actualFareStage.Stops().length).toEqual(1);
        expect(actualFareStage2.Stops().length).toEqual(1);

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
        var prevLength = fs.Service().length;

        fs.removeFareStageAt(2);

        expect(fs.Service().length).toBe(prevLength - 1);
        expect(fs.Service()[2].Id).toBe(tdgen.fareStageList[0].Id);
    });

    it("fail for null index", function () {
        expect(function () { fs.removeFareStageAt(null); }).toThrow();
        expect(function () { fs.removeFareStageAt(undefined); }).toThrow();
    });

    it("fail for negative index", function () {
        expect(function () { fs.removeFareStageAt(-1); }).toThrow();
    });

    it("fail for too large index", function () {
        expect(function () { fs.removeFareStageAt(fs.Service().length); }).toThrow();
    });
});

describe("Moving Up Fare Stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var first = tdgen.fareStageList[0];
    var second = tdgen.fareStageList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
    });

    it("works correctly", function () {
        fs.moveFareStageUp(1);
        expect(fs.Service().length).toBe(2);
        expect(fs.Service()[0].Id).toBe(second.Id);
        expect(fs.Service()[1].Id).toBe(first.Id);
    });

    it("fail on zero index", function () {
        expect(function () {
            fs.moveFareStageUp(0);
        }).toThrow();
    });

    it("fail on too large index", function () {
        expect(function () {
            fs.moveFareStageUp(2);
        }).toThrow();
    });

    it("fail on single Fare Stage", function () {
        expect(function () {
            fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
            fs.addFareStage(first.Id);
            fs.moveFareStageUp(0);
        }).toThrow();
    });
});

describe("Moving Down Fare Stage must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var first = tdgen.fareStageList[0];
    var second = tdgen.fareStageList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
    });

    it("works correctly", function () {
        fs.moveFareStageDown(0);
        expect(fs.Service().length).toBe(2);
        expect(fs.Service()[0].Id).toBe(second.Id);
        expect(fs.Service()[1].Id).toBe(first.Id);
    });

    it("fail on highes index", function () {
        expect(function () {
            fs.moveFareStageDown(1);
        }).toThrow();
    });

    it("fail on too large index", function () {
        expect(function () {
            fs.moveFareStageDown(2);
        }).toThrow();
    });

    it("fail on single Fare Stage", function () {
        expect(function () {
            fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
            fs.addFareStage(first.Id);
            fs.moveFareStageDown(0);
        }).toThrow();
    });
});

describe("Fare stage activation must", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var first = tdgen.fareStageList[0];
    var second = tdgen.fareStageList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
    });

    it("be performed on adding first fare stage", function () {
        fs.addFareStage(first.Id);
        expect(fs.Service().length).toBe(1);
        expect(fs.Service()[0].IsActive()).toBe(true);
        expect(fs.ActiveFareStageIndex()).toBe(0);
    });

    it("not be reset on adding fare stages", function () {
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
        fs.addFareStage(first.Id);

        expect(fs.ActiveFareStageIndex()).toBe(0);
    });

    it("works correctly", function () {
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
        fs.addFareStage(first.Id);

        fs.setActiveFareStage(2);
        expect(fs.ActiveFareStageIndex()).toBe(2);
    });

    it("activate all references of fare stage", function () {
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
        fs.addFareStage(first.Id);

        fs.setActiveFareStage(2);
        expect(fs.Service()[0].IsActive()).toBe(true);
        expect(fs.Service()[2].IsActive()).toBe(true);
    });
});

describe("Fare stage extending", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var stage1 = tdgen.fareStageList[0];
    var stage2 = tdgen.fareStageList[1];

    var stop1 = tdgen.busStopList[0];
    var stop2 = tdgen.busStopList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
    });

    it("testing must work correctly", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        expect(fs.canExtendFareStage(0)).toBe(true);
        expect(fs.canExtendFareStage(1)).toBe(false);
    });

    it("testing must fail on invalid index", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        expect(function () { fs.canExtendFareStage(-1); }).toThrow();
        expect(function () { fs.canExtendFareStage(2); }).toThrow();
    });

    it("testing must fail if next fare stage has no bus stops", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);

        expect(fs.canExtendFareStage(0)).toBe(false);
    });

    it("must works correctly", function() {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        fs.extendFareStage(0);

        expect(fs.Service()[0].Stops().length).toBe(3);
        expect(fs.Service()[1].Stops().length).toBe(1);

        expect(fs.Service()[0].Stops()[0].Id).toBe(stop1.Id);
        expect(fs.Service()[0].Stops()[1].Id).toBe(stop2.Id);
        expect(fs.Service()[0].Stops()[2].Id).toBe(stop2.Id);

        expect(fs.Service()[1].Stops()[0].Id).toBe(stop1.Id);
    });
});

describe("Fare stage collapsing", function () {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var stage1 = tdgen.fareStageList[0];
    var stage2 = tdgen.fareStageList[1];

    var stop1 = tdgen.busStopList[0];
    var stop2 = tdgen.busStopList[1];

    beforeEach(function () {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
    });

    it("testing must work correctly", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        expect(fs.canCollapseFareStage(0)).toBe(true);
        expect(fs.canCollapseFareStage(1)).toBe(false);
    });

    it("testing must fail on invalid index", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        expect(function () { fs.canCollapseFareStage(-1); }).toThrow();
        expect(function () { fs.canCollapseFareStage(2); }).toThrow();
    });

    it("testing must fail if stage has no bus stops", function () {
        fs.addFareStage(stage1.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        expect(fs.canCollapseFareStage(0)).toBe(false);
    });

    it("must works correctly", function () {
        fs.addFareStage(stage1.Id);
        fs.addBusStopToFareStageAt(0, stop1.Id);
        fs.addBusStopToFareStageAt(0, stop2.Id);

        fs.addFareStage(stage2.Id);
        fs.addBusStopToFareStageAt(1, stop2.Id);
        fs.addBusStopToFareStageAt(1, stop1.Id);

        fs.collapseFareStage(0);

        expect(fs.Service()[0].Stops().length).toBe(1);
        expect(fs.Service()[1].Stops().length).toBe(3);

        expect(fs.Service()[0].Stops()[0].Id).toBe(stop1.Id);

        expect(fs.Service()[1].Stops()[0].Id).toBe(stop2.Id);
        expect(fs.Service()[1].Stops()[1].Id).toBe(stop2.Id);
        expect(fs.Service()[1].Stops()[2].Id).toBe(stop1.Id);
    });
});