import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useBaby } from './contexts/BabyContext'
import { Login }     from './pages/Login'
import { Setup }     from './pages/Setup'
import { Dashboard } from './pages/Dashboard'
import { Sleep }     from './pages/Sleep'
import { Feed }      from './pages/Feed'
import { Awake }     from './pages/Awake'
import { Stats }     from './pages/Stats'
import { useTranslation } from 'react-i18next'

function AppRoutes() {
  const { user, loading: authLoading } = useAuth()
  const { baby, loading: babyLoading } = useBaby()
  const { t } = useTranslation()

  if (authLoading || babyLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white/40 text-sm">{t('common.loading')}</div>
      </div>
    )
  }
  if (!user) return <Login />
  if (!baby) return <Setup />

  return (
    <Routes>
      <Route path="/"       element={<Dashboard />} />
      <Route path="/sleep"  element={<Sleep />}     />
      <Route path="/feed"   element={<Feed />}      />
      <Route path="/awake"  element={<Awake />}     />
      <Route path="/stats"  element={<Stats />}     />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
