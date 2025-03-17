import { describe, test, expect } from "vitest";
import { parseIncoming } from "./parseIncoming";

const mockIncoming = {
    root: "/dashboard",
    visualization_config: { type: "bar", settings: {} },
    visualization_id: "12345",
    visualization_plugin: { name: "BarChart", version: "1.0.0" },
    visualization_title: "Charts Report",
};

describe("parseIncoming function", () => {
    test("Parses incoming object correctly", () => {
        const result = parseIncoming(mockIncoming);
        expect(result).toEqual({
            root: "/dashboard",
            visualizationConfig: { type: "bar", settings: {} },
            visualizationId: "12345",
            visualizationPlugin: { name: "BarChart", version: "1.0.0" },
            visualizationTitle: "Charts Report",
        });
    });

    test("Parses default values when incoming is empty", () => {
        const result = parseIncoming({});
        expect(result).toEqual({
            root: "/",
            visualizationConfig: {},
            visualizationId: null,
            visualizationPlugin: {},
            visualizationTitle: "Unnamed Visualization",
        });
    });

    test("Reads incoming data from DOM element", () => {
        document.body.innerHTML = `<div id="app" data-incoming='${JSON.stringify(mockIncoming)}'></div>`;
        const result = parseIncoming();
        expect(result).toEqual({
            root: "/dashboard",
            visualizationConfig: { type: "bar", settings: {} },
            visualizationId: "12345",
            visualizationPlugin: { name: "BarChart", version: "1.0.0" },
            visualizationTitle: "Charts Report",
        });
    });

    test("Throws an error if container element is missing", () => {
        document.body.innerHTML = "";
        expect(() => parseIncoming()).toThrow("Container element 'app' not found.");
    });

    test("Handles invalid JSON in data-incoming attribute gracefully", () => {
        document.body.innerHTML = `<div id="app" data-incoming='INVALID_JSON'></div>`;
        expect(() => parseIncoming()).toThrow(SyntaxError);
    });

    test("Uses fallback container when specified", () => {
        document.body.innerHTML = `<div id="custom-container" data-incoming='${JSON.stringify(mockIncoming)}'></div>`;
        const result = parseIncoming(undefined, "custom-container");
        expect(result.visualizationTitle).toBe("Charts Report");
    });
});
