import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { resetCache } from "@/store/getCache";
import { flushPromises, mount } from "@vue/test-utils";
import InputDataTable from "@/components/inputs/InputDataTable.vue";

const mockGet = vi.fn();

vi.mock("@/api/client", () => ({
    GalaxyApi: () => ({
        GET: mockGet,
    }),
}));

describe("InputDataTable.vue", () => {
    const mountComponent = (props = {}) =>
        mount(InputDataTable, {
            props: {
                input: { name: "row", type: "data_table", tables: ["my_table"] },
                optional: false,
                ...props,
            },
        });

    beforeEach(() => {
        resetCache();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("loads table data on mount", async () => {
        mockGet.mockResolvedValue({
            data: {
                columns: ["name", "value"],
                fields: [
                    ["row1", "val1"],
                    ["row2", "val2"],
                ],
            },
        });
        const wrapper = mountComponent();
        await flushPromises();
        const options = wrapper.vm.currentOptions;
        expect(mockGet).toHaveBeenCalledWith("/api/tool_data/my_table");
        expect(options.length).toBe(2);
        expect(options[0].label).toBe("row1");
        expect(options[0].value.id).toBe("val1");
    });

    test("handles multiple tables", async () => {
        mockGet
            .mockResolvedValueOnce({
                data: {
                    columns: ["name", "value"],
                    fields: [["rowA", "valA"]],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    columns: ["name", "value"],
                    fields: [["rowB", "valB"]],
                },
            });
        const wrapper = mountComponent({ input: { name: "row", type: "data_table", tables: ["table1", "table2"] } });
        await flushPromises();
        const labels = wrapper.vm.currentOptions.map((o) => o.label);
        expect(labels).toContain("rowA");
        expect(labels).toContain("rowB");
        expect(mockGet).toHaveBeenCalledTimes(2);
    });

    test("returns empty options if no columns", async () => {
        mockGet.mockResolvedValue({
            data: { columns: [], fields: [] },
        });
        const wrapper = mountComponent({ input: { name: "row", type: "data_table", tables: ["my_table"] } });
        await flushPromises();
        expect(wrapper.vm.currentOptions.length).toBe(0);
    });

    test("shows selected row", async () => {
        mockGet.mockResolvedValue({
            data: {
                columns: ["name", "value"],
                fields: [["rowX", "valX"]],
            },
        });
        const wrapper = mountComponent({
            value: {
                id: "valX",
                columns: ["name", "value"],
                row: ["rowX", "valX"],
                table: "my_table",
            },
        });
        await flushPromises();
        expect(wrapper.vm.currentValue.id).toBe("valX");
        await wrapper.setProps({
            value: {
                id: "valY",
                columns: ["name", "value"],
                row: ["rowY", "valY"],
                table: "my_table",
            },
        });
        expect(wrapper.vm.currentValue.id).toBe("valY");
    });
});
