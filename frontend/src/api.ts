import { fetchEventSource } from '@microsoft/fetch-event-source';

const API_BASE = 'http://localhost:3001/api';

export async function clarifyProject(projectName: string, description: string) {
  const res = await fetch(`${API_BASE}/blueprint/clarify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, description })
  });
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export function streamBlueprint(
  projectName: string,
  description: string,
  answers: Record<string, string>,
  sectionsToGenerate: string[] | undefined,
  onSection: (section: string, data: any) => void,
  onError: (section: string, error: string) => void,
  onDone: () => void
) {
  const ctrl = new AbortController();
  
  fetchEventSource(`${API_BASE}/blueprint/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
    body: JSON.stringify({ projectName, description, answers, sectionsToGenerate }),
    signal: ctrl.signal,
    async onopen(res) {
      if (res.ok && res.headers.get('content-type')?.includes('text/event-stream')) {
        return; 
      }
      throw new Error(`Failed to establish SSE. Status: ${res.status}`);
    },
    onmessage(ev) {
      if (ev.event === 'section') {
        const payload = JSON.parse(ev.data);
        onSection(payload.section, payload.data);
      } else if (ev.event === 'error') {
        const payload = JSON.parse(ev.data);
        onError(payload.section, payload.error);
      } else if (ev.event === 'done') {
        onDone();
        ctrl.abort();
      }
    },
    onerror(err) {
      console.error("SSE Error:", err);
      // Return void to stop retrying the whole stream automatically
      ctrl.abort();
    }
  });

  return ctrl;
}

export async function sendChatMessage(chatHistory: any[], blueprintData: any) {
  const res = await fetch(`${API_BASE}/blueprint/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatHistory, blueprintData })
  });
  if (!res.ok) throw new Error("Failed to send chat message");
  return res.json();
}

export async function refineSections(sectionsToRefine: string[], blueprintData: any, instruction: string) {
  const res = await fetch(`${API_BASE}/blueprint/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sectionsToRefine, blueprintData, instruction })
  });
  if (!res.ok) throw new Error("Failed to refine sections");
  return res.json();
}
