# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep React Native Exceptions
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

-keep @com.facebook.react.bridge.ReactMethod class *
-keepclassmembers class *$ReactModuleSpec {
    <methods>;
}

# Vision Camera Rules
-keep class com.mrousavy.camera.** {
    *;
}
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.tasks.** { *; }

# Rive Animation rules
-keep class app.rive.runtime.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }