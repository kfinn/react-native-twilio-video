//
//  RemoteVideoTrack.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/2/20.
//

import Foundation

@objc(RemoteVideoTrackViewManager)
class RemoteVideoTrackViewManager: RCTViewManager {
    override func view() -> UIView! {
        print("RemoteVideoTrackViewManager#view")
        let view = RemoteVideoTrackView()
        view.bridge = self.bridge
        return view
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
}
