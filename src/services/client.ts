// Base URL for the products backend. When unset (local dev, CI) the services
// fall back to the bundled sample catalog in data/.
export const API_URL: string | undefined =
  process.env.EXPO_PUBLIC_API_URL || undefined;

// Simulates backend latency for the mock data path so screens behave like
// they do against the real API (spinners, waits, slow networks).
export async function simulateNetwork<T>(value: T, baseMs = 350): Promise<T> {
  const jitter = Math.random() * 300;
  await new Promise((resolve) => setTimeout(resolve, baseMs + jitter));
  return value;
}
