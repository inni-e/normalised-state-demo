import type { StreamChunk, MessageChunk } from "@/types/chat-stream";
import { StreamChunkType } from "@/types/chat-stream";

/**
 * Helper function to split text into small streaming chunks
 */
function splitIntoChunks(text: string, chunkSize = 10): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  const words = text.split(" ");

  for (const word of words) {
    if ((currentChunk + word).length > chunkSize && currentChunk) {
      chunks.push(currentChunk + " ");
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? " " : "") + word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Helper function to create message chunks from text
 */
function createMessageChunks(text: string): MessageChunk[] {
  return splitIntoChunks(text).map(
    (chunkText): MessageChunk => ({
      type: StreamChunkType.MESSAGE,
      text: chunkText,
    }),
  );
}

/**
 * Comprehensive mock stream data simulating various AI assistant scenarios
 */
export const MOCK_STREAM_SCENARIOS = {
  /**
   * Scenario 1: Zoning and Permits Inquiry
   */
  zoningPermits: (): StreamChunk[] => [
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "Let me analyze your request",
    },
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "and search the relevant documents.",
    },
    {
      type: StreamChunkType.FUNCTION_CALL,
      name: "search_documents",
      arguments: '{"query": "zoning regulations residential", "limit": 15}',
      status: "executing",
      call_id: "call_zoning_1",
    },
    {
      type: StreamChunkType.WEB_SEARCH,
      query: "What are the current residential zoning requirements?",
      sources: [
        {
          title: "Municipal Code - Zoning Ordinance",
          url: "https://example.com/zoning-ordinance",
        },
        {
          title: "City Planning Department Guidelines",
          url: "https://example.com/planning-guidelines",
        },
      ],
    },
    ...(["Zoning", "Regulations"].map((text) => ({
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: text,
      rule_text: `Found ${text} section in database`,
    })) as StreamChunk[]),
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Zoning Regulations",
      rule_text: "R-1 zones require minimum lot size of 5,000 sq ft",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Zoning Regulations",
      rule_text: "Maximum coverage: 40% of lot area",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Setbacks",
      rule_text: "Front setback: 20 feet minimum",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Setbacks",
      rule_text: "Side setbacks: 10 feet minimum",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Building Permits",
      rule_text: "Required for structures over 120 sq ft",
    },
    ...createMessageChunks(
      "Based on my analysis of the city documents, I found several key regulations that apply to your situation.",
    ),
    ...createMessageChunks(
      "The zoning ordinance requires specific setbacks and height restrictions. Here's what you need to know:",
    ),
    {
      type: StreamChunkType.ARTIFACT,
      text: `# Zoning Requirements Summary

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

For more details, please refer to the municipal code Section 17.20.`,
      language: "markdown",
    },
    {
      type: StreamChunkType.CLARIFICATION,
      questions: [
        "What specific property address are you inquiring about?",
        "Are you planning new construction or modifications?",
        "Do you need permit application assistance?",
      ],
    },
    {
      type: StreamChunkType.STOP,
    },
  ],

  /**
   * Scenario 2: Code Enforcement Investigation
   */
  codeEnforcement: (): StreamChunk[] => [
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "Searching code enforcement",
    },
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "records and violation history.",
    },
    {
      type: StreamChunkType.FUNCTION_CALL,
      name: "search_violations",
      arguments: '{"property_id": "12345", "status": "active"}',
      status: "executing",
      call_id: "call_enforcement_1",
    },
    {
      type: StreamChunkType.WEB_SEARCH,
      query: "Code enforcement violations process",
      sources: [
        {
          title: "Code Enforcement Guidelines 2024",
          url: "https://example.com/enforcement",
        },
        {
          title: "Appeals Process Overview",
          url: "https://example.com/appeals",
        },
      ],
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Code Enforcement",
      rule_text:
        "Violations require written notice with 30-day compliance period",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Penalties",
      rule_text: "First offense: $100-500, subsequent: $250-1000",
    },
    ...createMessageChunks(
      "I've researched the code enforcement process for your situation.",
    ),
    ...createMessageChunks(
      "Based on the city's records and regulations, here's what I found:",
    ),
    {
      type: StreamChunkType.ARTIFACT,
      text: `# Code Enforcement Process

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
You have the right to appeal any violation within 10 days of notice.`,
      language: "markdown",
    },
    {
      type: StreamChunkType.CLARIFICATION,
      questions: [
        "What type of violation was cited?",
        "When did you receive the notice?",
        "Have you taken any corrective action?",
      ],
    },
    {
      type: StreamChunkType.STOP,
    },
  ],

  /**
   * Scenario 3: Business License Application
   */
  businessLicense: (): StreamChunk[] => [
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "Researching business license",
    },
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "requirements and application process.",
    },
    {
      type: StreamChunkType.FUNCTION_CALL,
      name: "search_business_licenses",
      arguments: '{"business_type": "retail", "location": "commercial"}',
      status: "executing",
      call_id: "call_business_1",
    },
    {
      type: StreamChunkType.WEB_SEARCH,
      query: "How to apply for business license",
      sources: [
        {
          title: "Business Licensing Department",
          url: "https://example.com/business-license",
        },
        {
          title: "Permit Requirements by Business Type",
          url: "https://example.com/business-permits",
        },
      ],
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Business Licenses",
      rule_text: "All businesses require a license to operate",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Business Licenses",
      rule_text: "Annual fee: $150-500 based on business type",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Business Licenses",
      rule_text: "Processing time: 10-14 business days",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Zoning",
      rule_text: "Business must comply with commercial zoning regulations",
    },
    ...createMessageChunks(
      "I've gathered information about business license requirements.",
    ),
    ...createMessageChunks("Here's what you need to know to get started:"),
    {
      type: StreamChunkType.ARTIFACT,
      text: `# Business License Guide

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
- Home-based: $75/year`,
      language: "markdown",
    },
    {
      type: StreamChunkType.CLARIFICATION,
      questions: [
        "What type of business are you operating?",
        "What's the business address?",
        "When are you planning to start operations?",
      ],
    },
    {
      type: StreamChunkType.STOP,
    },
  ],

  /**
   * Scenario 4: Public Works Project Inquiry
   */
  publicWorks: (): StreamChunk[] => [
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "Searching public works",
    },
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "project documentation and schedules.",
    },
    {
      type: StreamChunkType.FUNCTION_CALL,
      name: "search_projects",
      arguments: '{"department": "public_works", "status": "active"}',
      status: "executing",
      call_id: "call_pw_1",
    },
    {
      type: StreamChunkType.WEB_SEARCH,
      query: "Public works projects road construction schedule",
      sources: [
        {
          title: "City Projects Dashboard",
          url: "https://example.com/projects",
        },
        {
          title: "Traffic Impact Studies",
          url: "https://example.com/traffic-impact",
        },
      ],
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Public Works",
      rule_text: "Major projects require community notification 30 days prior",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Public Works",
      rule_text: "Work hours: 7 AM - 6 PM, Monday-Friday",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Road Construction",
      rule_text: "Minimum one lane must remain open during construction",
    },
    ...createMessageChunks(
      "I found information about current public works projects.",
    ),
    {
      type: StreamChunkType.ARTIFACT,
      text: `# Public Works Project Information

## Active Projects

### Main Street Resurfacing
- Location: Main St. between 1st and 5th Ave
- Duration: February 15 - March 20
- Impact: Single lane closures during peak hours
- Contact: Public Works Dept - (555) 123-4567

### Water Main Replacement
- Location: Oak St. neighborhood
- Duration: March 1 - April 15
- Impact: Temporary water shutoffs (scheduled)
- Notifications: Sent to affected residents

## Project Coordination
- Community meetings: First Thursday of each month
- Updates: Available on city website
- Questions: Call Public Works at extension 456`,
      language: "markdown",
    },
    {
      type: StreamChunkType.CLARIFICATION,
      questions: [
        "Which specific street or area are you asking about?",
        "Do you have concerns about traffic or access?",
        "Would you like to receive project updates?",
      ],
    },
    {
      type: StreamChunkType.STOP,
    },
  ],

  /**
   * Scenario 5: Park and Recreation Facilities
   */
  parksRecreation: (): StreamChunk[] => [
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "Checking park and",
    },
    {
      type: StreamChunkType.REASONING_TEXT,
      text: "recreation facility availability.",
    },
    {
      type: StreamChunkType.FUNCTION_CALL,
      name: "check_facility_availability",
      arguments: '{"facility": "community_center", "date": "2025-03-15"}',
      status: "executing",
      call_id: "call_parks_1",
    },
    {
      type: StreamChunkType.WEB_SEARCH,
      query: "How to reserve park facilities and community centers",
      sources: [
        {
          title: "Parks & Recreation Portal",
          url: "https://example.com/parks-rec",
        },
        {
          title: "Recreation Programs 2025",
          url: "https://example.com/programs",
        },
      ],
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Reservations",
      rule_text: "Reservations require 30 days advance notice",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Reservations",
      rule_text: "Refund policy: 48-hour cancellation notice required",
    },
    {
      type: StreamChunkType.STAFF_REPORT_RULE,
      section_name: "Park Rules",
      rule_text: "Facilities close at 10 PM on weekends",
    },
    ...createMessageChunks(
      "I've looked up information about our parks and recreation facilities.",
    ),
    {
      type: StreamChunkType.ARTIFACT,
      text: `# Parks & Recreation Facilities

## Community Centers

### Main Street Community Center
- Capacity: 200 people
- Rooms: Meeting hall, kitchen, gymnasium
- Rental: $250/day (resident), $350/day (non-resident)
- Hours: 8 AM - 10 PM

### Oak Park Recreation Center
- Capacity: 150 people
- Amenities: Pool, fitness room, meeting rooms
- Rental: $200/day
- Hours: 6 AM - 9 PM

## Reservations
- Online: parks.city.gov/reserve
- Phone: (555) 123-4567
- In-person: 123 City Hall Blvd

## Programs
- Youth sports leagues (Spring registration open)
- Senior fitness classes (M/W/F mornings)
- Swim lessons (Year-round availability)`,
      language: "markdown",
    },
    {
      type: StreamChunkType.CLARIFICATION,
      questions: [
        "Which facility are you interested in?",
        "What's the event date and time?",
        "What's the expected number of attendees?",
      ],
    },
    {
      type: StreamChunkType.STOP,
    },
  ],
};

/**
 * Get a random scenario for demo purposes
 */
export function getRandomScenario(): StreamChunk[] {
  const scenarios = Object.values(MOCK_STREAM_SCENARIOS);
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
export function getScenario(
  name: keyof typeof MOCK_STREAM_SCENARIOS,
): StreamChunk[] {
  return MOCK_STREAM_SCENARIOS[name]();
}
