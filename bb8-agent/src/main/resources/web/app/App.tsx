import React, { useEffect, useState } from 'react';
import { createPromptBackend, PromptBackendState } from './PromptBackend';
import { PromptConsole } from './PromptConsole';
import { PromptHistory } from './PromptHistory';

type Tab = 'prompt' | 'history';

export const App: React.FC = () => {
  const [backendState, setBackendState] = useState<PromptBackendState>({
    clientId: '',
    connected: false,
    responses: [],
    sendPrompt: () => {},
  });

  const [activeTab, setActiveTab] = useState<Tab>('prompt');

  useEffect(() => {
    const state = createPromptBackend(setBackendState);
    setBackendState(state);
    // keine Cleanup-Logik nötig für dieses einfache Beispiel
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Prompt Console</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className={
                    'nav-link btn btn-link text-start ' +
                    (activeTab === 'prompt' ? 'active' : '')
                  }
                  onClick={() => setActiveTab('prompt')}
                >
                  Prompt
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={
                    'nav-link btn btn-link text-start ' +
                    (activeTab === 'history' ? 'active' : '')
                  }
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
              </li>
            </ul>

            <span className="navbar-text small">
              Client: {backendState.clientId.slice(0, 8)}…{' '}
              {backendState.connected ? (
                <span className="badge bg-success ms-2">WS connected</span>
              ) : (
                <span className="badge bg-secondary ms-2">WS offline</span>
              )}
            </span>
          </div>
        </div>
      </nav>

      <main className="container my-4">
        {activeTab === 'prompt' && (
          <PromptConsole backend={backendState} />
        )}

        {activeTab === 'history' && (
          <PromptHistory responses={backendState.responses} />
        )}
      </main>
    </>
  );
};