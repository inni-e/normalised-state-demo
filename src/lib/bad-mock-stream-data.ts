/**
 * Bad implementation: Mock stream data as raw XML strings
 * This demonstrates parsing UI components from XML tags in a continuously appended string
 */

/**
 * Helper to split text into small streaming chunks
 */
function splitTextIntoChunks(text: string, chunkSize = 100): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Generate plain text chunks (no XML wrapping for messages)
 */
function createMessageText(text: string): string[] {
  return splitTextIntoChunks(text, 15);
}

/**
 * Generate XML stream chunks for an artifact - tags stream character by character
 */
function createArtifactXML(text: string, language = "markdown"): string[] {
  const chunks: string[] = [];

  // Stream opening tag
  const openingTag = `<artifact language="${language}">`;
  chunks.push(...openingTag.split(""));

  // Stream content in chunks
  const contentChunks = splitTextIntoChunks(text, 20);
  chunks.push(...contentChunks);

  // Stream closing tag
  const closingTag = "</artifact>";
  chunks.push(...closingTag.split(""));

  return chunks;
}

/**
 * Generate XML stream chunks for reasoning text - tags stream character by character
 */
function createReasoningXML(text: string): string[] {
  const chunks: string[] = [];
  const openingTag = "<reasoning>";
  const closingTag = "</reasoning>";

  // Stream opening tag
  chunks.push(...openingTag.split(""));

  // Stream content
  chunks.push(text);

  // Stream closing tag
  chunks.push(...closingTag.split(""));

  return chunks;
}

/**
 * Generate XML stream chunks for function call - self-closing tag streams character by character
 */
function createFunctionCallXML(
  name: string,
  args: string,
  callId: string,
): string[] {
  const tag = `<function_call name="${name}" arguments="${args}" call_id="${callId}" status="executing"/>`;
  return tag.split(""); // Stream character by character
}

/**
 * Generate XML stream chunks for web search - tags stream character by character
 */
function createWebSearchXML(
  query: string,
  sources: Array<{ title: string; url: string }>,
): string[] {
  const chunks: string[] = [];

  const sourcesXML = sources
    .map((s) => `<source title="${s.title}" url="${s.url}"/>`)
    .join("");

  const openingTag = `<web_search query="${query}">`;
  const closingTag = "</web_search>";

  // Stream opening tag
  chunks.push(...openingTag.split(""));

  // Stream sources
  chunks.push(sourcesXML);

  // Stream closing tag
  chunks.push(...closingTag.split(""));

  return chunks;
}

/**
 * Generate XML stream chunks for staff report rule - tags stream character by character
 */
function createStaffReportRuleXML(
  sectionName: string,
  ruleText: string,
): string[] {
  const chunks: string[] = [];
  const openingTag = `<staff_report_rule section_name="${sectionName}">`;
  const closingTag = "</staff_report_rule>";

  // Stream opening tag
  chunks.push(...openingTag.split(""));

  // Stream content
  chunks.push(ruleText);

  // Stream closing tag
  chunks.push(...closingTag.split(""));

  return chunks;
}

/**
 * Generate XML stream chunks for clarification questions - tags stream character by character
 */
function createClarificationXML(questions: string[]): string[] {
  const chunks: string[] = [];
  const openingTag = "<clarification>";
  const closingTag = "</clarification>";

  // Stream opening tag
  chunks.push(...openingTag.split(""));

  // Stream questions
  for (const question of questions) {
    chunks.push(`<question>${question}</question>`);
  }

  // Stream closing tag
  chunks.push(...closingTag.split(""));

  return chunks;
}

/**
 * Mock stream scenarios as XML strings
 */
