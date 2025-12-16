import Foundation
import AppKit
import React

@objc(WindowManagerModule)
class WindowManagerModule: NSObject {
    
    @objc
    func setAlwaysOnTop(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = NSApplication.shared.mainWindow else {
                // If main window is not available, try to get any key window
                if let keyWindow = NSApplication.shared.keyWindow {
                    self.setWindowLevel(keyWindow, enabled: enabled, resolver: resolver, rejecter: rejecter)
                } else {
                    // Try to get the first window
                    if let firstWindow = NSApplication.shared.windows.first {
                        self.setWindowLevel(firstWindow, enabled: enabled, resolver: resolver, rejecter: rejecter)
                    } else {
                        rejecter("WINDOW_NOT_FOUND", "No window found", nil)
                    }
                }
                return
            }
            
            self.setWindowLevel(window, enabled: enabled, resolver: resolver, rejecter: rejecter)
        }
    }
    
    private func setWindowLevel(_ window: NSWindow, enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        if enabled {
            // Set window level to floating to keep it on top
            // NSWindow.Level.floating keeps the window above normal windows
            // but below modal panels and system windows
            window.level = .floating
            
            // Alternative: Use .modalPanel for stronger "always on top" behavior
            // window.level = .modalPanel
            
            // Make sure the window is visible
            window.orderFront(nil)
        } else {
            // Reset to normal window level
            window.level = .normal
        }
        
        resolver(true)
    }
    
    @objc
    func bringToFront(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = NSApplication.shared.mainWindow else {
                if let keyWindow = NSApplication.shared.keyWindow {
                    keyWindow.makeKeyAndOrderFront(nil)
                    resolver(true)
                } else if let firstWindow = NSApplication.shared.windows.first {
                    firstWindow.makeKeyAndOrderFront(nil)
                    resolver(true)
                } else {
                    rejecter("WINDOW_NOT_FOUND", "No window found", nil)
                }
                return
            }
            
            window.makeKeyAndOrderFront(nil)
            NSApplication.shared.activate(ignoringOtherApps: true)
            resolver(true)
        }
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
