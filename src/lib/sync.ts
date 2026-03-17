import { db, type SyncQueueItem } from './db'
import { supabase } from './supabase'

export const queueOfflineAction = async (
  userId: string,
  actionType: SyncQueueItem['actionType'],
  payload: any
) => {
  await db.syncQueue.add({
    userId,
    actionType,
    payload,
    createdAt: new Date().toISOString(),
    synced: false,
  })
}

export const processOfflineQueue = async (userId: string) => {
  const pendingItems = await db.syncQueue
    .where('userId')
    .equals(userId)
    .and((item) => !item.synced)
    .toArray()

  if (pendingItems.length === 0) return { success: true, count: 0 }

  let failedCount = 0
  let successCount = 0

  for (const item of pendingItems) {
    try {
      let error = null

      switch (item.actionType) {
        case 'MOOD_LOG':
          ({ error } = await supabase.from('mood_logs').upsert({
            user_id: item.userId,
            ...item.payload,
          }))
          break
        case 'LESSON_COMPLETE':
          ({ error } = await supabase.from('user_module_progress').upsert({
            user_id: item.userId,
            ...item.payload,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,module_id' }))
          break
        case 'CIRCLE_RESPONSE':
          ({ error } = await supabase.from('circle_responses').insert({
            user_id: item.userId,
            ...item.payload,
          }))
          break
        case 'GOAL_CREATE':
          ({ error } = await supabase.from('goals').insert({
            user_id: item.userId,
            ...item.payload,
          }))
          break
        case 'GOAL_COMPLETE':
          ({ error } = await supabase.from('goals').update({
            is_completed: true,
          }).eq('id', item.payload.id))
          break
        case 'AI_MESSAGE':
          ({ error } = await supabase.from('ai_conversations').upsert({
            user_id: item.userId,
            ...item.payload,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' }))
          break
        case 'POINT_TRANSACTION':
          ({ error } = await supabase.from('point_transactions').insert({
            user_id: item.userId,
            ...item.payload,
          }))
          break
      }

      if (!error) {
        await db.syncQueue.update(item.id!, { synced: true })
        successCount++
      } else {
        console.error(`Failed to sync item ${item.id}:`, error)
        failedCount++
      }
    } catch (e) {
      console.error(`Error processing sync item ${item.id}:`, e)
      failedCount++
    }
  }

  return { success: failedCount === 0, successCount, failedCount }
}
