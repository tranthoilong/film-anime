"use client";

import { useEffect } from "react";

export default function TVShowsPage() {
  useEffect(() => {
    // Intentionally throw an error for testing
    throw new Error("This is an intentional error in the TV Shows page");
  }, []);

  return (
    <div>
      <h1>TV Shows</h1>
      {/* This content won't be shown due to the error */}
    </div>
  );
}
