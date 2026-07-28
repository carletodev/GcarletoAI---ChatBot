export interface MessageHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface N8NRequestPayload {
  chat_id: string;
  user_id: string;
  message: string;
  history: MessageHistoryItem[];
}

export interface N8NResponse {
  reply: string;
  suggested_title?: string;
}

export async function sendToN8NAgent(
  chatId: string,
  userId: string,
  message: string,
  history: MessageHistoryItem[]
): Promise<N8NResponse> {
  // Allow overriding the URL via local storage if set in the settings page
  const localWebhookUrl = localStorage.getItem('gcarleto_custom_webhook_url');
  const webhookUrl = localWebhookUrl || import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes('your-n8n-webhook-url.com') || webhookUrl.trim() === '') {
    throw new Error(
      'O URL do webhook do N8N não está configurado. Configure a variável VITE_N8N_WEBHOOK_URL no arquivo .env ou informe um URL nas Configurações do sistema.'
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
        message: message,
        history: history,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na resposta do agente (Status: ${response.status})`);
    }

    const data = await response.json();

    // Sometimes N8N returns an array or wraps the result, let's be flexible
    let responseData = data;
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0];
    }

    if (!responseData || (typeof responseData.reply !== 'string' && typeof responseData.output !== 'string' && typeof responseData.text !== 'string')) {
      console.warn('Formato de resposta inesperado do N8N:', data);
      if (typeof responseData === 'string') {
        return { reply: responseData };
      }
      throw new Error('O agente de IA retornou uma resposta em formato inválido.');
    }

    const reply = responseData.reply || responseData.output || responseData.text || '';
    const suggested_title = responseData.suggested_title || responseData.suggestedTitle || undefined;

    return {
      reply,
      suggested_title,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Timeout contacting N8N webhook');
    } else {
      console.error('Failed to fetch N8N webhook:', error);
    }
    // Return a simulated response so UI shows a friendly message instead of failing
    const fallbackReply = `Desculpe, não consegui conectar ao agente de IA (N8N). Por favor, verifique se a URL do webhook está correta e se o serviço está ativo.`;
    return { reply: fallbackReply };
  }

}
