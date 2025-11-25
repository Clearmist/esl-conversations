import '../styles/globals.css';
import { AppStateProvider } from './providers';

export const metadata = {
  title: {
    template: '%s | ESL',
    default: 'ESL Conversations'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="preload" as="image" href="/images/definitions/amy.png" />
        <link rel="preload" as="image" href="/images/definitions/choice-knuckles.webp" />
        <link rel="preload" as="image" href="/images/definitions/choice-sonic.webp" />
        <link rel="preload" as="image" href="/images/definitions/choice-tails.webp" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-knuckles-finish.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-knuckles-idle.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-knuckles-run.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-knuckles-walk.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-knuckles-dash.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-sonic-finish.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-sonic-idle.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-sonic-run.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-sonic-walk.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-sonic-dash.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-tails-finish.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-tails-idle.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-tails-run.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-tails-walk.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-tails-dash.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-robotnik-finish.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-robotnik-idle.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-robotnik-run.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-robotnik-walk.png" />
        <link rel="preload" as="image" href="/images/definitions/sprite-sheet-robotnik-dash.png" />
      </head>
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
