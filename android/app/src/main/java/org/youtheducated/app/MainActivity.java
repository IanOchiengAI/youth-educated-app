package org.youtheducated.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DeviceCapabilityPlugin.class);
        registerPlugin(LiteRTInferencePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
