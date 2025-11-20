export interface PromptResponse {
    prompt: string;
    response: string;
    timestamp: string;
}

export interface PromptBackendState {
    clientId: string;
    connected: boolean;
    responses: PromptResponse[];
    sendPrompt: (prompt: string) => void;
}

export function createPromptBackend(
    onUpdate: (state: PromptBackendState) => void
): PromptBackendState {
    const clientId = getOrCreateClientId();
    let connected = false;
    let responses: PromptResponse[] = [];
    let ws: WebSocket | undefined;

    function notify() {
        onUpdate({ clientId, connected, responses, sendPrompt });
    }

    function connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url = `${protocol}//${window.location.host}/ws/prompts/${clientId}`;

        ws = new WebSocket(url);

        ws.onopen = () => {
            connected = true;
            notify();
        };

        ws.onclose = () => {
            connected = false;
            notify();
        };

        ws.onerror = () => {
            connected = false;
            notify();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as PromptResponse;
                responses = [data, ...responses];
                notify();
            } catch (e) {
                console.error('Invalid WS message', e);
            }
        };
    }

    async function sendPrompt(prompt: string) {
        const trimmed = prompt.trim();
        if (!trimmed) return;

        try {
            await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: trimmed, clientId }),
            });
            // Antwort kommt asynchron via WebSocket
        } catch (e) {
            console.error('Error sending prompt', e);
        }
    }

    function getOrCreateClientId(): string {
        const key = 'prompt-console-client-id';
        const existing = window.localStorage.getItem(key);
        if (existing) return existing;

        const id =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36);

        window.localStorage.setItem(key, id);
        return id;
    }

    // direkt beim Erzeugen verbinden
    connectWebSocket();
    notify();

    return { clientId, connected, responses, sendPrompt };
}