//
//  LocalVideoTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/1/20.
//

import Foundation

enum LocalVideoTrackCreateError : Error {
    case unableToCreateCameraSource
}

struct LocalVideoTrackCreateVideoSourceParams: Codable {
    let enablePreview: Bool?
    
    func toSource() throws -> VideoSource {
        let options = CameraSourceOptions() { (builder) in
            if let enablePreview = enablePreview {
                builder.enablePreview = enablePreview
            }
        }
        
        if let cameraSource = CameraSource(options: options, delegate: nil) {
            return cameraSource
        } else {
            throw LocalVideoTrackCreateError.unableToCreateCameraSource
        }
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

struct LocalVideoTrackUpdateParams: Codable {
    let enabled: Bool?
}

enum LocalVideoTrackDestroyError : Error {
    case unableToStopCapture
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
    
    func updateFromReact(params: LocalVideoTrackUpdateParams) {
        if let enabled = params.enabled {
            self.isEnabled = enabled
        }
    }
    
    func destroyFromReact(completion: @escaping CameraSource.StoppedBlock) {
        isEnabled = false
        if let cameraSource = source as? CameraSource {
            cameraSource.stopCapture(completion: completion)
        } else {
            completion(LocalVideoTrackDestroyError.unableToStopCapture)
        }
    }
}
