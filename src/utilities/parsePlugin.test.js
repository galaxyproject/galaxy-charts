import { describe, test, expect, vi } from "vitest";
import { parsePlugin } from "./parsePlugin";

const mockPlugin = {
    settings: [
        { name: "opacity", type: "float", value: "0.5" },
        { name: "visible", type: "boolean", value: "true" },
    ],
    specs: { version: "1.0.0" },
    tracks: [
        { name: "speed", type: "float", value: "1.2" },
        { name: "enabled", type: "boolean", value: "false" },
    ],
};

const mockConfig = {
    settings: {
        opacity: "0.5",
        visible: "true",
    },
    tracks: [{ speed: "15" }, { speed: "5", enabled: "true" }],
};

describe("parsePlugin function", () => {
    test("Parses plugin settings and tracks correctly", async () => {
        const result = await parsePlugin(mockPlugin, mockConfig);
        expect(result.settings).toEqual({
            opacity: 0.5,
            visible: true,
        });
        expect(result.tracks).toEqual([
            { speed: 15, enabled: false },
            { speed: 5, enabled: true },
        ]);
    });

    test("Handles empty settings and tracks gracefully", async () => {
        const emptyPlugin = { settings: [], specs: {}, tracks: [] };
        const result = await parsePlugin(emptyPlugin, {});
        expect(result).toEqual({ plugin: emptyPlugin, settings: {}, specs: {}, tracks: [{}], transcripts: [] });
    });

    test("Handles missing config settings by using defaults", async () => {
        const partialConfig = { settings: { opacity: "0.1", visible: "false" } };
        const result = await parsePlugin(mockPlugin, partialConfig);
        expect(result.settings).toEqual({ opacity: 0.1, visible: false });
    });

    test("Handles missing specs field correctly", async () => {
        const noSpecsPlugin = { ...mockPlugin, specs: undefined };
        const result = await parsePlugin(noSpecsPlugin, mockConfig);
        expect(result.specs).toBeUndefined();
    });

    test("Formats boolean and float values correctly", async () => {
        const testPlugin = {
            settings: [
                { name: "threshold", type: "float", value: "10.2" },
                { name: "isEnabled", type: "boolean", value: "false" },
            ],
            tracks: [],
        };
        const result = await parsePlugin(testPlugin, {});
        expect(result.settings).toEqual({ threshold: 10.2, isEnabled: false });
    });

    test("Parses conditional settings correctly", async () => {
        const conditionalPlugin = {
            settings: [
                {
                    name: "mode",
                    type: "conditional",
                    test_param: { name: "modeType", value: "advanced" },
                    cases: [{ value: "advanced", inputs: [{ name: "advancedSetting", type: "float", value: "2.5" }] }],
                },
            ],
            tracks: [],
        };
        const result = await parsePlugin(conditionalPlugin, {});
        expect(result.settings).toEqual({ mode: { modeType: "advanced", advancedSetting: 2.5 } });
    });

    test("Logs error if conditional test parameter has no name", async () => {
        const consoleSpy = vi.spyOn(console, "error");
        const badPlugin = {
            settings: [
                {
                    name: "mode",
                    type: "conditional",
                    test_param: {},
                    cases: [{ value: "advanced", inputs: [{ name: "advancedSetting", type: "float", value: "2.5" }] }],
                },
            ],
            tracks: [],
        };
        await parsePlugin(badPlugin, {});
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Test parameter has no name"));
        consoleSpy.mockRestore();
    });

    test("Formats integer values correctly", async () => {
        const testPlugin = {
            settings: [{ name: "maxItems", type: "integer", value: "10" }],
            tracks: [],
        };
        const result = await parsePlugin(testPlugin, {});
        expect(result.settings).toEqual({ maxItems: 10 });
    });
});
