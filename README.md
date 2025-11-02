# Normalized State Demo

An educational demo comparing "good" vs "bad" approaches to handling streaming chat responses with normalized state management.

## What This Demo Shows

This app demonstrates two different ways to handle streaming chat responses:

- **Good Implementation** (`/`): Uses normalized state with Zustand to properly manage streaming chunks (messages, artifacts, clarifications, function calls, etc.) with type safety
- **Bad Implementation** (`/bad`): Shows the pitfalls of parsing raw XML strings on every render without normalized state

Click the "Send Demo Message" button to see a simulated streaming response with various chunk types.

## Running Locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
