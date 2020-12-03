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
            "networkQualityLevel": networkQualityLevel.toReactNetworkQualityLevel(),
            "remoteAudioTracks": remoteAudioTracks.map { $0.toReactAttributes() },
            "remoteVideoTracks": remoteVideoTracks.map { $0.toReactAttributes() },
            "remoteDataTracks": remoteDataTracks.map { $0.toReactAttributes() },
        ]
    }
}
