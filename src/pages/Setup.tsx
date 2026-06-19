import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBaby } from '../contexts/BabyContext'

export function Setup() {
  const { t } = useTranslation()
  const { createProfile } = useBaby()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !birthDate) return
    setSaving(true)
    await createProfile(name.trim(), birthDate)
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 gap-6">
      <div className="text-5xl">👶</div>
      <h1 className="text-xl font-bold text-white text-center">{t('setup.title')}</h1>
      <div className="w-full max-w-xs flex flex-col gap-3">
        <input
          className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-base placeholder:text-white/30 outline-none focus:ring-2 focus:ring-brand-500"
          placeholder={t('setup.namePlaceholder')}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div>
          <label className="block text-xs text-white/50 mb-1 ml-1">{t('setup.birthDate')}</label>
          <input
            type="date"
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand-500"
            value={birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={e => setBirthDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim() || !birthDate || saving}
          className="w-full bg-brand-500 text-white font-semibold rounded-xl py-3 mt-2
                     disabled:opacity-40 active:scale-95 transition-transform"
        >
          {saving ? '…' : t('setup.save')}
        </button>
      </div>
    </div>
  )
}
