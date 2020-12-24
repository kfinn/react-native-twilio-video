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
    
    func toSource() throws -> CameraSource {
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

struct VideoFormatDimensionsCreateParams: Codable {
    let width: Int32
    let height: Int32
    
    func toDimensions() -> CMVideoDimensions {
        return CMVideoDimensions(
            width: width,
            height: height
        )
    }
}

struct VideoFormatCreateParams: Codable {
    let dimensions: VideoFormatDimensionsCreateParams
    let framerate: UInt
    
    func toCaptureFormat(captureDevice: AVCaptureDevice) -> VideoFormat {
        let maybeSupportedFormats = CameraSource.supportedFormats(captureDevice: captureDevice)
        let supportedFormats = maybeSupportedFormats.compactMap { $0 as? VideoFormat }.filter { $0.pixelFormat == .formatYUV420BiPlanarFullRange }
        let nearestFormat = supportedFormats.first { $0.dimensions.width >= dimensions.width && $0.dimensions.height > dimensions.height }
        
        let captureFormat = nearestFormat ?? supportedFormats.last!
        captureFormat.frameRate = framerate
        
        return captureFormat
    }
    
    func toOutputFormat() -> VideoFormat {
        let videoFormat = VideoFormat()
        videoFormat.dimensions = dimensions.toDimensions()
        videoFormat.frameRate = framerate
        videoFormat.pixelFormat = PixelFormat.formatYUV420BiPlanarFullRange
        return videoFormat
    }
}

struct LocalVideoTrackCreateParams: Codable {
    let source: LocalVideoTrackCreateVideoSourceParams?
    let format: VideoFormatCreateParams?
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
    
    class func createFromReact(params: LocalVideoTrackCreateParams, completion: @escaping (_ localVideoTrack: LocalVideoTrack?, _ error: Error?) -> Void) {
        do {
            let source = try (params.source ?? kDefaultLocalVideoTrackCreateVideoSourceParams).toSource()
            let localVideoTrack = LocalVideoTrack(
                source: source,
                enabled: params.enabled ?? true,
                name: params.name
            )!
            
            let device = CameraSource.captureDevice(position: .front)!
            
            let innerCompletion = { (device: AVCaptureDevice?, format: VideoFormat, error: Error?) in
                completion(localVideoTrack, error)
            }
            
            if let format = params.format {
                source.requestOutputFormat(format.toOutputFormat())
                source.startCapture(device: device, format: format.toCaptureFormat(captureDevice: device), completion: innerCompletion)
            } else {
                source.startCapture(
                    device: device,
                    completion: innerCompletion
                )
            }
        } catch {
            completion(nil, error)
        }
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
