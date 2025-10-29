/**
 * Simple XML parser for extracting component data from XML strings
 * This is intentionally naive and inefficient to demonstrate "bad" practices
 */

export interface ParsedComponent {
  type: string;
  id?: string;
  text?: string;
  attributes?: Record<string, string>;
  children?: ParsedComponent[];
}

/**
 * Parse an XML string (assuming it's well-formed enough for our use case)
 * This is intentionally fragile and inefficient
 */
export function parseXMLString(xmlString: string): ParsedComponent[] {
  const components: ParsedComponent[] = [];

  if (!xmlString) return components;

  // First, find all complete self-closing tags (like <stop/>)
  const selfClosingRegex = /<(\w+)([^>]*)\s*\/>/g;
  let match;

  while ((match = selfClosingRegex.exec(xmlString)) !== null) {
    const tagName = match[1];
    const attributes = match[2] ?? "";

    if (!tagName) continue;

    const component: ParsedComponent = {
      type: tagName,
      id: `component-${components.length}`,
    };

    // Parse attributes
    const attrMatches = [...attributes.matchAll(/(\w+)="([^"]*)"/g)];
    if (attrMatches.length > 0) {
      component.attributes = {};
      for (const attrMatch of attrMatches) {
        if (attrMatch[1] && attrMatch[2]) {
          component.attributes[attrMatch[1]] = attrMatch[2];
        }
      }
    }

    components.push(component);
  }

  // Then, find all complete paired tags with content
  const pairedTagRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gs;
  while ((match = pairedTagRegex.exec(xmlString)) !== null) {
    const tagName = match[1];
    const attributes = match[2] ?? "";
    const content = match[3];

    if (!tagName) continue;

    const component: ParsedComponent = {
      type: tagName,
      text: content,
      id: `component-${components.length}`,
    };

    // Parse attributes
    const attrMatches = [...attributes.matchAll(/(\w+)="([^"]*)"/g)];
    if (attrMatches.length > 0) {
      component.attributes = {};
      for (const attrMatch of attrMatches) {
        if (attrMatch[1] && attrMatch[2]) {
          component.attributes[attrMatch[1]] = attrMatch[2];
        }
      }
    }

    components.push(component);
  }

  return components;
}

/**
 * Extract specific component types from parsed XML
 */
export function extractComponentsByType(
  parsed: ParsedComponent[],
  type: string,
): ParsedComponent[] {
  return parsed.filter((comp) => comp.type === type);
}

/**
 * Parse attributes into typed data
 */
export function parseAttributes(
  component: ParsedComponent,
): Record<string, string> {
  return component.attributes ?? {};
}
