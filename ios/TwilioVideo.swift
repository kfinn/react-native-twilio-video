@objc(TwilioVideo)
class TwilioVideo: RCTEventEmitter, RoomDelegate, RemoteParticipantDelegate {
    var roomsBySid = [String: Room]()

    var isObserving: Bool = false
    
    @objc(connect:withOptions:resolver:rejecter:)
    func connect(
        token: String,
        options: [String: Any],
        resolve: RCTPromiseResolveBlock,
        reject: RCTPromiseRejectBlock
    ) {
        let twilioOptions = ConnectOptions.init(token: token) { (builder) in
//            if (options.keys.contains("audioTracks")) {
//                builder.audioTracks
//            }
//            if (options.keys.contains("automaticSubscriptionEnabled")) {
//                builder.automaticSubscriptionEnabled = options["automaticSubscriptionEnabled"]
//            }
//            if (options.keys.contains("dataTracks")) {
//                builder.dataTracks
//            }
//            builder.delegateQueue
//            if (options.keys.contains("dominantSpeakerEnabled")) {
//                builder.dominantSpeakerEnabled = options["dominantSpeakerEnabled"]
//            }
//            if (options.keys.contains("encodingParameters")) {
//                builder.encodingParameters
//            }
//            if (options.keys.contains("iceOptions")) {
//                builder.iceOptions
//            }
//            if (options.keys.contains("insightsEnabled")) {
//                builder.insightsEnabled
//            }
//            if (options.keys.contains("networkPrivacyPolicy")) {
//                builder.networkPrivacyPolicy
//            }
//            if (options.keys.contains("networkQualityEnabled")) {
//                builder.networkQualityEnabled
//            }
//            if (options.keys.contains("networkQualityConfiguration")) {
//                builder.networkQualityConfiguration
//            }
//            if (options.keys.contains("preferredAudioCodecs")) {
//                builder.preferredAudioCodecs
//            }
//            if (options.keys.contains("preferredVideoCodecs")) {
//                builder.preferredVideoCodecs
//            }
//            if (options.keys.contains("region")) {
//                builder.region
//            }
           if (options.keys.contains("roomName")) {
               builder.roomName = options["roomName"] as? String
           }
//            if (options.keys.contains("videoTracks")) {
//                builder.videoTracks
//            }
//            if (options.keys.contains("bandwidthProfileOptions")) {
//                builder.bandwidthProfileOptions
//            }
        }
        
        let room = TwilioVideoSDK.connect(options: twilioOptions, delegate: self)
        roomsBySid[room.sid] = room
        resolve(room.toReactAttributes())
    }
    
    @objc(disconnect:resolver:rejecter:)
    func disconnect(sid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let maybeRoom = roomsBySid[sid]
        if let room = maybeRoom {
            room.disconnect()
            roomsBySid.removeValue(forKey: sid)
            resolve(true)
        } else {
            reject("404", "Room not found", nil)
        }
    }
    
    override func supportedEvents() -> [String] {
        return [
            "Room.connected",
            "Room.failedToConnect",
            "Room.disconnected",
            "Room.reconnecting",
            "Room.reconnected",
            "Room.participantConnected",
            "Room.participantDisconnected",
            "Room.recordingStarted",
            "Room.recordingStopped",
            "Room.dominantSpeakerChanged",

            "RemoteParticipant.audioTrackDisabled",
            "RemoteParticipant.audioTrackEnabled",
            "RemoteParticipant.audioTrackPublished",
            "RemoteParticipant.audioTrackPublishPriorityChanged",
            "RemoteParticipant.audioTrackSubscribed",
            "RemoteParticipant.audioTrackSubscriptionFailed",
            "RemoteParticipant.audioTrackUnpublished",
            "RemoteParticipant.audioTrackUnsubscribed",
            "RemoteParticipant.dataTrackPublished",
            "RemoteParticipant.dataTrackPublishPriorityChanged",
            "RemoteParticipant.dataTrackSubscribed",
            "RemoteParticipant.dataTrackSubscriptionFailed",
            "RemoteParticipant.dataTrackUnpublished",
            "RemoteParticipant.dataTrackUnsubscribed",
            "RemoteParticipant.networkQualityLevelChanged",
            "RemoteParticipant.videoTrackDisabled",
            "RemoteParticipant.videoTrackEnabled",
            "RemoteParticipant.videoTrackPublished",
            "RemoteParticipant.videoTrackPublishPriorityChanged",
            "RemoteParticipant.videoTrackSubscribed",
            "RemoteParticipant.videoTrackSubscriptionFailed",
            "RemoteParticipant.videoTrackSwitchedOff",
            "RemoteParticipant.videoTrackSwitchedOn",
            "RemoteParticipant.videoTrackUnpublished",
            "RemoteParticipant.videoTrackUnsubscribed"
        ]
    }
    
    override func startObserving() {
        super.startObserving()
        isObserving = true
    }
    
    override func stopObserving() {
        super.stopObserving()
        isObserving = false
    }
    
