using Microsoft.ReactNative;
using System;
using System.Runtime.InteropServices;
using Windows.UI.Core;
using Windows.UI.Xaml;

namespace AnyVoice.NativeModules
{
    [ReactModule("WindowManagerModule")]
    internal sealed class WindowManagerModule
    {
        // Win32 API imports
        [DllImport("user32.dll")]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        // Constants for SetWindowPos
        private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
        private static readonly IntPtr HWND_NOTOPMOST = new IntPtr(-2);
        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_SHOWWINDOW = 0x0040;

        [ReactMethod("setAlwaysOnTop")]
        public void SetAlwaysOnTop(bool enabled, IReactPromise<bool> promise)
        {
            try
            {
                var dispatcher = CoreApplication.MainView?.CoreWindow?.Dispatcher;
                if (dispatcher == null)
                {
                    promise.Reject(new ReactError { Code = "WINDOW_NOT_FOUND", Message = "Main window not found" });
                    return;
                }

                dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    try
                    {
                        // Get the window handle
                        var coreWindow = CoreWindow.GetForCurrentThread();
                        if (coreWindow == null)
                        {
                            promise.Reject(new ReactError { Code = "WINDOW_NOT_FOUND", Message = "CoreWindow not found" });
                            return;
                        }

                        // Get the window handle (HWND)
                        var windowId = coreWindow.GetWindowId();
                        var hwnd = GetWindowHandle(windowId);

                        if (hwnd == IntPtr.Zero)
                        {
                            promise.Reject(new ReactError { Code = "WINDOW_HANDLE_ERROR", Message = "Failed to get window handle" });
                            return;
                        }

                        // Set window position
                        IntPtr hWndInsertAfter = enabled ? HWND_TOPMOST : HWND_NOTOPMOST;
                        bool result = SetWindowPos(hwnd, hWndInsertAfter, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);

                        if (result)
                        {
                            promise.Resolve(true);
                        }
                        else
                        {
                            promise.Reject(new ReactError { Code = "SET_WINDOW_POS_FAILED", Message = "SetWindowPos failed" });
                        }
                    }
                    catch (Exception ex)
                    {
                        promise.Reject(new ReactError { Code = "EXCEPTION", Message = ex.Message });
                    }
                });
            }
            catch (Exception ex)
            {
                promise.Reject(new ReactError { Code = "EXCEPTION", Message = ex.Message });
            }
        }

        [ReactMethod("bringToFront")]
        public void BringToFront(IReactPromise<bool> promise)
        {
            try
            {
                var dispatcher = CoreApplication.MainView?.CoreWindow?.Dispatcher;
                if (dispatcher == null)
                {
                    promise.Reject(new ReactError { Code = "WINDOW_NOT_FOUND", Message = "Main window not found" });
                    return;
                }

                dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    try
                    {
                        var coreWindow = CoreWindow.GetForCurrentThread();
                        if (coreWindow == null)
                        {
                            promise.Reject(new ReactError { Code = "WINDOW_NOT_FOUND", Message = "CoreWindow not found" });
                            return;
                        }

                        var windowId = coreWindow.GetWindowId();
                        var hwnd = GetWindowHandle(windowId);

                        if (hwnd == IntPtr.Zero)
                        {
                            promise.Reject(new ReactError { Code = "WINDOW_HANDLE_ERROR", Message = "Failed to get window handle" });
                            return;
                        }

                        bool result = SetForegroundWindow(hwnd);
                        promise.Resolve(result);
                    }
                    catch (Exception ex)
                    {
                        promise.Reject(new ReactError { Code = "EXCEPTION", Message = ex.Message });
                    }
                });
            }
            catch (Exception ex)
            {
                promise.Reject(new ReactError { Code = "EXCEPTION", Message = ex.Message });
            }
        }

        private IntPtr GetWindowHandle(Windows.UI.WindowId windowId)
        {
            try
            {
                // Method 1: Try to get handle from AppWindow (Windows App SDK / WinUI 3)
                try
                {
                    var appWindow = Windows.UI.WindowManagement.AppWindow.GetFromWindowId(windowId);
                    if (appWindow != null)
                    {
                        // For WinUI 3, use IWindowNative interface
                        var windowInterop = appWindow as IWindowNative;
                        if (windowInterop != null)
                        {
                            return windowInterop.WindowHandle;
                        }
                    }
                }
                catch
                {
                    // AppWindow approach failed, try next method
                }

                // Method 2: For UWP, use CoreWindow interop
                try
                {
                    var coreWindow = CoreWindow.GetForCurrentThread();
                    if (coreWindow != null)
                    {
                        // Use IWindowNative interface if available
                        var windowInterop = coreWindow as IWindowNative;
                        if (windowInterop != null)
                        {
                            return windowInterop.WindowHandle;
                        }
                    }
                }
                catch
                {
                    // CoreWindow approach failed
                }

                // Method 3: Try to get handle from window ID value directly
                // This is a fallback that may work in some scenarios
                var windowIdValue = windowId.Value;
                if (windowIdValue != 0)
                {
                    // In some cases, the window ID value itself can be used as a handle
                    // This is platform-specific and may need adjustment
                    return new IntPtr((long)windowIdValue);
                }

                return IntPtr.Zero;
            }
            catch
            {
                return IntPtr.Zero;
            }
        }
    }

    // Interface for getting window handle (may need adjustment based on framework version)
    [ComImport]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    [Guid("EECDBF0E-BAE9-4CB6-A68E-9598E1CB57BB")]
    internal interface IWindowNative
    {
        IntPtr WindowHandle { get; }
    }
}
