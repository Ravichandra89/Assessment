// tests/getAllEvents.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import eventModel from "../../src/models/event.model";
import apiResponse from "../../src/utils/apiResponse";
import { getAllEvents } from "../../src/controllers/event.controller";

// Mock apiResponse
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("getAllEvents controller", () => {
  let req: any;
  let res: any;
  let findStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    res = {};
    findStub = sinon.stub(eventModel, "find");
  });

  afterEach(() => {
    sinon.restore();
    vi.clearAllMocks();
  });

  it("should fetch all events and return 200", async () => {
    const fakeEvents = [
      {
        _id: "1",
        title: "Event 1",
        profiles: [{ name: "Profile1", timezone: "UTC" }],
        createdBy: { name: "User1", timezone: "UTC" },
        startUtc: "2025-10-18T10:00:00Z",
      },
      {
        _id: "2",
        title: "Event 2",
        profiles: [{ name: "Profile2", timezone: "UTC" }],
        createdBy: { name: "User2", timezone: "UTC" },
        startUtc: "2025-10-19T10:00:00Z",
      },
    ];

    // Setup stub chain for populate and sort
    const populateStubProfiles = {
      populate: sinon.stub().returnsThis(),
      sort: sinon.stub().resolves(fakeEvents),
    };
    findStub.returns(populateStubProfiles as any);
    populateStubProfiles.populate
      .withArgs("profiles", "name timezone")
      .returns(populateStubProfiles);
    populateStubProfiles.populate
      .withArgs("createdBy", "name timezone")
      .returns(populateStubProfiles);

    await getAllEvents(req, res);

    expect(findStub.calledOnce).toBe(true);
    expect(apiResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Events fetched successfully",
      fakeEvents
    );
  });

  it("should handle errors and return 500", async () => {
    findStub.throws(new Error("DB failure"));

    await getAllEvents(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Error fetching events",
      { error: "DB failure" }
    );
  });
});