export const BAD_MOCK_STREAM_SCENARIOS = {
  /**
   * Scenario 1: Zoning and Permits Inquiry
   */
  zoningPermits: (): string[] => [
    ...createReasoningXML("Let me analyze your request"),
    ...createReasoningXML("and search the relevant documents."),
    ...createFunctionCallXML(
      "search_documents",
      '{"query": "zoning regulations residential", "limit": 15}',
      "call_zoning_1",
    ),
    ...createWebSearchXML(
      "What are the current residential zoning requirements?",
      [
        {
          title: "Municipal Code - Zoning Ordinance",
          url: "https://example.com/zoning-ordinance",
        },
        {
          title: "City Planning Department Guidelines",
          url: "https://example.com/planning-guidelines",
        },
      ],
    ),
    ...createStaffReportRuleXML("Zoning", "Found Zoning section in database"),
    ...createStaffReportRuleXML(
      "Regulations",
      "Found Regulations section in database",
    ),
    ...createStaffReportRuleXML(
      "Zoning Regulations",
      "R-1 zones require minimum lot size of 5,000 sq ft",
    ),
    ...createStaffReportRuleXML(
      "Zoning Regulations",
      "Maximum coverage: 40% of lot area",
    ),
    ...createStaffReportRuleXML("Setbacks", "Front setback: 20 feet minimum"),
    ...createStaffReportRuleXML("Setbacks", "Side setbacks: 10 feet minimum"),
    ...createStaffReportRuleXML(
      "Building Permits",
      "Required for structures over 120 sq ft",
    ),
    ...createMessageText(
      "Based on my analysis of the city documents, I found several key regulations that apply to your situation.",
    ),
    ...createMessageText(
      "The zoning ordinance requires specific setbacks and height restrictions. Here's what you need to know:",
    ),
    ...createArtifactXML(`# Zoning Requirements Summary

## Residential Zones (R-1)
- Minimum lot size: 5,000 sq ft
- Maximum coverage: 40%
- Front setback: 20 feet
- Side setback: 10 feet
- Rear setback: 15 feet

## Building Heights
- Maximum height: 35 feet
- Exception for architectural features: +5 feet

## Parking Requirements
- Single family: 2 spaces minimum
- Multi-family: 1.5 spaces per unit

For more details, please refer to the municipal code Section 17.20.`),
    ...createClarificationXML([
      "What specific property address are you inquiring about?",
      "Are you planning new construction or modifications?",
      "Do you need permit application assistance?",
    ]),
    `<stop/>`,
  ],

  /**
   * Scenario 2: Code Enforcement Investigation
   */
  codeEnforcement: (): string[] => [
    ...createReasoningXML("Searching code enforcement"),
    ...createReasoningXML("records and violation history."),
    ...createFunctionCallXML(
      "search_violations",
      '{"property_id": "12345", "status": "active"}',
      "call_enforcement_1",
    ),
    ...createWebSearchXML("Code enforcement violations process", [
      {
        title: "Code Enforcement Guidelines 2024",
        url: "https://example.com/enforcement",
      },
      { title: "Appeals Process Overview", url: "https://example.com/appeals" },
    ]),
    ...createStaffReportRuleXML(
      "Code Enforcement",
      "Violations require written notice with 30-day compliance period",
    ),
    ...createStaffReportRuleXML(
      "Penalties",
      "First offense: $100-500, subsequent: $250-1000",
    ),
    ...createMessageText(
      "I've researched the code enforcement process for your situation.",
    ),
    ...createMessageText(
      "Based on the city's records and regulations, here's what I found:",
    ),
    ...createArtifactXML(`# Code Enforcement Process

## Violation Notice Process
1. Inspection identifies violation
2. Written notice issued (30-day compliance window)
3. Follow-up inspection scheduled
4. If compliant: case closed
5. If non-compliant: penalties apply

## Common Violations
- Unpermitted construction
- Setback violations
- Height restrictions
- Parking requirements

## Appeals
You have the right to appeal any violation within 10 days of notice.`),
    ...createClarificationXML([
      "What type of violation was cited?",
      "When did you receive the notice?",
      "Have you taken any corrective action?",
    ]),
    `<stop/>`,
  ],

  /**
   * Scenario 3: Business License Application
   */
  businessLicense: (): string[] => [
    ...createReasoningXML("Researching business license"),
    ...createReasoningXML("requirements and application process."),
    ...createFunctionCallXML(
      "search_business_licenses",
      '{"business_type": "retail", "location": "commercial"}',
      "call_business_1",
    ),
    ...createWebSearchXML("How to apply for business license", [
      {
        title: "Business Licensing Department",
        url: "https://example.com/business-license",
      },
      {
        title: "Permit Requirements by Business Type",
        url: "https://example.com/business-permits",
      },
    ]),
    ...createStaffReportRuleXML(
      "Business Licenses",
      "All businesses require a license to operate",
    ),
    ...createStaffReportRuleXML(
      "Business Licenses",
      "Annual fee: $150-500 based on business type",
    ),
    ...createStaffReportRuleXML(
      "Business Licenses",
      "Processing time: 10-14 business days",
    ),
    ...createStaffReportRuleXML(
      "Zoning",
      "Business must comply with commercial zoning regulations",
    ),
    ...createMessageText(
      "I've gathered information about business license requirements.",
    ),
    ...createMessageText("Here's what you need to know to get started:"),
    ...createArtifactXML(`# Business License Guide

## Application Process
1. Submit application online or in-person
2. Provide business information (name, address, type)
3. Pay application fee
4. Zoning approval verification
5. Receive license (10-14 days)

## Required Documents
- Completed application form
- Proof of business name registration
- Lease agreement or property deed
- Zoning compliance certificate

## Fees
- Retail: $150/year
- Restaurant: $250/year
- Professional Services: $200/year
- Home-based: $75/year`),
    ...createClarificationXML([
      "What type of business are you operating?",
      "What's the business address?",
      "When are you planning to start operations?",
    ]),
    `<stop/>`,
  ],
};

/**
 * Get a random scenario for demo purposes
 */
export function getRandomBadScenario(): string[] {
  const scenarios = Object.values(BAD_MOCK_STREAM_SCENARIOS);
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  const scenario = scenarios[randomIndex];
  if (!scenario) {
    return [];
  }
  return scenario();
}

/**
 * Get a specific scenario by name
 */
export function getBadScenario(
  name: keyof typeof BAD_MOCK_STREAM_SCENARIOS,
): string[] {
  return BAD_MOCK_STREAM_SCENARIOS[name]();
}
