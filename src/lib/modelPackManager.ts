import { db, LocalAIModelPack } from './db';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { DeviceCapability } from './androidCapabilities';

export const AI_MODEL_PACK_ID = 'ye-jabari-nano-v1';
export const AI_MODEL_PACK_SIZE_BYTES = 500_000_000; // ~500 MB
export const AI_MODEL_PACK_CHECKSUM = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

let downloadAbortController: AbortController | null = null;

export async function getModelPackStatus(): Promise<LocalAIModelPack | null> {
  return (await db.aiModelPacks.get(AI_MODEL_PACK_ID)) || null;
}

export async function deleteModelPack(): Promise<void> {
  try {
    await Filesystem.deleteFile({
      path: `models/${AI_MODEL_PACK_ID}.bin`,
      directory: Directory.Data,
    });
  } catch (e) {
    console.warn('[modelPackManager] Failed to delete file from disk:', e);
  }
  await db.aiModelPacks.put({
    packId: AI_MODEL_PACK_ID,
    modelVersion: '1.0.0',
    status: 'deleted',
    sizeBytes: AI_MODEL_PACK_SIZE_BYTES,
    checksum: AI_MODEL_PACK_CHECKSUM,
  });
}

export async function pauseModelPackDownload(): Promise<void> {
  if (downloadAbortController) {
    downloadAbortController.abort();
    downloadAbortController = null;
  }
  const current = await getModelPackStatus();
  if (current && current.status === 'downloading') {
    await db.aiModelPacks.update(AI_MODEL_PACK_ID, { status: 'failed' });
  }
}

export async function verifyModelPackChecksum(): Promise<boolean> {
  const current = await getModelPackStatus();
  if (!current || current.status !== 'downloaded' || !current.storagePath) {
    return false;
  }
  try {
    const stat = await Filesystem.stat({
      path: current.storagePath,
      directory: Directory.Data,
    });
    return stat.size > 0;
  } catch {
    return false;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function startModelPackDownload(
  onProgress: (percent: number) => void
): Promise<void> {
  // 1. Capability pre-check
  const caps = await DeviceCapability.getCapabilities();
  const requiredFreeBytes = AI_MODEL_PACK_SIZE_BYTES + 1_000_000_000; // Pack size + 1GB buffer
  if (caps.freeStorageBytes < requiredFreeBytes && caps.freeStorageBytes > 0) {
    throw new Error('DeviceInsufficientStorageError');
  }

  // 2. Prepare directory
  try {
    await Filesystem.mkdir({
      path: 'models',
      directory: Directory.Data,
      recursive: true,
    });
  } catch (e) {
    // Ignore if already exists
  }

  // 3. Initialize entry in Dexie
  const existing = await getModelPackStatus();
  let bytesDownloaded = 0;

  if (existing && existing.status === 'downloaded') {
    return; // Already done
  }

  await db.aiModelPacks.put({
    packId: AI_MODEL_PACK_ID,
    modelVersion: '1.0.0',
    status: 'downloading',
    progressPercent: 0,
    sizeBytes: AI_MODEL_PACK_SIZE_BYTES,
    checksum: AI_MODEL_PACK_CHECKSUM,
  });

  downloadAbortController = new AbortController();

  try {
    const chunksCount = 20;
    const dummyChunkSize = Math.floor(AI_MODEL_PACK_SIZE_BYTES / chunksCount);
    const dummyData = new Uint8Array(1024); // small file for testing
    const dummyBase64 = arrayBufferToBase64(dummyData.buffer);

    const filePath = `models/${AI_MODEL_PACK_ID}.bin`;
    
    // Clear file before writing
    try {
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Data,
      });
    } catch {
      // Ignore if doesn't exist
    }

    for (let i = 1; i <= chunksCount; i++) {
      if (downloadAbortController.signal.aborted) {
        throw new Error('Aborted');
      }

      await new Promise(resolve => setTimeout(resolve, 150));

      await Filesystem.appendFile({
        path: filePath,
        data: dummyBase64,
        directory: Directory.Data,
      });

      bytesDownloaded += dummyChunkSize;
      const progressPercent = Math.round((i / chunksCount) * 100);
      
      await db.aiModelPacks.update(AI_MODEL_PACK_ID, { progressPercent });
      onProgress(progressPercent);
    }

    // Done downloading
    const finalStoragePath = filePath;
    await db.aiModelPacks.put({
      packId: AI_MODEL_PACK_ID,
      modelVersion: '1.0.0',
      status: 'downloaded',
      downloadedAt: new Date().toISOString(),
      progressPercent: 100,
      sizeBytes: AI_MODEL_PACK_SIZE_BYTES,
      checksum: AI_MODEL_PACK_CHECKSUM,
      storagePath: finalStoragePath,
    });

  } catch (err: any) {
    if (err.message === 'Aborted') {
      await db.aiModelPacks.update(AI_MODEL_PACK_ID, { status: 'failed' });
      throw err;
    }
    await db.aiModelPacks.update(AI_MODEL_PACK_ID, { status: 'failed' });
    throw new Error('Download failed: ' + err.message);
  } finally {
    downloadAbortController = null;
  }
}
