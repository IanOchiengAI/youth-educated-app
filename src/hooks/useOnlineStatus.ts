import { useState, useEffect } from 'react'
import { processOfflineQueue } from '../lib/sync'
import { useAppContext } from '../AppContext'

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true)
      dispatch({ type: 'SET_OFFLINE', payload: false })
      
      if (state.user) {
        console.log('Reconnecting... processing offline queue')
        await processOfflineQueue(state.user.id)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      dispatch({ type: 'SET_OFFLINE', payload: true })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [state.user, dispatch])

  return isOnline
}
