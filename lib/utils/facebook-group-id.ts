/** Build Facebook group URL from a stored group id. */
export function facebookGroupUrl(groupId: string): string {
  return `https://www.facebook.com/groups/${encodeURIComponent(groupId.trim())}`;
}

/** Extract Facebook group id from a raw id or group URL. */
export function parseFacebookGroupId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const match = trimmed.match(
    /(?:(?:https?:\/\/)?(?:www\.)?(?:m\.)?facebook\.com\/groups\/)([^/?#\s]+)/i,
  );
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]).replace(/\/+$/, '');
    } catch {
      return match[1].replace(/\/+$/, '');
    }
  }

  return trimmed;
}
