#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(LocalVideoTrackViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(name, NSString *)
RCT_EXPORT_VIEW_PROPERTY(scaleType, NSString *)
RCT_EXPORT_VIEW_PROPERTY(mirror, BOOL)

@end
