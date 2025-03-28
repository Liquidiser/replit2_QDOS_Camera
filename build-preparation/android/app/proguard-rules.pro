# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep React Native related classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep QRDetector related classes
-keep class com.qdos.cameraapp.qrdetector.** { *; }

# Keep camera related libraries
-keep class androidx.camera.** { *; }

# Keep MLKit related classes
-keep class com.google.mlkit.** { *; }

# Keep Rive related classes
-keep class app.rive.** { *; }

# If you keep the line number information, uncomment this to
# hide the original source file name.
-keepattributes SourceFile,LineNumberTable