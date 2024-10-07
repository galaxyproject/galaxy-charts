import { getFileName } from "./getFileName.js";

test("identify name without extension", () => {
    expect(getFileName("name.extension")).toEqual("name");
    expect(getFileName("/sub/path/name.extension")).toEqual("name");
    expect(getFileName("http://name.extension")).toEqual("name");
    expect(getFileName("http://sub/path/name.extension")).toEqual("name");
});
