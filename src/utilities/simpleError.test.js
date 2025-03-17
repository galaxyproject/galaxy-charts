import { describe, test, expect } from "vitest";
import { errorMessageAsString, rethrowSimple } from "./simpleError";

describe("errorMessageAsString", () => {
    test("Returns default message when input is undefined", () => {
        expect(errorMessageAsString(undefined)).toBe("Request failed.");
    });

    test("Extracts err_msg from response data", () => {
        const error = { response: { data: { err_msg: "Invalid request" } } };
        expect(errorMessageAsString(error)).toBe("Invalid request");
    });

    test("Extracts err_msg from direct data object", () => {
        const error = { data: { err_msg: "Data level error" } };
        expect(errorMessageAsString(error)).toBe("Data level error");
    });

    test("Returns status text and code if err_msg is missing", () => {
        const error = { response: { statusText: "Not Found", status: 404 } };
        expect(errorMessageAsString(error)).toBe("Not Found (404)");
    });

    test("Returns message from an Error object", () => {
        const error = new Error("Something went wrong");
        expect(errorMessageAsString(error)).toBe("Something went wrong");
    });

    test("Returns string input directly", () => {
        expect(errorMessageAsString("Custom error message")).toBe("Custom error message");
    });
});

describe("rethrowSimple", () => {
    test("Throws an error with the correct message", () => {
        expect(() => rethrowSimple("Something broke")).toThrowError("Something broke");
    });

    test("Throws an error when passed an error object", () => {
        const error = new Error("Fatal error");
        expect(() => rethrowSimple(error)).toThrowError("Fatal error");
    });

    test("Throws an error with extracted err_msg from response", () => {
        const error = { response: { data: { err_msg: "Server failure" } } };
        expect(() => rethrowSimple(error)).toThrowError("Server failure");
    });

    test("Throws an error with default message when input is empty", () => {
        expect(() => rethrowSimple(undefined)).toThrowError("Request failed.");
    });
});
