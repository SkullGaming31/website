import Link from "next/link";
import LiveStatusBadge from "./LiveStatusBadge";

export default function Header() {
  return (
  <header className="w-full text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">💀</span>
            </div>
            <span className="font-semibold">SkullGamingHQ</span>
          </div>

            <nav className="hidden md:flex gap-6 ml-8 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/schedule" className="hover:underline">Schedule</Link>
            <Link href="/videos" className="hover:underline">Videos</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <LiveStatusBadge />
          <a href="https://twitter.com/SkullGamingHQ" aria-label="twitter" className="opacity-80 hover:opacity-100" target="_blank" rel="noopener noreferrer">
            {/* Twitter */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.88-2.36 8.53 8.53 0 0 1-2.7 1.03 4.25 4.25 0 0 0-7.24 3.88A12.06 12.06 0 0 1 3.15 4.6a4.24 4.24 0 0 0 1.32 5.67 4.2 4.2 0 0 1-1.92-.53v.05a4.25 4.25 0 0 0 3.41 4.17 4.27 4.27 0 0 1-1.91.07 4.25 4.25 0 0 0 3.97 2.95A8.53 8.53 0 0 1 2 19.54 12.03 12.03 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.69 0-.18-.01-.36-.02-.54A8.36 8.36 0 0 0 22.46 6z" />
            </svg>
          </a>

          <a href="https://www.youtube.com/@canadiendragon1" aria-label="youtube" className="opacity-80 hover:opacity-100" target="_blank" rel="noopener noreferrer">
            {/* YouTube */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1C16.6 2.5 12 2.5 12 2.5h-.1s-4.6 0-8.6.3c-.5 0-1.4.1-2.1 1C.7 4.6.5 6.2.5 6.2S.2 8.4.2 10.6v2.8c0 2.2.3 4.4.3 4.4s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.6.3 7.6.3s4.6 0 8.6-.3c.5 0 1.4-.1 2.1-1 .6-.7.8-2.4.8-2.4s.3-2.2.3-4.4v-2.8c0-2.2-.3-4.4-.3-4.4zM9.8 15.6V8.4l6.5 3.6-6.5 3.6z" />
            </svg>
          </a>

          <a href="https://www.twitch.tv/skullgaminghq" aria-label="twitch" className="opacity-80 hover:opacity-100" target="_blank" rel="noopener noreferrer">
            {/* Twitch */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 3v13.5h3V21l3-3h4.5L20 14V3H4zm15 11.5l-2 1.5H9l-2 2v-2H5V4h14v10.5zM14 7h2v4h-2V7zm-4 0h2v4H10V7z" />
            </svg>
          </a>

          <a href="https://www.instagram.com/skullgaminghq1" aria-label="instagram" className="opacity-80 hover:opacity-100" target="_blank" rel="noopener noreferrer">
            {/* Instagram */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm8 4.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 8a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
