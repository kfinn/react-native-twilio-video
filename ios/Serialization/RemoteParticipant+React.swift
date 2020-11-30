//
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/29/20.
//

import Foundation

extension RemoteParticipant {
    func toReactAttributes() -> [String: Any] {
        return [
            "connected": isConnected,
            "identity": identity,
            "sid": sid!,
            "networkQualityLevel": networkQualityLevel.toReactNetworkQualityLevel()
        ]
    }
}
