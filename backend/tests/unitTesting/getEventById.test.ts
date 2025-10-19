// tests/getEventById.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import eventModel from "../../src/models/event.model"; // default export
import apiResponse from "../../src/utils/apiResponse"; // default export
import { getEventById } from "../../src/controllers/event.controller";

// Mock apiResponse
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("getEventById controller", () => {
  let req: any;
  let res: any;
  let findByIdStub: sinon.SinonStub;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    findByIdStub = sinon.stub(eventModel, "findById");
  });

  afterEach(() => {
    sinon.restore();
    vi.clearAllMocks();
  });

  it("should return 404 if event not found", async () => {
    findByIdStub.returns({
      populate: sinon.stub().returns({ populate: sinon.stub().returns(null) }),
    } as any);

    req.params = { eventId: "1" };

    await getEventById(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      404,
      false,
      "Event not found"
    );
  });

  it("should fetch event and return 200", async () => {
    const fakeEvent = {
      _id: "1",
      title: "Event 1",
      profiles: [{ name: "Profile1", timezone: "UTC" }],
      createdBy: { name: "User1", timezone: "UTC" },
      startUtc: "2025-10-18T10:00:00Z",
    };

    const populateStubCreatedBy = { exec: sinon.stub().resolves(fakeEvent) };
    const populateStubProfiles = {
      populate: sinon.stub().returns(populateStubCreatedBy),
    };
    findByIdStub.returns({
      populate: sinon.stub().returns(populateStubProfiles),
    } as any);

    req.params = { eventId: "1" };

    await getEventById(req, res);

    expect(findByIdStub.calledWith("1")).toBe(true);
    expect(apiResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Event fetched successfully",
      fakeEvent
    );
  });

  it("should handle errors and return 500", async () => {
    findByIdStub.throws(new Error("DB failure"));

    req.params = { eventId: "1" };

    await getEventById(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Error fetching event",
      { error: "DB failure" }
    );
  });
});
