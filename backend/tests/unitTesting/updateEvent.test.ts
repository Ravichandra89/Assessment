// tests/updateEvent.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import eventModel from "../../src/models/event.model";
import eventLogModel from "../../src/models/eventlogs.model";
import apiResponse from "../../src/utils/apiResponse";
import { updateEvent } from "../../src/controllers/event.controller";

dayjs.extend(utc);

// Mock apiResponse
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("updateEvent controller", () => {
  let req: any;
  let res: any;
  let findByIdStub: sinon.SinonStub;
  let saveStub: sinon.SinonStub;
  let eventLogCreateStub: sinon.SinonStub;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {};
    findByIdStub = sinon.stub(eventModel, "findById");
    eventLogCreateStub = sinon.stub(eventLogModel, "create");
  });

  afterEach(() => {
    sinon.restore();
    vi.clearAllMocks();
  });

  it("should return 404 if event not found", async () => {
    findByIdStub.resolves(null);

    req.params = { eventId: "1" };

    await updateEvent(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      404,
      false,
      "Event not found"
    );
  });

  it("should update event and create a log", async () => {
    const fakeEvent = {
      _id: "1",
      title: "Old Title",
      description: "Old Description",
      toObject: function () {
        return { ...this };
      },
      save: vi.fn().mockResolvedValue(true),
    };

    findByIdStub.resolves(fakeEvent);

    req.params = { eventId: "1" };
    req.body = {
      title: "New Title",
      updatedBy: "user123",
    };

    await updateEvent(req, res);

    // Ensure event is updated
    expect(fakeEvent.title).toBe("New Title");
    expect(fakeEvent.save).toHaveBeenCalled();

    // Ensure event log is created
    expect(eventLogCreateStub.calledOnce).toBe(true);
    const logArg = eventLogCreateStub.firstCall.args[0];
    expect(logArg.before.title).toBe("Old Title");
    expect(logArg.after.title).toBe("New Title");
    expect(logArg.updatedBy).toBe("user123");

    // Ensure apiResponse is called
    expect(apiResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Event updated successfully",
      fakeEvent
    );
  });

  it("should handle errors and return 500", async () => {
    findByIdStub.throws(new Error("DB failure"));

    req.params = { eventId: "1" };

    await updateEvent(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Error updating event",
      { error: "DB failure" }
    );
  });
});
