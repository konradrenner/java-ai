import React from 'react';
import { PromptResponse } from './PromptBackend';

interface Props {
  responses: PromptResponse[];
}

export const PromptHistory: React.FC<Props> = ({ responses }) => {
  return (
    <div>
      <h2 className="h4 mb-3">History (aktuelle Laufzeit)</h2>

      {responses.length === 0 && (
        <div className="alert alert-info">
          Noch keine Antworten in dieser Session.
        </div>
      )}

      {responses.map((r, i) => (
        <div className="card mb-3" key={i}>
          <div className="card-body">
            <div className="mb-2">
              <strong>Prompt:</strong>
              <div>{r.prompt}</div>
            </div>
            <div className="mb-2">
              <strong>Antwort:</strong>
              <div>{r.response}</div>
            </div>
            <div className="text-muted small">
              {new Date(r.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};