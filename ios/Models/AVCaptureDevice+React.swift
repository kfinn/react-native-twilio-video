//
//  AVCaptureDevice+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/27/20.
//

import Foundation

extension AVCaptureDevice {
    class func listCameras() -> [AVCaptureDevice] {
        return AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInWideAngleCamera], mediaType: .video, position: .unspecified).devices
    }
    
    func toReactAttributes() -> [String: Any] {
        return [
            "id": uniqueID,
            "name": localizedName,
            "position": position.toReactPosition() as Any
        ]
    }
}