    func roomDidConnect(room: Room) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.connected",
            body: [ "room": room.toReactAttributes() ]
        )
    }
    
    func roomDidFailToConnect(room: Room, error: Error) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.failedToConnect",
            body: [ "room": room.toReactAttributes(), "error": error.localizedDescription ]
        )
    }
    
    func roomDidDisconnect(room: Room, error: Error?) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.disconnected",
            body: [ "room": room.toReactAttributes(), "error": error?.localizedDescription as Any ]
        )
    }
    
    func roomIsReconnecting(room: Room, error: Error) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.reconnecting",
            body: [ "room": room.toReactAttributes(), "error": error.localizedDescription ]
        )
    }
    
    func roomDidReconnect(room: Room) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.reconnected",
            body: [ "room": room.toReactAttributes() ]
        )
    }
    
    func participantDidConnect(room: Room, participant: RemoteParticipant) {
        participant.delegate = self
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.participantConnected",
            body: [
                "room": room.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func participantDidDisconnect(room: Room, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.participantDisconnected",
            body: [
                "room": room.toReactAttributes(),
                "participant": room.toReactAttributes()
            ]
        )
    }
    
    func roomDidStartRecording(room: Room) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.recordingStarted",
            body: [ "room": room.toReactAttributes() ]
        )
    }
    
    func roomDidStopRecording(room: Room) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.recordingStopped",
            body: [ "room": room.toReactAttributes() ]
        )
    }
    
    func dominantSpeakerDidChange(room: Room, participant: RemoteParticipant?) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "Room.dominantSpeakerChanged",
            body: [
                "room": room.toReactAttributes(),
                "participant": participant?.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidPublishVideoTrack(participant: RemoteParticipant, publication: RemoteVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidUnpublishVideoTrack(participant: RemoteParticipant, publication: RemoteVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackUnpublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidPublishAudioTrack(participant: RemoteParticipant, publication: RemoteAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidUnpublishAudioTrack(participant: RemoteParticipant, publication: RemoteAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackUnpublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidPublishDataTrack(participant: RemoteParticipant, publication: RemoteDataTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidUnpublishDataTrack(participant: RemoteParticipant, publication: RemoteDataTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackUnpublished",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidEnableVideoTrack(participant: RemoteParticipant, publication: RemoteVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackEnabled",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidDisableVideoTrack(participant: RemoteParticipant, publication: RemoteVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackDisabled",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidEnableAudioTrack(participant: RemoteParticipant, publication: RemoteAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackEnabled",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidDisableAudioTrack(participant: RemoteParticipant, publication: RemoteAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackDisabled",
            body: [
                "participant": participant.toReactAttributes(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func didSubscribeToVideoTrack(videoTrack: RemoteVideoTrack, publication: RemoteVideoTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackSubscribed",
            body: [
                "videoTrack": videoTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didFailToSubscribeToVideoTrack(publication: RemoteVideoTrackPublication, error: Error, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackSubscriptionFailed",
            body: [
                "publication": publication.toReactAttributes(),
                "error": error.localizedDescription,
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didUnsubscribeFromVideoTrack(videoTrack: RemoteVideoTrack, publication: RemoteVideoTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackUnsubscribed",
            body: [
                "videoTrack": videoTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didSubscribeToAudioTrack(audioTrack: RemoteAudioTrack, publication: RemoteAudioTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackSubscribed",
            body: [
                "audioTrack": audioTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didFailToSubscribeToAudioTrack(publication: RemoteAudioTrackPublication, error: Error, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackSubscriptionFailed",
            body: [
                "publication": publication.toReactAttributes(),
                "error": error.localizedDescription,
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didUnsubscribeFromAudioTrack(audioTrack: RemoteAudioTrack, publication: RemoteAudioTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackUnsubscribed",
            body: [
                "audioTrack": audioTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didSubscribeToDataTrack(dataTrack: RemoteDataTrack, publication: RemoteDataTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackSubscribed",
            body: [
                "dataTrack": dataTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didFailToSubscribeToDataTrack(publication: RemoteDataTrackPublication, error: Error, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackSubscriptionFailed",
            body: [
                "publication": publication.toReactAttributes(),
                "error": error.localizedDescription,
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func didUnsubscribeFromDataTrack(dataTrack: RemoteDataTrack, publication: RemoteDataTrackPublication, participant: RemoteParticipant) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackUnsubscribed",
            body: [
                "dataTrack": dataTrack.toReactAttributes(),
                "publication": publication.toReactAttributes(),
                "participant": participant.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantNetworkQualityLevelDidChange(participant: RemoteParticipant, networkQualityLevel: NetworkQualityLevel) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.networkQualityLevelChanged",
            body: [
                "participant": participant.toReactAttributes(),
                "networkQualityLevel": networkQualityLevel.toReactNetworkQualityLevel()
            ]
        )
    }
    
    func remoteParticipantSwitchedOffVideoTrack(participant: RemoteParticipant, track: RemoteVideoTrack) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackSwitchedOff",
            body: [
                "participant": participant.toReactAttributes(),
                "track": track.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantSwitchedOnVideoTrack(participant: RemoteParticipant, track: RemoteVideoTrack) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackSwitchedOn",
            body: [
                "participant": participant.toReactAttributes(),
                "track": track.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidChangeAudioTrackPublishPriority(participant: RemoteParticipant, priority: Track.Priority, publication: RemoteAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.audioTrackPublishPriorityChanged",
            body: [
                "participant": participant.toReactAttributes(),
                "priority": priority.toReactTrackPriority(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidChangeVideoTrackPublishPriority(participant: RemoteParticipant, priority: Track.Priority, publication: RemoteVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.videoTrackPublishPriorityChanged",
            body: [
                "participant": participant.toReactAttributes(),
                "priority": priority.toReactTrackPriority(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
    
    func remoteParticipantDidChangeDataTrackPublishPriority(participant: RemoteParticipant, priority: Track.Priority, publication: RemoteDataTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "RemoteParticipant.dataTrackPublishPriorityChanged",
            body: [
                "participant": participant.toReactAttributes(),
                "priority": priority.toReactTrackPriority(),
                "publication": publication.toReactAttributes()
            ]
        )
    }
}
