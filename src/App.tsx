import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DispatcherPage } from './pages/DispatcherPage'
import { SyncPage } from './pages/SyncPage'
import { AsyncPage } from './pages/AsyncPage'
import { SessionsPage } from './pages/SessionsPage'
import { ContactsPage } from './pages/ContactsPage'
import { LogoOptionsPage } from './pages/LogoOptionsPage'
import { DeveloperPage } from './pages/DeveloperPage'
import { UseCasesPage } from './pages/UseCasesPage'
import { EndUserExperiencePage } from './pages/EndUserExperiencePage'
import { DailyUsagePage } from './pages/DailyUsagePage'
import { SessionViewerPage } from './pages/SessionViewerPage'
import { ICPPage } from './pages/ICPPage'
import { PushPullPage } from './pages/PushPullPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/use-cases" element={<UseCasesPage />} />
      <Route path="/app/user-experience" element={<EndUserExperiencePage />} />
      <Route path="/app/daily-usage" element={<DailyUsagePage />} />
      <Route path="/app/dispatcher" element={<DispatcherPage />} />
      <Route path="/app/sync" element={<SyncPage />} />
      <Route path="/app/async" element={<AsyncPage />} />
      <Route path="/app/sessions" element={<SessionsPage />} />
      <Route path="/app/contacts" element={<ContactsPage />} />
      <Route path="/app/session-viewer" element={<SessionViewerPage />} />
      <Route path="/app/icp" element={<ICPPage />} />
      <Route path="/app/push-pull" element={<PushPullPage />} />
      <Route path="/logo-options" element={<LogoOptionsPage />} />
      <Route path="/developer" element={<DeveloperPage />} />
    </Routes>
  )
}
