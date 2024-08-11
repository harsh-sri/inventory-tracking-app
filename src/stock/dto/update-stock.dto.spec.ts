import { instanceToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuid } from "uuid";
import { UpdateStockDto } from "./update-stock.dto";

describe("UpdateStockDto", () => {
  let payload;

  beforeEach(async () => {
    payload = {
      productCount: 2,
      warehouseId: uuid(),
    };
  });

  it("should pass with valid input", async () => {
    const requestPayload = plainToClass(UpdateStockDto, payload);
    let error, result;
    try {
      result = await validate(requestPayload);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    }
  });

  describe("warehouseId", () => {
    it("should throw an error if warehouseId is not defined", async () => {
      delete payload.warehouseId;
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isDefined)).toEqual(
          "warehouseId should not be null or undefined",
        );
        expect(instanceToPlain(result[0].constraints.isUuid)).toEqual(
          "warehouseId must be a UUID",
        );
      }
    });

    it("should throw an error if warehouseId is not an uuid", async () => {
      payload.warehouseId = 1232;
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isUuid)).toEqual(
          "warehouseId must be a UUID",
        );
      }
    });
  });

  describe("productCount", () => {
    it("should throw an error if productCount is not defined", async () => {
      delete payload.productCount;
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isDefined)).toEqual(
          "productCount should not be null or undefined",
        );
      }
    });

    it("should throw an error if productCount is not integer", async () => {
      payload.productCount = "1";
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isInt)).toEqual(
          "productCount must be an integer number",
        );
      }
    });

    it("should throw an error if productCount is <= 0", async () => {
      payload.productCount = 0;
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.min)).toEqual(
          "productCount must not be less than 1",
        );
      }
    });

    it("should throw an error if productCount is greator than max limit a customer can order", async () => {
      payload.productCount = 11;
      const requestPayload = plainToClass(UpdateStockDto, payload);
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.max)).toEqual(
          "productCount must not be greater than 10",
        );
      }
    });
  });
});
