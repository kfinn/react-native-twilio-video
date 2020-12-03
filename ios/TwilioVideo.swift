import DictionaryCoding

@objc(TwilioVideo)
class TwilioVideo: RCTEventEmitter, RoomDelegate, RemoteParticipantDelegate, LocalParticipantDelegate {
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }

    var rooms = [Room]()
    var localParticipants: [LocalParticipant] {
        get {
            return rooms.compactMap { $0.localParticipant }
        }
    }
    var remoteParticipants: [RemoteParticipant] {
        get {
            return rooms.flatMap { $0.remoteParticipants }
        }
    }
    var remoteAudioTrackPublications: [RemoteAudioTrackPublication] {
        get {
            return remoteParticipants.flatMap { $0.remoteAudioTracks }
        }
    }
    var remoteAudioTracks: [RemoteAudioTrack] {
        get {
            return remoteAudioTrackPublications.compactMap { $0.remoteTrack }
        }
    }
    var remoteVideoTrackPublications: [RemoteVideoTrackPublication] {
        get {
            return remoteParticipants.flatMap { $0.remoteVideoTracks }
        }
    }
    var remoteVideoTracks: [RemoteVideoTrack] {
        get {
            return remoteVideoTrackPublications.compactMap { $0.remoteTrack }
        }
    }
    
    var localAudioTracksByName = [String: LocalAudioTrack]()
    var localVideoTracksByName = [String: LocalVideoTrack]()

    private func findRoom(sid: String) -> Room? {
        return rooms.first { $0.sid == sid }
    }
    
    private func findLocalParticipant(sid: String) -> LocalParticipant? {
        return localParticipants.first { $0.sid == sid }
    }
    
    private func findLocalAudioTrack(name: String) -> LocalAudioTrack? {
        return localAudioTracksByName[name]
    }
    
    func findLocalVideoTrack(name: String) -> LocalVideoTrack? {
        return localVideoTracksByName[name]
    }
    
    private func findRemoteAudioTrack(sid: String) -> RemoteAudioTrack? {
        return remoteAudioTracks.first { $0.sid == sid }
    }
    
    func findRemoteVideoTrack(sid: String) -> RemoteVideoTrack? {
        return remoteVideoTracks.first { $0.sid == sid }
    }
    
    var isObserving: Bool = false
    let decoder = DictionaryDecoder()
    
    @objc(connect:withOptions:resolver:rejecter:)
    func connect(
        token: String,
        options: [String: Any],
        resolve: RCTPromiseResolveBlock,
        reject: RCTPromiseRejectBlock
    ) {
        let twilioOptions = ConnectOptions(token: token) { (builder) in
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
        rooms.append(room)
        resolve(room.toReactAttributes())
    }
    
    @objc(disconnect:resolver:rejecter:)
    func disconnect(sid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let maybeRoom = findRoom(sid: sid)
        if let room = maybeRoom {
            room.disconnect()
            rooms.removeAll { $0.sid == sid }
            resolve(true)
        } else {
            reject("404", "Room not found", nil)
        }
    }
    
    @objc(updateLocalAudioTrack:params:resolver:rejecter:)
    func updateLocalAudioTrack(name: String, params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localAudioTrack = findLocalAudioTrack(name: name) {
            do {
                let localAudioTrackUpdateParams = try decoder.decode(LocalAudioTrackUpdateParams.self, from: params)
                localAudioTrack.updateFromReact(params: localAudioTrackUpdateParams)
                resolve(true)
            } catch {
                reject("422", "Unable to update local audio track", error)
            }
        } else {
            reject("404", "LocalAudioTrack not found", nil)
        }
    }
    
    @objc(updateLocalVideoTrack:params:resolver:rejecter:)
    func updateLocalVideoTrack(name: String, params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localVideoTrack = findLocalVideoTrack(name: name) {
            do {
                let localVideoTrackUpdateParams = try decoder.decode(LocalVideoTrackUpdateParams.self, from: params)
                localVideoTrack.updateFromReact(params: localVideoTrackUpdateParams)
                resolve(true)
            } catch {
                reject("422", "Unable to update local video track", error)
            }
        } else {
            reject("404", "LocalVideoTrack not found", nil)
        }
    }

    @objc(updateRemoteAudioTrack:params:resolver:rejecter:)
    func updateRemoteAudioTrack(sid: String, params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let remoteAudioTrack = findRemoteAudioTrack(sid: sid) {
            do {
                let remoteAudioTrackUpdateParams = try decoder.decode(RemoteAudioTrackUpdateParams.self, from: params)
                remoteAudioTrack.updateFromReact(params: remoteAudioTrackUpdateParams)
                resolve(true)
            } catch {
                reject("422", "Unable to update remote audio track", error)
            }
        } else {
            reject("404", "RemoteAudioTrack not found", nil)
        }
    }
    
    @objc(createLocalAudioTrack:resolver:rejecter:)
    func createLocalAudioTrack(params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let localAudioTrackCreateParams = try decoder.decode(LocalAudioTrackCreateParams.self, from: params)
            if let name = localAudioTrackCreateParams.name {
                if localAudioTracksByName.keys.contains(name) {
                    reject("422", "Duplicate track name", nil)
                    return
                }
            }
            let localAudioTrack = LocalAudioTrack.createFromReact(params: localAudioTrackCreateParams)!
            localAudioTracksByName[localAudioTrack.name] = localAudioTrack
            resolve(localAudioTrack.toReactAttributes())
        } catch {
            reject("422", "Unable to create local audio track", error)
        }
    }
    
    @objc(createLocalVideoTrack:resolver:rejecter:)
    func createLocalVideoTrack(params: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let localVideoTrackCreateParams = try decoder.decode(LocalVideoTrackCreateParams.self, from: params)
            if let name = localVideoTrackCreateParams.name {
                if localVideoTracksByName.keys.contains(name) {
                    reject("422", "Duplicate track name", nil)
                    return
                }
            }
            let localVideoTrack = try LocalVideoTrack.createFromReact(params: localVideoTrackCreateParams)!
            localVideoTracksByName[localVideoTrack.name] = localVideoTrack
            let cameraSource = localVideoTrack.source as! CameraSource
            let device = CameraSource.captureDevice(position: .front)!
            cameraSource.startCapture(device: device) { (device, format, error) in
                if let error = error {
                    reject("422", "Unable to create local video track", error)
                } else {
                    resolve(localVideoTrack.toReactAttributes())
                }
            }
        } catch {
            reject("422", "Unable to create local video track", error)
        }
    }

    @objc(destroyLocalAudioTrack:resolver:rejecter:)
    func destroyLocalAudioTrack(name: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let localAudioTrack = findLocalAudioTrack(name: name) {
            localParticipants.forEach { (localParticipant) in
                if localParticipant.localAudioTracks.contains(where: { $0.localTrack == localAudioTrack }) {
                    localParticipant.unpublishAudioTrack(localAudioTrack)
                }
            }
            localAudioTrack.destroyFromReact()
            localAudioTracksByName.removeValue(forKey: name)
            resolve(true)
        } else {
            reject("404", "Local video track not found", nil)
        }
    }

    @objc(destroyLocalVideoTrack:resolver:rejecter:)
    func destroyLocalVideoTrack(name: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let localVideoTrack = findLocalVideoTrack(name: name) {
            localParticipants.forEach { (localParticipant) in
                if localParticipant.localVideoTracks.contains(where: { $0.localTrack == localVideoTrack }) {
                    localParticipant.unpublishVideoTrack(localVideoTrack)
                }
            }

            localVideoTrack.destroyFromReact() { (error) in
                if let error = error {
                    reject("422", error.localizedDescription, error)
                } else {
                    self.localVideoTracksByName.removeValue(forKey: name)
                    resolve(true)
                }
            }
        } else {
            reject("404", "Local video track not found", nil)
        }
    }
    
    @objc(publishLocalAudioTrack:resolver:rejecter:)
    func publishLocalAudioTrack(params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localAudioTrackName = params["localAudioTrackName"] as? String,
           let localParticipandSid = params["localParticipantSid"] as? String,
           let localAudioTrack = findLocalAudioTrack(name: localAudioTrackName),
           let localParticipant = findLocalParticipant(sid: localParticipandSid) {
            resolve(localParticipant.publishAudioTrack(localAudioTrack))
        } else {
            reject("404", "Local audio track or participant not found", nil)
        }
    }

    @objc(publishLocalVideoTrack:resolver:rejecter:)
    func publishLocalVideoTrack(params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localVideoTrackName = params["localVideoTrackName"] as? String,
           let localParticipandSid = params["localParticipantSid"] as? String,
           let localVideoTrack = findLocalVideoTrack(name: localVideoTrackName),
           let localParticipant = findLocalParticipant(sid: localParticipandSid) {
            resolve(localParticipant.publishVideoTrack(localVideoTrack))
        } else {
            reject("404", "Local video track or participant not found", nil)
        }
    }
    
    @objc(unpublishLocalAudioTrack:resolver:rejecter:)
    func unpublishLocalAudioTrack(params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localAudioTrackName = params["localAudioTrackName"] as? String,
           let localParticipandSid = params["localParticipantSid"] as? String,
           let localAudioTrack = findLocalAudioTrack(name: localAudioTrackName),
           let localParticipant = findLocalParticipant(sid: localParticipandSid) {
            resolve(localParticipant.unpublishAudioTrack(localAudioTrack))
        } else {
            reject("404", "Local audio track or participant not found", nil)
        }
    }

    @objc(unpublishLocalVideoTrack:resolver:rejecter:)
    func unpublishLocalVideoTrack(params: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let localVideoTrackName = params["localVideoTrackName"] as? String,
           let localParticipandSid = params["localParticipantSid"] as? String,
           let localVideoTrack = findLocalVideoTrack(name: localVideoTrackName),
           let localParticipant = findLocalParticipant(sid: localParticipandSid) {
            resolve(localParticipant.unpublishVideoTrack(localVideoTrack))
        } else {
            reject("404", "Local video track or participant not found", nil)
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
            "RemoteParticipant.videoTrackUnsubscribed",

            "LocalParticipant.audioTrackPublicationFailed",
            "LocalParticipant.audioTrackPublished",
            "LocalParticipant.dataTrackPublicationFailed",
            "LocalParticipant.dataTrackPublished",
            "LocalParticipant.networkQualityLevelChanged",
            "LocalParticipant.videoTrackPublicationFailed",
            "LocalParticipant.videoTrackPublished"
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
        room.localParticipant!.delegate = self
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
                "priority": priority.toReactTrackPriority() as Any,
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
                "priority": priority.toReactTrackPriority() as Any,
                "publication": publication.toReactAttributes() as Any
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
                "priority": priority.toReactTrackPriority() as Any,
                "publication": publication.toReactAttributes() as Any
            ]
        )
    }
    
    func localParticipantDidPublishAudioTrack(participant: LocalParticipant, audioTrackPublication: LocalAudioTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.audioTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "audioTrackPublication": audioTrackPublication.toReactAttributes()
            ]
        )
    }
    
    func localParticipantDidFailToPublishAudioTrack(participant: LocalParticipant, audioTrack: LocalAudioTrack, error: Error) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.audioTrackPublicationFailed",
            body: [
                "participant": participant.toReactAttributes(),
                "audioTrack": audioTrack.toReactAttributes(),
                "error": error.localizedDescription
            ]
        )
    }
    
    func localParticipantDidPublishDataTrack(participant: LocalParticipant, dataTrackPublication: LocalDataTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.dataTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "dataTrackPublication": dataTrackPublication.toReactAttributes()
            ]
        )
    }
    
    func localParticipantDidFailToPublishDataTrack(participant: LocalParticipant, dataTrack: LocalDataTrack, error: Error) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.dataTrackPublicationFailed",
            body: [
                "participant": participant.toReactAttributes(),
                "dataTrack": dataTrack.toReactAttributes(),
                "error": error.localizedDescription
            ]
        )
    }
    
    func localParticipantDidPublishVideoTrack(participant: LocalParticipant, videoTrackPublication: LocalVideoTrackPublication) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.videoTrackPublished",
            body: [
                "participant": participant.toReactAttributes(),
                "videoTrackPublication": videoTrackPublication.toReactAttributes()
            ]
        )
    }
    
    func localParticipantDidFailToPublishVideoTrack(participant: LocalParticipant, videoTrack: LocalVideoTrack, error: Error) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.videoTrackPublicationFailed",
            body: [
                "participant": participant.toReactAttributes(),
                "videoTrack": videoTrack.toReactAttributes(),
                "error": error.localizedDescription
            ]
        )
    }
    
    func localParticipantNetworkQualityLevelDidChange(participant: LocalParticipant, networkQualityLevel: NetworkQualityLevel) {
        if (!isObserving) {
            return
        }
        sendEvent(
            withName: "LocalParticipant.networkQualityLevelChanged",
            body: [
                "participant": participant.toReactAttributes(),
                "networkQualityLevel": networkQualityLevel.toReactNetworkQualityLevel() as Any
            ]
        )
    }
}
