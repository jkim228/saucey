import { useEffect, useState } from 'react'
import { DEFAULT_TAB, TABS } from '../data/tabs'
import { loadTab, saveTab } from '../lib/storage'

const TAB_KEYS = TABS.map((tab) => tab.key)

/** The selected bottom menu tab, restored from and saved to this device. */
export function useActiveTab() {
  const [activeTab, setActiveTab] = useState(() => loadTab(TAB_KEYS) ?? DEFAULT_TAB)

  useEffect(() => {
    saveTab(activeTab)
  }, [activeTab])

  return [activeTab, setActiveTab]
}
