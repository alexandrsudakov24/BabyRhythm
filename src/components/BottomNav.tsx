import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const tabs = [
  { to: '/',       icon: '🏠', key: 'dashboard' },
  { to: '/sleep',  icon: '🌙', key: 'sleep'     },
  { to: '/feed',   icon: '🍼', key: 'feed'      },
  { to: '/awake',  icon: '☀️', key: 'awake'     },
  { to: '/stats',  icon: '📊', key: 'stats'     },
]

export function BottomNav() {
  const { t } = useTranslation()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur border-t border-white/10
                    safe-area-inset-bottom flex">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors
             ${isActive ? 'text-brand-400' : 'text-white/50 hover:text-white/70'}`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span className="text-[10px] font-medium">{t(`nav.${tab.key}`)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
