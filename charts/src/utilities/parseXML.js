import { getFileName } from "@/utilities/getFileName";

export function parseXML(xmlFileName, xmlString) {
    let result = {};
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // parse name
    result.name = getFileName(xmlFileName);

    // parse title
    result.html = xmlDoc.documentElement.getAttribute("name");

    // parse logo
    result.logo = xmlDoc.documentElement.getAttribute("logo");

    // parse description
    const descriptionNode = xmlDoc.documentElement.getElementsByTagName("description");
    if (descriptionNode.length === 1) {
        result.description = descriptionNode[0].textContent.trim();
    }

    // parse specifications
    const specsNode = xmlDoc.documentElement.getElementsByTagName("specs");
    if (specsNode.length === 1) {
        result.specs = DictParser(specsNode[0]);
    }

    // parse inputs from groups and settings sections
    ["groups", "settings"].forEach((key) => {
        const xmlNode = xmlDoc.documentElement.getElementsByTagName(key);
        if (xmlNode.length === 1) {
            result[key] = new ListParser(xmlNode[0]);
        }
    });

    return result;
}

/**
 *  Converts a xml structure into an array
 */
class ListParser extends Array {
    constructor(elements) {
        super();
        for (const element of elements.children) {
            if (element.children.length > 0) {
                if (element.tagName === element.children[0].tagName) {
                    this.push(new ListParser(element));
                } else {
                    this.push(new DictParser(element));
                }
            } else if (element.textContent && element.textContent.trim()) {
                this.push(element.textContent.trim());
            }
        }
    }
}

/**
 *  Converts a xml structure into a dictionary
 */
class DictParser {
    constructor(parentElement) {
        if (parentElement.attributes.length > 0) {
            for (const attr of parentElement.attributes) {
                this[attr.name] = attr.value;
            }
        }
        for (const element of parentElement.children) {
            if (element.children.length > 0) {
                let asJson;
                if (element.tagName === element.children[0].tagName) {
                    asJson = new ListParser(element);
                } else {
                    const aDict = new DictParser(element);
                    if (element.attributes.length > 0) {
                        for (const attr of element.attributes) {
                            aDict[attr.name] = attr.value;
                        }
                    }
                    asJson = aDict;
                }
                this[element.tagName] = asJson;
            } else if (element.attributes.length > 0) {
                const attrObj = {};
                for (const attr of element.attributes) {
                    attrObj[attr.name] = attr.value;
                }
                this[element.tagName] = attrObj;
            } else {
                this[element.tagName] = element.textContent.trim();
            }
        }
    }
}
