import { AppError } from '@/errors/app-error';
import { ConfigErrorCode, HttpStatusCode } from '@/constants/enums';

const LEGACY_SERVICE_ROLE_KEY = 'NEXT_PUBLIC_SERVICE_ROLE_KEY';

export enum EnvKey {
  SUPABASE_URL = 'NEXT_PUBLIC_SUPABASE_URL',
  SUPABASE_ANON_KEY = 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  SERVICE_ROLE_KEY = 'SUPABASE_SERVICE_ROLE_KEY',
  API_BASE_URL = 'NEXT_PUBLIC_API_BASE_URL',
  GROUPS_AUTO_WEBHOOK_URL = 'GROUPS_AUTO_WEBHOOK_URL',
  LARK_APP_ID = 'LARK_APP_ID',
  LARK_APP_SECRET = 'LARK_APP_SECRET',
  LARK_BASE_TOKEN = 'LARK_BASE_TOKEN',
  LARK_TABLE_ID = 'LARK_TABLE_ID',
  LARK_VIEW_ID = 'LARK_VIEW_ID',
  LARK_DOMAIN = 'LARK_DOMAIN',
  NODE_ENV = 'NODE_ENV',
}

export const DEFAULT_LARK_DOMAIN = 'https://open.larksuite.com';

export const DEFAULT_GROUPS_AUTO_WEBHOOK_URL = 'https://dhsyccqor.datadex.vn/webhook/groups-auto';

function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getRequiredEnv(key: EnvKey): string {
  const value =
    readEnv(key) ||
    (key === EnvKey.SERVICE_ROLE_KEY ? readEnv(LEGACY_SERVICE_ROLE_KEY) : undefined);

  if (!value) {
    throw new AppError(
      ConfigErrorCode.MISSING_ENV,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      `Thiếu biến môi trường: ${key}`,
    );
  }
  return value;
}

export function getOptionalEnv(key: EnvKey): string | undefined {
  if (key === EnvKey.SERVICE_ROLE_KEY) {
    return readEnv(key) || readEnv(LEGACY_SERVICE_ROLE_KEY);
  }
  return readEnv(key);
}

export function getGroupsAutoWebhookUrl(): string {
  return getOptionalEnv(EnvKey.GROUPS_AUTO_WEBHOOK_URL) ?? DEFAULT_GROUPS_AUTO_WEBHOOK_URL;
}

export function getLarkDomain(): string {
  return getOptionalEnv(EnvKey.LARK_DOMAIN) ?? DEFAULT_LARK_DOMAIN;
}
