import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { getGroupsAutoWebhookUrl } from '@/config/env.config';
import type { GroupPostWebhookPayload } from '@/lib/validators/group-post';

export async function sendGroupPostWebhook(payload: GroupPostWebhookPayload) {
  const webhookRes = await fetch(getGroupsAutoWebhookUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!webhookRes.ok) {
    const detail = await webhookRes.text().catch(() => '');
    fail(
      'WEBHOOK_FAILED',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      detail || `Webhook trả về lỗi (${webhookRes.status})`,
    );
  }
}
