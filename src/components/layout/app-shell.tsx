import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import type { NavTab } from './sidebar';
import { DashboardView } from '../dashboard/dashboard-view';
import { EmailProcessorView } from '../email/email-processor-view';
import { CRMView } from '../crm/crm-view';
import { CalendarView } from '../calendar/calendar-view';
import { RunsView } from '../runs/runs-view';
import { api } from '../../services/api';
import type { Contact, Meeting, Run, DashboardMetrics, EmailSubmission } from '../../types';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    emailsProcessed: 0,
    contactsCount: 0,
    meetingsScheduled: 0,
    pendingActions: 0,
    successfulToolExecutions: 0,
    failedToolExecutions: 0,
  });
  const [selectedRunId, setSelectedRunId] = useState<string | number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [activeProvider, setActiveProvider] = useState('Modo Demo Local');

  // Load initial data
  const refreshAllData = async () => {
    try {
      const [cts, mts, rns, mtsData, health] = await Promise.all([
        api.getContacts(),
        api.getMeetings(),
        api.getRuns(),
        api.getDashboardMetrics(),
        api.checkBackendHealth(),
      ]);

      setContacts(cts);
      setMeetings(mts);
      setRuns(rns);
      setMetrics(mtsData);
      setIsBackendOnline(health.online);
      setActiveProvider(health.provider || 'Modo Demo Local');

      if (rns.length > 0 && !selectedRunId) {
        setSelectedRunId(rns[0].id);
        // Pre-fetch details for the first run
        api.getRunById(rns[0].id).then((detailed) => {
          if (detailed) {
            setRuns((prev) =>
              prev.map((r) => (String(r.id) === String(detailed.id) ? detailed : r))
            );
          }
        });
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleProcessEmail = async (submission: EmailSubmission): Promise<Run> => {
    setIsProcessing(true);
    try {
      const newRun = await api.processEmail(submission);
      await refreshAllData();
      setSelectedRunId(newRun.id);
      return newRun;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectRun = async (runId: string | number) => {
    setSelectedRunId(runId);
    setCurrentTab('runs');
    try {
      const detailed = await api.getRunById(runId);
      if (detailed) {
        setRuns((prev) =>
          prev.map((r) => (String(r.id) === String(runId) ? detailed : r))
        );
      }
    } catch (err) {
      console.error('Error loading run details:', err);
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header isBackendOnline={isBackendOnline} activeProvider={activeProvider} />

      <div className="flex h-[calc(100vh-4.5rem)] overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          pendingActionsCount={metrics.pendingActions}
        />

        <main className="flex-1 p-7 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              recentRuns={runs.slice(0, 5)}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectRun={handleSelectRun}
            />
          )}

          {currentTab === 'email' && (
            <EmailProcessorView
              onProcessEmail={handleProcessEmail}
              onViewRunDetail={handleSelectRun}
              isProcessing={isProcessing}
            />
          )}

          {currentTab === 'crm' && <CRMView contacts={contacts} />}

          {currentTab === 'calendar' && <CalendarView meetings={meetings} />}

          {currentTab === 'runs' && (
            <RunsView
              runs={runs}
              selectedRunId={selectedRunId}
              onSelectRun={(id) => setSelectedRunId(id)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
