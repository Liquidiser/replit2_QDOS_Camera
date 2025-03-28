/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.qdos.cameraapp;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

/**
 * Class responsible for loading Flipper inside your React Native application.
 * This is the release version which does nothing as Flipper is only enabled for debug builds.
 */
public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    // Do nothing as we don't want to initialize Flipper in release mode
  }
}