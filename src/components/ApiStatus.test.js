import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

const mockGet = vi.fn();

vi.mock("@/api/client", () => ({
    GalaxyApi: vi.fn(() => ({
        GET: mockGet,
    })),
}));

import ApiStatus from "@/components/ApiStatus.vue";

describe("ApiStatus.vue", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("calls version API on mount", async () => {
        mockGet.mockResolvedValue({ data: { version_major: "24.1" } });

        mount(ApiStatus);
        await flushPromises();

        expect(mockGet).toHaveBeenCalledWith("/api/version");
    });

    it("shows success icon when connected to Galaxy", async () => {
        mockGet.mockResolvedValue({ data: { version_major: "24.1" } });

        const wrapper = mount(ApiStatus);
        await flushPromises();

        // Check for success icon (CheckCircleIcon has text-green-600 class)
        expect(wrapper.find(".text-green-600").exists()).toBe(true);
        expect(wrapper.find(".text-red-600").exists()).toBe(false);
    });

    it("shows error icon when Galaxy is not accessible", async () => {
        mockGet.mockRejectedValue(new Error("Connection failed"));

        const wrapper = mount(ApiStatus);
        await flushPromises();

        // Check for error icon (ExclamationCircleIcon has text-red-600 class)
        expect(wrapper.find(".text-red-600").exists()).toBe(true);
        expect(wrapper.find(".text-green-600").exists()).toBe(false);
    });
});
