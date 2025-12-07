# Lowkey Portal

A minimal Next.js 14 portal for the Lowkey brand. The site includes a gated experience with protocol submission, oracle messaging, vault content retrieval, and Stripe checkout for the Founder Key.

## Requirements
- Node.js 20+
- npm 9+
- Environment variables (see `.env.example`)

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the environment template and populate it
   ```bash
   cp .env.example .env.local
   # add Stripe, Telegram, OpenAI, and access key values
   ```
3. Run the development server
   ```bash
   npm run dev
   ```
4. Build for production
   ```bash
   npm run build
   ```
5. Start in production mode
   ```bash
   npm run start
   ```

## Deployment Notes
- The app uses Next.js App Router with API routes, so it should run on platforms that support Node-based runtimes (e.g., Vercel, AWS, Fly). Static-only hosting is insufficient.
- `next.config.mjs` is configured for `standalone` output to simplify containerized deployments.
- Required environment variables:
  - `NEXT_PUBLIC_BASE_URL` – the public base URL used for Stripe redirect URLs.
  - `LOWKEY_MASTER_ACCESS_KEY` – the access gate key for `/api/access/verify`.
  - `OPENAI_API_KEY` – enables the oracle responses via OpenAI.
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` – sends protocol submissions to a Telegram chat.
  - `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` – enable the Founder Key checkout session.

## Security & Reliability
- API routes validate required payloads and return structured JSON errors.
- External calls depend on environment configuration; missing keys return safe error responses.
- Use HTTPS and secret management in your target platform to store credentials.
