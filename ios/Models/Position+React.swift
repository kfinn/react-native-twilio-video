//
//  Position+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/27/20.
//

import Foundation

extension AVCaptureDevice.Position {
    func toReactPosition() -> String? {
        switch self {
        case .front:
            return "front"
        case .back:
            return "back"
        case .unspecified:
            return nil
        }
    }
}
