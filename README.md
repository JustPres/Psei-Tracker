# PSEI Tracker

A web application for tracking Philippine stocks with real-time or near real-time price data.

## Features

- Real-time/near real-time stock price monitoring
- Clean and intuitive dashboard
- User authentication with Firebase
- Personal watchlist functionality
- Price change visualization with charts

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Firestore)
- Chart.js with react-chartjs-2

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Copy your Firebase configuration
   - Update `.env.local` with your Firebase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/contexts` - React context providers
- `/lib` - Utility functions and Firebase configuration
- `/types` - TypeScript type definitions

## TODO

- [ ] Integrate real stock market API
- [ ] Add price alerts functionality
- [ ] Implement news feed
- [ ] Add detailed stock information pages
- [ ] Add more technical analysis charts
- [ ] Enable email notifications
