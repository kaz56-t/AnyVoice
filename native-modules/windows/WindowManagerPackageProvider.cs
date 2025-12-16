using Microsoft.ReactNative;

namespace AnyVoice.NativeModules
{
    /// <summary>
    /// WindowManagerModuleをReact Nativeパッケージに登録するためのプロバイダー
    /// </summary>
    public class WindowManagerPackageProvider : IReactPackageProvider
    {
        public void CreatePackage(IReactPackageBuilder packageBuilder)
        {
            packageBuilder.AddModule("WindowManagerModule", () => new WindowManagerModule());
        }
    }
}
