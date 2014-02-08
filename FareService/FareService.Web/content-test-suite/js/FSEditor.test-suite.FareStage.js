describe("Adding fare stage must", function() {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    it("work with correct fare stage", function() {
        var prevLength = fs.Service.length;

        var fareStageToAdd = tdgen.fareStageList[0];
        fs.addFareStage(fareStageToAdd.Id);

        expect(fs.Service.length).toBe(prevLength + 1);
        var actualFareStage = fs.Service[fs.Service.length - 1];
        expect(actualFareStage).toBeDefined();
        expect(actualFareStage.Id).toBe(fareStageToAdd.Id);
        expect(actualFareStage.Stops).toEqual([]);
    });
    it("not make a copy on adding the same fare stage twice", function() {
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

describe("Removing fare stage must", function() {
    var tdgen = FSTestData.generalSuite;
    var fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);

    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[1].Id);
    fs.addFareStage(tdgen.fareStageList[0].Id);
    fs.addFareStage(tdgen.fareStageList[1].Id);

    it("work correctly", function() {
        var prevLength = fs.Service.length;

        fs.removeFareStageAt(2);

        expect(fs.Service.length).toBe(prevLength - 1);
        expect(fs.Service[2].Id).toBe(tdgen.fareStageList[0].Id);
    });

    it("fail for null index", function() {
        expect(function() { fs.removeFareStageAt(null); }).toThrow();
        expect(function() { fs.removeFareStageAt(undefined); }).toThrow();
    });

    it("fail for negative index", function() {
        expect(function() { fs.removeFareStageAt(-1); }).toThrow();
    });

    it("fail for too large index", function() {
        expect(function() { fs.removeFareStageAt(fs.Service.length); }).toThrow();
    });
});


describe("Moving Up Fare Stage must", function() {
    var tdgen = FSTestData.generalSuite;
    var fs;
    var first = tdgen.fareStageList[0];
    var second = tdgen.fareStageList[1];

    beforeEach(function() {
        fs = new FSEditor(tdgen.fareStageList, tdgen.busStopList);
        fs.addFareStage(first.Id);
        fs.addFareStage(second.Id);
    });

    it("works correctly", function() {
        fs.moveFareStageUp(1);
        expect(fs.Service.length).toBe(2);
        expect(fs.Service[0].Id).toBe(second.Id);
        expect(fs.Service[1].Id).toBe(first.Id);
    });

    it("fail on zero index", function () {
        expect(function() {
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
        expect(fs.Service.length).toBe(2);
        expect(fs.Service[0].Id).toBe(second.Id);
        expect(fs.Service[1].Id).toBe(first.Id);
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