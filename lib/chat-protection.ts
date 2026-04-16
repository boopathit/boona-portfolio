type RateWindow = { count: number; resetAt: number };

const buckets = new Map<string, RateWindow>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_MESSAGE_CHARS = 2000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

export function checkRateLimit(ip: string, now = Date.now()) {
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  buckets.set(ip, bucket);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - bucket.count };
}

export function isAllowedUserMessage(content: string) {
  if (content.length === 0 || content.length > MAX_MESSAGE_CHARS) return false;
  const repeatedCharRun = /(.)\1{30,}/.test(content);
  const excessiveUrls = (content.match(/https?:\/\//g) ?? []).length > 4;
  return !repeatedCharRun && !excessiveUrls;
}

export function resetProtectionState() {
  buckets.clear();
}
