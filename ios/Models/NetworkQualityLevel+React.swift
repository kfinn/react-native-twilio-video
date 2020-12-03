//
//  NetworkQualityLevel+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension NetworkQualityLevel {
    func toReactNetworkQualityLevel() -> String {
        switch self {
        case .unknown:
            return "unknown"
        case .zero:
            return "zero"
        case .one:
            return "one"
        case .two:
            return "two"
        case .three:
            return "three"
        case .four:
            return "four"
        case .five:
            return "five"
        @unknown default:
            return "unknown"
        }
    }
}
