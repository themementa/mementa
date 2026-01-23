type SupabaseKeyUsage = {
  key: string | undefined;
  keyName: string;
  source?: string;
};

function getCallerLocation() {
  const stack = new Error().stack?.split("\n") ?? [];
  for (const line of stack) {
    if (line.includes("logSupabaseKeyUsage")) {
      continue;
    }
    const match = line.match(/\(?(.+):(\d+):(\d+)\)?/);
    if (match) {
      const [, file, lineNumber] = match;
      return `${file}:${lineNumber}`;
    }
  }
  return undefined;
}

export function logSupabaseKeyUsage({ key, keyName, source }: SupabaseKeyUsage) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const preview = key ? key.slice(0, 12) : "(missing)";
  console.log(`[supabase] ${keyName} key prefix: ${preview}`);

  if (key?.startsWith("eyJhb")) {
    const location = getCallerLocation() ?? source ?? "unknown";
    console.warn(`[supabase] key starts with "eyJhb" at ${location}`);
  }
}

