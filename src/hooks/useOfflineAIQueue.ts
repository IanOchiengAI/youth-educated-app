import { useEffect } from 'react';
import { db } from '../lib/db';
import { sendCloudMessage } from '../api/jabari';
import { updateAIConversations } from '../api/jabari';
import { useAppContext } from '../AppContext';

export function useOfflineAIQueue() {
  const { state } = useAppContext();

  useEffect(() => {
    const processQueue = async () => {
      if (!navigator.onLine || !state.user?.id) return;

      try {
        const queries = await db.offlineAIQueries.where('userId').equals(state.user.id).toArray();
        if (queries.length === 0) return;

        for (const query of queries) {
          try {
            // Fetch the answer from Cloud Gemini
            const responseText = await sendCloudMessage(
              query.message,
              query.history,
              state.user,
              'default',
              undefined,
              query.persona as 'jabari' | 'amara'
            );

            // Append to cloud history
            const updatedHistory = [
              ...query.history,
              { role: 'user', parts: [{ text: query.message }] },
              { role: 'model', parts: [{ text: responseText }] }
            ];
            await updateAIConversations(state.user.id, updatedHistory);

            // Clean up the processed item
            await db.offlineAIQueries.delete(query.id!);

            // Show a generic native-like alert or toast
            const personaName = query.persona === 'jabari' ? 'Jabari' : 'Amara';
            alert(`${personaName} has an answer for your offline question: "${query.message.substring(0, 30)}..."`);
            
          } catch (error) {
            console.error("Failed to process offline query:", error);
          }
        }
      } catch (err) {
        console.error("Error reading offline queries:", err);
      }
    };

    window.addEventListener('online', processQueue);
    // Also run once on mount in case they launched the app while online but had old queued items
    processQueue();

    return () => {
      window.removeEventListener('online', processQueue);
    };
  }, [state.user?.id]);
}
