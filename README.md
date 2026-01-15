# YouTube Subscription Manager

A modern web application for managing your YouTube channel subscriptions. Built with Next.js 16, NextAuth.js v5, and the YouTube Data API v3.

<div align="center">
  <p>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-16.1.2-black?style=flat-square&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    </a>
    <a href="https://next-auth.js.org/">
      <img src="https://img.shields.io/badge/NextAuth-v5.0.0_beta.30-black?style=flat-square" alt="NextAuth.js" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    </a>
  </p>
</div>

## Features

- **Secure Authentication**: Google OAuth 2.0 integration via NextAuth.js
- **Subscription Management**: View all your YouTube subscriptions with detailed channel information
- **Bulk Actions**: Select and unsubscribe from multiple channels at once
- **Real-time Search**: Filter subscriptions by channel name or description
- **CSV Export**: Export your subscription data for backup or analysis
- **Infinite Scroll**: Smooth pagination for large subscription lists
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode**: Sleek dark theme

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16.1.2 | React framework with App Router |
| TypeScript 5.x | Type-safe development |
| NextAuth.js 5.0.0-beta.30 | Authentication and session management |
| Tailwind CSS 4.x | Utility-first styling |
| shadcn/ui | Accessible UI component library |
| Lucide React | Icon system |
| YouTube Data API v3 | YouTube integration |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Google Cloud Console project with YouTube Data API v3 enabled
- OAuth 2.0 credentials configured

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/henokase/youtube-subscription-manager.git
cd youtube-subscription-manager
npm install
```

### Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

| Variable | Description |
|----------|-------------|
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `AUTH_SECRET` | NextAuth secret (generate with `npx auth secret`) |
| `NEXTAUTH_URL` | Your deployment URL (e.g., `http://localhost:3000`) |

### Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Navigate to APIs & Services > Credentials
5. Create an OAuth 2.0 Client ID
6. Add your authorized JavaScript origins (e.g., `http://localhost:3000`)
7. Add your authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
8. Copy the Client ID and Client Secret to your `.env.local`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
youtube-subscription-manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth.js route handler
│   │   │   └── youtube/
│   │   │       ├── subscriptions/     # GET subscriptions, DELETE single
│   │   │       └── export/            # GET CSV export
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Main dashboard UI
│   │   │   └── layout.tsx             # Dashboard layout with header
│   │   ├── login/page.tsx             # Login page
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── SubscriptionTable.tsx      # Subscription list with selection
│   │   ├── SelectionBar.tsx           # Bottom selection action bar
│   │   ├── SearchFilter.tsx           # Search input component
│   │   └── UnsubscribeDialog.tsx      # Confirmation dialog
│   ├── hooks/
│   │   ├── useSubscriptions.ts        # Subscription data management
│   │   └── useSelection.ts            # Selection state management
│   ├── lib/
│   │   ├── youtube.ts                 # YouTube API integration
│   │   └── utils.ts                   # Utility functions
│   ├── auth.ts                        # NextAuth configuration
│   └── middleware.ts                  # Route protection
├── public/                            # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/[...nextauth]` | NextAuth.js authentication |
| GET | `/api/youtube/subscriptions` | Fetch paginated subscriptions |
| DELETE | `/api/youtube/subscriptions/[id]` | Unsubscribe from a channel |
| GET | `/api/youtube/export` | Export all subscriptions as CSV |

### YouTube API Scopes

This application requires the following Google OAuth scope:

```
https://www.googleapis.com/auth/youtube
```

This scope allows read and write access to your YouTube subscriptions.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
npm run build
npm run start
```

## Security Considerations

- Authentication tokens are stored in HTTP-only cookies
- API routes validate session tokens before processing requests
- Rate limiting prevents API quota exhaustion
- No sensitive data is logged or stored

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [YouTube Data API](https://developers.google.com/youtube/v3) - YouTube platform integration
