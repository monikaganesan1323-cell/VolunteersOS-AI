"use client";

import { Button } from "@/components/ui/button";

// Inline brand marks kept minimal/monochrome so no external logo assets are needed.
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.37-2.29V6.6H1.28A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.28 5.4z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
function GithubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z" />
    </svg>
  );
}
function MicrosoftMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
      <rect x="13" y="1" width="10" height="10" fill="#81BC06" />
      <rect x="1" y="13" width="10" height="10" fill="#05A6F0" />
      <rect x="13" y="13" width="10" height="10" fill="#FFBA08" />
    </svg>
  );
}
function AppleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.24 3.06-.9.98-2.27 1.72-3.51 1.63-.14-1.1.4-2.26 1.2-3.08.86-.9 2.33-1.58 3.55-1.61zm4.05 16.6c-.4.94-.9 1.86-1.63 2.75-1.02 1.26-2.08 2.5-3.71 2.53-1.6.03-2.12-.94-3.96-.94-1.85 0-2.42.91-3.94.97-1.58.06-2.79-1.36-3.82-2.61-2.1-2.55-3.72-7.2-1.56-10.35 1.08-1.56 2.99-2.55 5.06-2.58 1.55-.03 3 1.05 3.96 1.05.95 0 2.72-1.3 4.58-1.11.78.03 2.97.32 4.38 2.4-.11.07-2.61 1.53-2.58 4.55.03 3.6 3.17 4.8 3.22 4.34z" />
    </svg>
  );
}

const providers = [
  { name: "Google", Icon: GoogleMark },
  { name: "GitHub", Icon: GithubMark },
  { name: "Microsoft", Icon: MicrosoftMark },
  { name: "Apple", Icon: AppleMark },
];

export function SocialLogin() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map(({ name, Icon }) => (
        <Button key={name} variant="outline" className="justify-center">
          <Icon /> {name}
        </Button>
      ))}
    </div>
  );
}
