import axios from "axios";
import { getFileName } from "@/utilities/getFileName";
import type { PluginType } from "@/types";
const parser = new DOMParser();

interface MacroEntries {
    [key: string]: Element[];
}

// Parses the base XML with macros and expands nodes
async function parseMacros(xmlBaseString: string, xmlPath: string = ""): Promise<Document> {
    const xmlDoc = parser.parseFromString(xmlBaseString, "text/xml");

    // Parse macros from base XML
    const macroFiles: string[] = [];
    const macrosNodes = xmlDoc.documentElement.getElementsByTagName("macros");
    if (macrosNodes.length > 0) {
        for (const macroNode of Array.from(macrosNodes)) {
            for (const element of Array.from(macroNode.children)) {
                macroFiles.push(element.textContent?.trim() || "");
            }
        }
    }
    console.debug(`Detected ${macroFiles.length} macro file(s) in xml.`);

    // Load and collect macro entries
    const xmlEntries: MacroEntries = {};
    for (const macroFile of macroFiles) {
        const { data } = await axios.get(`${xmlPath}${macroFile}`);
        const xmlMacro = parser.parseFromString(data, "text/xml");
        const xmlNode = xmlMacro.documentElement.getElementsByTagName("xml");
        if (xmlNode.length > 0) {
            for (const xmlEntry of Array.from(xmlNode)) {
                const xmlName = xmlEntry.getAttribute("name");
                if (xmlName) {
                    for (const entry of Array.from(xmlEntry.children)) {
                        xmlEntries[xmlName] = xmlEntries[xmlName] || [];
                        xmlEntries[xmlName].push(entry);
                    }
                }
            }
        }
    }
    console.debug(`Successfully collected macro files.`);

    // Parse macros from base XML
    const expandNodes = xmlDoc.documentElement.getElementsByTagName("expand");
    if (expandNodes.length > 0) {
        for (const expandNode of Array.from(expandNodes)) {
            const expandName = expandNode.getAttribute("macro");
            if (expandName && expandName in xmlEntries) {
                const entries = xmlEntries[expandName];
                for (const entry of entries) {
                    expandNode.parentNode?.appendChild(entry.cloneNode(true));
                }
                expandNode.parentNode?.removeChild(expandNode);
            } else {
                console.error(`Failed to detect '${expandName}' macros source.`);
            }
        }
    }

    // Returns full XML document with populated macros
    return xmlDoc;
}

// Parse XML file and collect attributes
export async function parseXML(xmlFileName: string): Promise<PluginType> {
    const xmlBase = await axios.get(xmlFileName);
    const xmlDoc = await parseMacros(xmlBase.data);

    // Parse name and logo
    const result: PluginType = { name: getFileName(xmlFileName) };
    result.html = xmlDoc.documentElement.getAttribute("name");
    result.logo = xmlDoc.documentElement.getAttribute("logo");

    // Parse description
    const descriptionNode = xmlDoc.documentElement.getElementsByTagName("description");
    if (descriptionNode.length === 1) {
        result.description = descriptionNode[0].textContent?.trim() || null;
    }

    // Parse specifications
    const specsNode = xmlDoc.documentElement.getElementsByTagName("specs");
    if (specsNode.length === 1) {
        result.specs = new DictParser(specsNode[0]);
    }

    // Parse inputs from groups and settings sections
    ["settings", "tracks"].forEach((key) => {
        const xmlNode = xmlDoc.documentElement.getElementsByTagName(key);
        if (xmlNode.length === 1) {
            (result as any)[key] = new ListParser(xmlNode[0]);
        }
    });

    return result;
}

/**
 * Converts an XML structure into an array
 */
class ListParser extends Array {
    constructor(elements: Element) {
        super();
        for (const element of Array.from(elements.children)) {
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
 * Converts an XML structure into a dictionary
 */
class DictParser {
    [key: string]: any;

    constructor(parentElement: Element) {
        if (parentElement.attributes.length > 0) {
            for (const attr of Array.from(parentElement.attributes)) {
                this[attr.name] = attr.value;
            }
        }
        for (const element of Array.from(parentElement.children)) {
            if (element.children.length > 0) {
                let asJson;
                if (element.tagName === element.children[0].tagName) {
                    asJson = new ListParser(element);
                } else {
                    const aDict = new DictParser(element);
                    for (const attr of Array.from(element.attributes)) {
                        aDict[attr.name] = attr.value;
                    }
                    asJson = aDict;
                }
                this[element.tagName] = asJson;
            } else if (element.attributes.length > 0) {
                const attrObj: { [key: string]: string } = {};
                for (const attr of Array.from(element.attributes)) {
                    attrObj[attr.name] = attr.value;
                }
                this[element.tagName] = attrObj;
            } else {
                this[element.tagName] = element.textContent?.trim() || null;
            }
        }
    }
}
