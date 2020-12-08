//
//  ContentMode+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/7/20.
//

import UIKit

extension UIView.ContentMode {
    static func fromReactScaleType(_ reactScaleType: String) -> UIView.ContentMode? {
        switch reactScaleType {
        case "aspectFill":
            return .scaleAspectFill
        case "aspectFit":
            return .scaleAspectFit
        default:
            return nil
        }
    }
}
