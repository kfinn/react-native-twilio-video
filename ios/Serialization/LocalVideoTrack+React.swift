//
//  LocalVideoTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/1/20.
//

import Foundation

struct LocalVideoTrackCreateVideoSourceParams: Codable {
    let enablePreview: Bool?
    
    func toSource() throws -> VideoSource {
        let options = CameraSourceOptions() { (builder) in
            if let enablePreview = enablePreview {
                builder.enablePreview = enablePreview
            }
        }
        
        return CameraSource(options: options, delegate: nil)!
    }
}

let kDefaultLocalVideoTrackCreateVideoSourceParams = LocalVideoTrackCreateVideoSourceParams(
    enablePreview: true
)


struct LocalVideoTrackCreateParams: Codable {
    let source: LocalVideoTrackCreateVideoSourceParams?
    let enabled: Bool?
    let name: String?
    
    var isEmpty: Bool {
        return true
    }
}

extension LocalVideoTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
    
    class func createFromReact(params: LocalVideoTrackCreateParams) throws -> LocalVideoTrack? {
        return LocalVideoTrack(
            source: try (params.source ?? kDefaultLocalVideoTrackCreateVideoSourceParams).toSource(),
            enabled: params.enabled ?? true,
            name: params.name
        )
    }
}
