import { instanceToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ProductIdDto } from "./product-id.dto";

describe("ProductIdDto", () => {
  it("should pass", async () => {
    const object = plainToClass(ProductIdDto, {
      productId: "d99eda1d-93b2-4850-bec3-b9ed1b90cf16",
    });
    let error, result;
    try {
      result = await validate(object);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(result).toBeDefined();
      expect(result).toEqual([]);
    }
  });

  describe("productId", () => {
    it("should throw an error if productId is undefined", async () => {
      const requestPayload = plainToClass(ProductIdDto, {});
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isDefined)).toEqual(
          "productId should not be null or undefined",
        );
      }
    });

    it("should throw an error if productId is not a uuid", async () => {
      const requestPayload = plainToClass(ProductIdDto, {
        productId: "not-valid-uuid",
      });
      let error, result;
      try {
        result = await validate(requestPayload);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
        expect(result).toBeDefined();
        expect(instanceToPlain(result[0].constraints.isUuid)).toEqual(
          "productId must be a UUID",
        );
      }
    });
  });
});
