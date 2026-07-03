package org.youtheducated.app;

import android.app.ActivityManager;
import android.content.Context;
import android.os.Build;
import android.os.StatFs;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "DeviceCapability")
public class DeviceCapabilityPlugin extends Plugin {

    @PluginMethod
    public void getCapabilities(PluginCall call) {
        JSObject result = new JSObject();
        Context ctx = getContext();

        // Memory class (in MB)
        ActivityManager am = (ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
        if (am != null) {
            result.put("memoryClassMB", am.getMemoryClass());
            result.put("largeMemoryClassMB", am.getLargeMemoryClass());
        } else {
            result.put("memoryClassMB", 0);
            result.put("largeMemoryClassMB", 0);
        }

        // Android SDK version
        result.put("androidSdkVersion", Build.VERSION.SDK_INT);

        // Free internal storage in bytes
        try {
            StatFs stat = new StatFs(ctx.getFilesDir().getPath());
            long freeBytes = stat.getAvailableBlocksLong() * stat.getBlockSizeLong();
            result.put("freeStorageBytes", freeBytes);
        } catch (Exception e) {
            result.put("freeStorageBytes", 0L);
        }

        // AICore availability check
        boolean hasAICore = false;
        if (Build.VERSION.SDK_INT >= 34) {
            try {
                ctx.getPackageManager().getPackageInfo("com.google.android.aicore", 0);
                hasAICore = true;
            } catch (Exception e) {
                hasAICore = false;
            }
        }
        result.put("isAICoreAvailable", hasAICore);

        call.resolve(result);
    }
}
