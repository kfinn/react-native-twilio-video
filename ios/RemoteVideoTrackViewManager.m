#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RemoteVideoTrackViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(sid, NSString *)
RCT_EXPORT_VIEW_PROPERTY(scaleType, NSString *)

@end
