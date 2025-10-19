// tests/profile.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import profileModel from "../../src/models/user.model";
import apiResponse from "../../src/utils/apiResponse";
import { createProfile } from "../../src/controllers/profile.controller";

// Mock apiResponse
vi.mock("../../src/utils/apiResponse", () => ({
  default: vi.fn(),
}));

describe("createProfile controller", () => {
  let req: any;
  let res: any;
  let saveStub: sinon.SinonStub;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    saveStub = sinon.stub(profileModel.prototype, "save");
  });

  afterEach(() => {
    sinon.restore();
    vi.clearAllMocks();
  });

  it("should return 400 if name is invalid", async () => {
    req.body = { name: "", timezone: "UTC" };

    await createProfile(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      400,
      false,
      "Invalid name provided"
    );
  });

  it("should create a profile successfully", async () => {
    const fakeProfile = new profileModel({
      name: "Test User",
      timezone: "UTC",
    });

    saveStub.resolves(fakeProfile);

    req.body = { name: "Test User", timezone: "UTC" };

    await createProfile(req, res);

    expect(saveStub.calledOnce).toBe(true);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      201,
      true,
      "Profile created successfully",
      fakeProfile
    );
  });

  it("should handle errors and return 500", async () => {
    saveStub.rejects(new Error("DB failure"));

    req.body = { name: "Test User" };

    await createProfile(req, res);

    expect(apiResponse).toHaveBeenCalledWith(
      res,
      500,
      false,
      "Internal Server Error"
    );
  });
});
