package com.qdos.cameraapp.qrdetector;

import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;
import java.io.IOException;
import java.util.List;

/**
 * QR Detector Module
 * Native module for QR code detection using MLKit Vision
 */
public class QRDetectorModule extends ReactContextBaseJavaModule {
    private static final String TAG = "QRDetectorModule";
    private final ReactApplicationContext reactContext;
    private BarcodeScanner barcodeScanner;

    public QRDetectorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        
        // Initialize barcode scanner with QR code format
        BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .build();
        barcodeScanner = BarcodeScanning.getClient(options);
    }

    @Override
    @NonNull
    public String getName() {
        return "QRDetectorModule";
    }

    /**
     * Detect QR codes in an image
     * @param imageData Image data map containing path or base64 string
     * @param promise Promise to resolve with detection results
     */
    @ReactMethod
    public void detectQRCode(ReadableMap imageData, final Promise promise) {
        try {
            // Get image from path or base64
            InputImage image = null;
            if (imageData.hasKey("path")) {
                String path = imageData.getString("path");
                image = InputImage.fromFilePath(reactContext, android.net.Uri.parse(path));
            } else if (imageData.hasKey("base64")) {
                // Implementation for base64 images if needed
                promise.reject("INVALID_INPUT", "Base64 image processing not implemented yet");
                return;
            } else {
                promise.reject("INVALID_INPUT", "Image data must contain a valid path or base64 string");
                return;
            }

            // Process the image for QR code detection
            barcodeScanner.process(image)
                .addOnSuccessListener(barcodes -> {
                    WritableMap result = Arguments.createMap();
                    if (barcodes.size() > 0) {
                        // Get the first detected QR code
                        Barcode barcode = barcodes.get(0);
                        String qrValue = barcode.getRawValue();
                        if (qrValue != null) {
                            result.putString("qrCode", qrValue);
                            result.putBoolean("success", true);
                            promise.resolve(result);
                        } else {
                            result.putBoolean("success", false);
                            result.putString("error", "QR code detected but value is null");
                            promise.resolve(result);
                        }
                    } else {
                        result.putBoolean("success", false);
                        result.putString("error", "No QR code found in image");
                        promise.resolve(result);
                    }
                })
                .addOnFailureListener(e -> {
                    promise.reject("DETECTION_ERROR", "Failed to process image: " + e.getMessage(), e);
                });
        } catch (IOException e) {
            promise.reject("IO_ERROR", "Failed to read image: " + e.getMessage(), e);
        } catch (Exception e) {
            promise.reject("UNKNOWN_ERROR", "An unexpected error occurred: " + e.getMessage(), e);
        }
    }

    /**
     * Cleanup resources when module is destroyed
     */
    @Override
    public void onCatalystInstanceDestroy() {
        if (barcodeScanner != null) {
            barcodeScanner.close();
            barcodeScanner = null;
        }
        super.onCatalystInstanceDestroy();
    }
}