#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>

@interface RCT_EXTERN_MODULE(WindowManagerModule, NSObject)

RCT_EXTERN_METHOD(setAlwaysOnTop:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(bringToFront:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
