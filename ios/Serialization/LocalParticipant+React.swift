//
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/29/20.
//

import Foundation

extension LocalParticipant {
    func toReactAttributes() -> [String: Any] {
        return [
            "identity": identity,
            "sid": sid!,
            "networkQualityLevel": networkQualityLevel.toReactNetworkQualityLevel()
        ]
    }
}
