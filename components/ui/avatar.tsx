"use client";

import * as React from "react";
import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
  size = 40,
}: {
  name: string;
  src?: string;
  className?: string;
  size?: number;
}) {
  const [errored, setErrored] = React.useState(false);
  if (src && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className={cn("rounded-full object-cover ring-2 ring-white dark:ring-bark", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-crema-swirl font-display text-sm font-semibold text-espresso-800 ring-2 ring-white dark:ring-bark",
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </div>
  );
}
