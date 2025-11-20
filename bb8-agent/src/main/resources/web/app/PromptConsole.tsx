import React, { useState } from 'react';
import { PromptBackendState } from './PromptBackend';

interface Props {
  backend: PromptBackendState;
}

export const PromptConsole: React.FC<Props> = ({ backend }) => {
  const [prompt, setPrompt] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    backend.sendPrompt(prompt);
    setPrompt('');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Prompt eingeben</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Die Antworten kommen per WebSocket, ohne Page-Reload.
        </h6>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="prompt" className="form-label">
              Dein Prompt
            </label>
            <textarea
              id="prompt"
              className="form-control"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreibe, was du möchtest..."
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span
              className={
                'badge ' +
                (backend.connected ? 'bg-success' : 'bg-secondary')
              }
            >
              {backend.connected
                ? 'WebSocket verbunden'
                : 'nicht verbunden'}
            </span>
            <small className="text-muted">
              Client: {backend.clientId.slice(0, 8)}…
            </small>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!prompt.trim()}
            >
              Senden
            </button>
          </div>
        </form>
      </div>

      {backend.responses.length > 0 && (
        <div className="card-body border-top mt-3">
          <h6 className="mb-3">Aktuelle Antworten (Session)</h6>
          {backend.responses.map((r, i) => (
            <div key={i} className="mb-3">
              <div>
                <strong>Prompt:</strong>
                <div>{r.prompt}</div>
              </div>
              <div className="mt-1">
                <strong>Antwort:</strong>
                <div>{r.response}</div>
              </div>
              <div className="text-muted small mt-1">
                {new Date(r.timestamp).toLocaleString()}
              </div>
              {i < backend.responses.length - 1 && <hr />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};