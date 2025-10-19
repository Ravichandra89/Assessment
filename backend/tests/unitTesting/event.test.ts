// tests/event.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import { Types } from "mongoose";

import { createEvent } from "../../src/controllers/event.controller";
import eventModel from "../../src/models/event.model"; // default export
import apiResponse from "../../src/utils/apiResponse"; // default export

// Mock apiResponse as default
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("createEvent controller", () => {
  let req: any;
  let res: any;
  let createStub: sinon.SinonStub;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    createStub = sinon.stub(eventModel, "create"); // stub the create method
  });

  afterEach(() => {
    sinon.restore(); // restore all stubs
    vi.clearAllMocks(); // clear Vitest mocks
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { description: "No title or dates" };

    await createEvent(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      400,
      false,
      "Missing required fields"
    );
  });

  it("should create event with correct data", async () => {
    const fakeEvent = {
      _id: new Types.ObjectId(),
      title: "Test Event",
      description: "Sample",
      startUtc: "2025-10-18T10:00:00Z",
      endUtc: "2025-10-18T12:00:00Z",
      createdBy: new Types.ObjectId(),
      timezone: "UTC",
      profiles: [],
    };

    createStub.resolves(fakeEvent);

    req.body = {
      title: "Test Event",
      description: "Sample",
      startUtc: "2025-10-18T10:00:00Z",
      endUtc: "2025-10-18T12:00:00Z",
      createdBy: fakeEvent.createdBy.toString(),
      profiles: [],
    };

    await createEvent(req, res);

    expect(createStub.calledOnce).toBe(true);
    expect(createStub.firstCall.args[0]).toMatchObject({
      title: "Test Event",
      description: "Sample",
      startUtc: "2025-10-18T10:00:00Z",
      endUtc: "2025-10-18T12:00:00Z",
      createdBy: fakeEvent.createdBy,
      profiles: [],
      timezone: "UTC",
    });

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      201,
      true,
      "Event created successfully",
      fakeEvent
    );
  });

  it("should handle errors and return 500", async () => {
    createStub.rejects(new Error("DB failure"));

    req.body = {
      title: "Test Event",
      startUtc: "2025-10-18T10:00:00Z",
      endUtc: "2025-10-18T12:00:00Z",
    };

    await createEvent(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Error creating event",
      { error: "DB failure" }
    );
  });
});
