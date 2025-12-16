const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin for WindowManager Native Module
 * 
 * This plugin copies the native module files to the appropriate locations
 * in the native projects (Windows and macOS).
 * 
 * Note: This plugin requires react-native-windows and react-native-macos
 * to be properly configured in the project.
 */
const withWindowManager = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      // macOS native module setup
      const macosPath = path.join(
        config.modRequest.platformProjectRoot,
        'macos'
      );
      
      if (fs.existsSync(macosPath)) {
        const nativeModulesPath = path.join(
          config.modRequest.projectRoot,
          'native-modules',
          'macos'
        );
        
        if (fs.existsSync(nativeModulesPath)) {
          // Copy Swift file
          const swiftSource = path.join(nativeModulesPath, 'WindowManagerModule.swift');
          const swiftDest = path.join(macosPath, 'WindowManagerModule.swift');
          
          if (fs.existsSync(swiftSource)) {
            fs.copyFileSync(swiftSource, swiftDest);
            console.log('Copied WindowManagerModule.swift to macOS project');
          }
          
          // Copy Objective-C bridge file
          const mSource = path.join(nativeModulesPath, 'WindowManagerModule.m');
          const mDest = path.join(macosPath, 'WindowManagerModule.m');
          
          if (fs.existsSync(mSource)) {
            fs.copyFileSync(mSource, mDest);
            console.log('Copied WindowManagerModule.m to macOS project');
          }
        }
      }
      
      return config;
    },
  ]);
};

module.exports = withWindowManager;
