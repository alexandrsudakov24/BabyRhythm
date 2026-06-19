import { type ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { useAuth } from '../contexts/AuthContext'
import { useBaby } from '../contexts/BabyContext'
import { useTranslation } from 'react-i18next'

interface Props { children: ReactNode; title?: string }

export function Layout({ children, title }: Props) {
  const { user, logout } = useAuth()
  const { baby } = useBaby()
  const { t, i18n } = useTranslation()
  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-white/5 px-4 py-3
                         flex items-center justify-between safe-area-inset-top">
        <div>
          <h1 className="text-base font-bold text-white">{title ?? 'BabyRhythm'}</h1>
          {baby && <p className="text-xs text-white/40">{baby.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded">
            {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
          </button>
          {user && (
            <button onClick={logout} className="text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded">
              {t('common.logout')}
            </button>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
