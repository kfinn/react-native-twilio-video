//
//  LocalVideoTrackViewManager.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/2/20.
//

import Foundation

@objc(LocalVideoTrackViewManager)
class LocalVideoTrackViewManager: RCTViewManager {
    override func view() -> UIView! {
        let view = LocalVideoTrackView()
        view.bridge = self.bridge
        return view
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
}
