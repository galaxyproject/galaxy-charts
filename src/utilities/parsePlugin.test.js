import { describe, test, expect, vi } from "vitest";
import { parsePlugin } from "./parsePlugin";
import { inputTypeRegistry } from "@/schema/inputTypes";
import { useColumnsStore } from "@/store/columnsStore";

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

describe("a data_column default comes from the schema, not from a mounted input", () => {
    // Olit-saved plotly charts rendered blank: `label` is a declared `data_column` with no
    // `<value>`, so parsing left it undefined, `checkColumns` rejected the track and
    // `fetchColumns` returned []. The "auto" default existed only in InputDataColumn.vue's
    // mount path, so what a plugin received depended on whether a tab had been rendered.
    const plotlyTracks = [
        { name: "color", type: "color" },
        { name: "type", type: "select", value: "bar" },
        { name: "name", type: "text", value: "Track label" },
        { name: "label", type: "data_column", is_auto: "true" },
        { name: "x", type: "data_column", is_auto: "true" },
        { name: "y", type: "data_column", is_number: "true" },
    ];

    test("resolves to auto before any component mounts", async () => {
        const { tracks } = await parsePlugin({ tracks: plotlyTracks }, {});
        expect(tracks[0].label).toBe("auto");
        expect(tracks[0].x).toBe("auto");
    });

    test("leaves a saved column alone", async () => {
        const saved = { tracks: [{ label: "3", x: "0", y: "5" }] };
        const { tracks } = await parsePlugin({ tracks: plotlyTracks }, saved);
        expect(tracks[0]).toMatchObject({ label: "3", x: "0", y: "5" });
    });

    test("completes a track the config only partly carries", async () => {
        // Exactly what Olit wrote: name, type, x and y, with no label.
        const saved = { tracks: [{ name: "Buried", type: "lines", x: "0", y: "5" }] };
        const { tracks } = await parsePlugin({ tracks: plotlyTracks }, saved);
        expect(tracks[0].label).toBe("auto");
    });

    test("a column without is_auto gets no schema default, because picking one needs the dataset", async () => {
        const { tracks } = await parsePlugin({ tracks: plotlyTracks }, {});
        expect(tracks[0].y).toBeUndefined();
    });

    test("the parsed track satisfies checkColumns, which is unchanged", async () => {
        // The seam the blank chart crossed: parse a plugin, then ask the store whether the
        // tracks are addressable. Nothing here mounts a component.
        const { tracks } = await parsePlugin({ tracks: plotlyTracks }, { tracks: [{ y: "5" }] });
        const { checkColumns } = useColumnsStore();
        expect(checkColumns(tracks, ["label", "x", "y"])).toBe(true);
    });
});

describe("the exported registry carries the default", () => {
    test("names the fallback and the flag it requires", () => {
        const { types } = inputTypeRegistry("test");
        expect(types.data_column.fallback).toEqual({ value: "auto", requires: "is_auto" });
    });

    test("lets a consumer in another language derive the same value", () => {
        // Olit vendors this registry as JSON; it must not hard-code "auto" on its side.
        const { types } = JSON.parse(JSON.stringify(inputTypeRegistry("test")));
        const declared = { name: "label", type: "data_column", is_auto: "true" };
        const spec = types[declared.type];
        const applies = !spec.fallback.requires || String(declared[spec.fallback.requires]) === "true";
        expect(applies && spec.fallback.value).toBe("auto");
    });

    test("the fallback is a value the type says it may store", () => {
        const { types } = inputTypeRegistry("test");
        expect(types.data_column.fallback.value).toMatch(new RegExp(types.data_column.stores.pattern));
    });
});
