import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { EnvKey, getLarkDomain, getRequiredEnv } from '@/config/env.config';

export type CandidateRecord = {
  record_id: string;
  fields: Record<string, unknown>;
};

// ponytail: token cached in module scope (single process) — swap for a shared cache if this runs multi-instance
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getTenantAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const res = await fetch(`${getLarkDomain()}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: getRequiredEnv(EnvKey.LARK_APP_ID),
      app_secret: getRequiredEnv(EnvKey.LARK_APP_SECRET),
    }),
  });
  const json = await res.json();

  if (!res.ok || json.code !== 0) {
    fail(
      'LARK_AUTH_FAILED',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      json.msg || 'Không lấy được token truy cập Lark.',
    );
  }

  cachedToken = {
    value: json.tenant_access_token,
    expiresAt: Date.now() + (json.expire - 60) * 1000,
  };
  return cachedToken.value;
}

export async function listCandidateRecords(): Promise<CandidateRecord[]> {
  const token = await getTenantAccessToken();
  const baseToken = getRequiredEnv(EnvKey.LARK_BASE_TOKEN);
  const tableId = getRequiredEnv(EnvKey.LARK_TABLE_ID);
  const viewId = getRequiredEnv(EnvKey.LARK_VIEW_ID);

  const records: CandidateRecord[] = [];
  let pageToken = '';

  do {
    const url = new URL(
      `${getLarkDomain()}/open-apis/bitable/v1/apps/${baseToken}/tables/${tableId}/records`,
    );
    url.searchParams.set('view_id', viewId);
    url.searchParams.set('page_size', '100');
    if (pageToken) url.searchParams.set('page_token', pageToken);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();

    if (!res.ok || json.code !== 0) {
      fail(
        'LARK_RECORDS_FAILED',
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        json.msg || 'Không tải được dữ liệu ứng viên từ Lark.',
      );
    }

    records.push(...(json.data?.items ?? []));
    pageToken = json.data?.has_more ? json.data.page_token : '';
  } while (pageToken);

  return records;
}
