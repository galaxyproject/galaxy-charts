import axios from "axios";
import { getFileName } from "@/utilities/getFileName";

const parser = new DOMParser();

// populates base xml with nodes from linked macro files
async function parseMacros(xmlBaseString, xmlPath = "xml") {
    // parse base xml
    const xmlDoc = parser.parseFromString(xmlBaseString, "text/xml");

    // parse macros from base xml
    const macroFiles = [];
    const macrosNodes = xmlDoc.documentElement.getElementsByTagName("macros");
    if (macrosNodes.length > 0) {
        for (const macroNode of macrosNodes) {
            for (const element of macroNode.children) {
                macroFiles.push(element.textContent.trim());
            }
        }
    }
    console.debug(`Detected ${macroFiles.length} macro file(s) in xml.`);

    // load and collect macro entries
    const xmlEntries = {};
    for (const macroFile of macroFiles) {
        const { data } = await axios.get(`${xmlPath}/${macroFile}`);
        const xmlMacro = parser.parseFromString(data, "text/xml");
        const xmlNode = xmlMacro.documentElement.getElementsByTagName("xml");
        if (xmlNode.length > 0) {
            for (const xmlEntry of xmlNode) {
                const xmlName = xmlEntry.getAttribute("name");
                for (const entry of xmlEntry.children) {
                    xmlEntries[xmlName] = xmlEntries[xmlName] || [];
                    xmlEntries[xmlName].push(entry);
                }
            }
        }
    }
    console.debug(`Successfully collected macro files.`);

    // parse macros from base xml
    const expandNodes = xmlDoc.documentElement.getElementsByTagName("expand");
    if (expandNodes.length > 0) {
        for (const expandNode of expandNodes) {
            const expandName = expandNode.getAttribute("macro");
            if (expandName in xmlEntries) {
                const entries = xmlEntries[expandName];
                for (const entry of entries) {
                    expandNode.parentNode.appendChild(entry);
                }
                expandNode.parentNode.removeChild(expandNode);
            } else {
                console.error(`Failed to detect '${expandName}' macros source.`);
            }
        }
    }

    // returns full xml document with populated macros
    return xmlDoc;
}

// parse xml file and collect attributes
export async function parseXML(xmlFileName) {
    // build xml
    const xmlBase = await axios.get(xmlFileName);
    const xmlDoc = await parseMacros(xmlBase.data);

    // parse name
    let result = {};
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
    ["settings", "tracks"].forEach((key) => {
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
