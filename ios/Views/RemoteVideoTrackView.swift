//
//  RemoteVideoTrackView.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/2/20.
//

import Foundation

class RemoteVideoTrackView : UIView {
    weak var bridge: RCTBridge?
    
    @objc var sid: String? {
        didSet {
            if let sid = sid {
                if let twilioVideo = bridge?.module(forName: "TwilioVideo", lazilyLoadIfNecessary: true) as? TwilioVideo {
                    self.remoteVideoTrack = twilioVideo.findRemoteVideoTrack(sid: sid)
                }
            } else {
                remoteVideoTrack = nil
            }
        }
    }

    var remoteVideoTrack: RemoteVideoTrack? {
        didSet {
            if oldValue != remoteVideoTrack {
                oldValue?.removeRenderer(videoView)
                remoteVideoTrack?.addRenderer(videoView)
                videoView.shouldMirror = mirror
            }
        }
    }
    
    @objc var scaleType: String? {
        didSet {
            if let scaleType = scaleType,
               let contentMode = UIView.ContentMode.fromReactScaleType(scaleType) {
                videoView.contentMode = contentMode
            } else {
                videoView.contentMode = .scaleAspectFit
            }
        }
    }

    @objc var mirror: Bool = false {
        didSet {
            videoView.shouldMirror = mirror
        }
    }

    lazy var videoView: VideoView = {
        let videoView = VideoView()
        videoView.autoresizingMask = [AutoresizingMask.flexibleWidth, AutoresizingMask.flexibleHeight]
        return videoView
    }()
    
    init() {
        super.init(frame: CGRect.zero)
        addSubview(videoView)
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        addSubview(videoView)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
