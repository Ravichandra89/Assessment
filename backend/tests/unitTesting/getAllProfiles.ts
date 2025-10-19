// tests/getAllProfiles.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import profileModel from "../../src/models/user.model";
import apiResponse from "../../src/utils/apiResponse";
import { getAllProfiles } from "../../src/controllers/profile.controller";
import type { Request, Response } from "express";

// Mock apiResponse
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("getAllProfiles controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let findStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    res = {} as Partial<Response>;
    findStub = sinon.stub(profileModel, "find");
  });

  afterEach(() => {
    sinon.restore();
    vi.clearAllMocks();
  });

  it("should fetch all profiles successfully", async () => {
    const fakeProfiles = [
      { _id: "1", name: "User 1" },
      { _id: "2", name: "User 2" },
    ];

    const sortStub = { sort: sinon.stub().resolves(fakeProfiles) };
    findStub.returns(sortStub as any);

    await getAllProfiles(req as Request, res as Response);

    expect(findStub.calledOnce).toBe(true);
    expect(sortStub.sort.calledOnceWith({ createdAt: -1 })).toBe(true);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Profiles fetched successfully",
      fakeProfiles
    );
  });

  it("should handle errors and return 500", async () => {
    findStub.throws(new Error("DB failure"));

    await getAllProfiles(req as Request, res as Response);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Error fetching profiles",
      { error: "DB failure" }
    );
  });
});
