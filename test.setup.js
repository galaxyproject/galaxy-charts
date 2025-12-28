// test-setup.js
import { vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Default mock response
fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
});

// Reset mocks between tests
beforeEach(() => {
    fetch.mockClear();
    // Set default response
    fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(""),
    });
});
