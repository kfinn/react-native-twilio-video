#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TwilioVideo, NSObject)

RCT_EXTERN_METHOD(connect:(NSString *)token
                  withOptions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disconnect:(NSString *)sid
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setRemoteAudioTrackEnabled:(BOOL)enabled
                  sid:(NSString *)sid
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
