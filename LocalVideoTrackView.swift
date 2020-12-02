//
//  LocalVideoTrackView.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/2/20.
//

import Foundation

class LocalVideoTrackView : UIView {
    weak var bridge: RCTBridge?
    
    @objc var name: String? {
        didSet {
            if let name = name {
                if let twilioVideo = bridge?.module(forName: "TwilioVideo", lazilyLoadIfNecessary: true) as? TwilioVideo {
                    self.localVideoTrack = twilioVideo.findLocalVideoTrack(name: name)
                }
            } else {
                localVideoTrack = nil
            }
        }
    }
    
    var localVideoTrack: LocalVideoTrack? {
        didSet {
            if let oldValue = oldValue {
                oldValue.removeRenderer(videoView)
            }
            if let newValue = localVideoTrack {
                newValue.addRenderer(videoView)
            }
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