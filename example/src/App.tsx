import React, { useCallback, useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  LocalAudioTrack,
  LocalVideoTrack,
  LocalVideoTrackView,
  RemoteAudioTrackPublication,
  RemoteParticipant,
  RemoteVideoTrackView,
  Room,
} from 'react-native-twilio-video';

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [room, setRoom] = useState<Room>();
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack>();
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>();
  const [roomStateVersion, setRoomStateVersion] = useState(0);
  const roomChanged = useCallback(() => {
    setRoomStateVersion((previousVersion) => previousVersion + 1);
  }, []);

  useEffect(() => {
    const requestPermissionsAsync = async () => {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      setPermissionsGranted(
        permissions['android.permission.RECORD_AUDIO'] === 'granted' &&
          permissions['android.permission.CAMERA'] === 'granted'
      );
    };

    if (Platform.OS === 'android') {
      requestPermissionsAsync();
    } else {
      setPermissionsGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionsGranted) {
      return;
    }

    let localVideoTrackResolve: (
      value?: LocalVideoTrack | PromiseLike<LocalVideoTrack> | undefined
    ) => void;
    const localVideoTrackPromise = new Promise<LocalVideoTrack>(
      (resolve) => (localVideoTrackResolve = resolve)
    );

    const asyncCreateLocalVideoTrack = async () => {
      try {
        const createdLocalVideoTrack = await LocalVideoTrack.create({
          format: {
            dimensions: {
              width: 640,
              height: 480,
            },
            framerate: 30,
          },
        });
        setLocalVideoTrack(createdLocalVideoTrack);
        localVideoTrackResolve(createdLocalVideoTrack);
      } catch (error) {
        console.log(error);
      }
    };
    asyncCreateLocalVideoTrack();

    return () => {
      const cleanupAsync = async () => {
        const createdLocalVideoTrack = await localVideoTrackPromise;
        createdLocalVideoTrack.destroy();
        setLocalVideoTrack(undefined);
      };
      cleanupAsync();
    };
  }, [permissionsGranted]);

  useEffect(() => {
    if (!permissionsGranted) {
      return;
    }
    let localAudioTrackResolve: (
      value?: LocalAudioTrack | PromiseLike<LocalAudioTrack> | undefined
    ) => void;
    const localAudioTrackPromise = new Promise<LocalAudioTrack>(
      (resolve) => (localAudioTrackResolve = resolve)
    );

    const asyncCreateLocalAudioTrack = async () => {
      try {
        const createdLocalAudioTrack = await LocalAudioTrack.create();
        setLocalAudioTrack(createdLocalAudioTrack);
        localAudioTrackResolve(createdLocalAudioTrack);
      } catch (error) {
        console.log(error);
      }
    };
    asyncCreateLocalAudioTrack();

    return () => {
      const cleanupAsync = async () => {
        const createdLocalAudioTrack = await localAudioTrackPromise;
        createdLocalAudioTrack.destroy();
        setLocalAudioTrack(undefined);
      };
      cleanupAsync();
    };
  }, [permissionsGranted]);

  useEffect(() => {
    if (!localAudioTrack || !localVideoTrack) {
      return;
    }

    let roomResolver: any;
    const roomPromise = new Promise((resolve) => (roomResolver = resolve));

    const connectAsync = async () => {
      try {
        const connectedRoom = await Room.connect('token', {
          roomName: 'roomName',
          audioTracks: [localAudioTrack],
          videoTracks: [localVideoTrack],
        });

        const subscribeToRemoteParticipant = (
          participant: RemoteParticipant
        ) => {
          participant.on('audioTrackDisabled', () => {
            console.log('audioTrackDisabled');
            roomChanged();
          });

          participant.on('audioTrackEnabled', () => {
            console.log('audioTrackEnabled');
            roomChanged();
          });

          participant.on('audioTrackPublished', () => {
            console.log('audioTrackPublished');
            roomChanged();
          });

          participant.on('audioTrackPublishPriorityChanged', () => {
            console.log('audioTrackPublishPriorityChanged');
            roomChanged();
          });

          participant.on('audioTrackSubscribed', (participantEventData) => {
            console.log('audioTrackSubscribed');
            roomChanged();
            const { publication } = participantEventData as {
              publication: RemoteAudioTrackPublication;
            };
            const { remoteTrack } = publication;

            remoteTrack!.setIsPlaybackEnabled(false).catch((reason) => {
              console.log('remoteTrack.setIsPlaybackEnabled error');
              roomChanged();
              console.log(reason);
              roomChanged();
            });
          });

          participant.on('audioTrackSubscriptionFailed', () => {
            console.log('audioTrackSubscriptionFailed');
            roomChanged();
          });

          participant.on('audioTrackUnpublished', () => {
            console.log('audioTrackUnpublished');
            roomChanged();
          });

          participant.on('audioTrackUnsubscribed', () => {
            console.log('audioTrackUnsubscribed');
            roomChanged();
          });

          participant.on('dataTrackPublished', () => {
            console.log('dataTrackPublished');
            roomChanged();
          });

          participant.on('dataTrackPublishPriorityChanged', () => {
            console.log('dataTrackPublishPriorityChanged');
            roomChanged();
          });

          participant.on('dataTrackSubscribed', () => {
            console.log('dataTrackSubscribed');
            roomChanged();
          });

          participant.on('dataTrackSubscriptionFailed', () => {
            console.log('dataTrackSubscriptionFailed');
            roomChanged();
          });

          participant.on('dataTrackUnpublished', () => {
            console.log('dataTrackUnpublished');
            roomChanged();
          });

          participant.on('dataTrackUnsubscribed', () => {
            console.log('dataTrackUnsubscribed');
            roomChanged();
          });

          participant.on('networkQualityLevelChanged', () => {
            console.log('networkQualityLevelChanged');
            roomChanged();
          });

          participant.on('videoTrackDisabled', () => {
            console.log('videoTrackDisabled');
            roomChanged();
          });

          participant.on('videoTrackEnabled', () => {
            console.log('videoTrackEnabled');
            roomChanged();
          });

          participant.on('videoTrackPublished', () => {
            console.log('videoTrackPublished');
            roomChanged();
          });

          participant.on('videoTrackPublishPriorityChanged', () => {
            console.log('videoTrackPublishPriorityChanged');
            roomChanged();
          });

          participant.on('videoTrackSubscribed', () => {
            console.log('videoTrackSubscribed');
            roomChanged();
          });

          participant.on('videoTrackSubscriptionFailed', () => {
            console.log('videoTrackSubscriptionFailed');
            roomChanged();
          });

          participant.on('videoTrackSwitchedOff', () => {
            console.log('videoTrackSwitchedOff');
            roomChanged();
          });

          participant.on('videoTrackSwitchedOn', () => {
            console.log('videoTrackSwitchedOn');
            roomChanged();
          });

          participant.on('videoTrackUnpublished', () => {
            console.log('videoTrackUnpublished');
            roomChanged();
          });

          participant.on('videoTrackUnsubscribed', () => {
            console.log('videoTrackUnsubscribed');
            roomChanged();
          });
        };

        connectedRoom.on('connected', (data) => {
          const { localParticipant, remoteParticipants } = data.room as Room;

          localParticipant!.on('audioTrackPublicationFailed', () => {
            console.log('audioTrackPublicationFailed');
            roomChanged();
          });

          localParticipant!.on('audioTrackPublished', () => {
            console.log('audioTrackPublished');
            roomChanged();
          });

          localParticipant!.on('dataTrackPublicationFailed', () => {
            console.log('dataTrackPublicationFailed');
            roomChanged();
          });

          localParticipant!.on('dataTrackPublished', () => {
            console.log('dataTrackPublished');
            roomChanged();
          });

          localParticipant!.on('networkQualityLevelChanged', () => {
            console.log('networkQualityLevelChanged');
            roomChanged();
          });

          localParticipant!.on('videoTrackPublicationFailed', () => {
            console.log('videoTrackPublicationFailed');
            roomChanged();
          });

          localParticipant!.on('videoTrackPublished', () => {
            console.log('videoTrackPublished');
            roomChanged();
          });

          remoteParticipants.forEach(subscribeToRemoteParticipant);

          console.log('connected');
          roomChanged();
        });
        connectedRoom.on('failedToConnect', () => {
          console.log('failedToConnect');
          roomChanged();
        });
        connectedRoom.on('disconnected', () => {
          console.log('disconnected');
          roomChanged();
        });
        connectedRoom.on('reconnecting', () => {
          console.log('reconnecting');
          roomChanged();
        });
        connectedRoom.on('reconnected', () => {
          console.log('reconnected');
          roomChanged();
        });
        connectedRoom.on('participantConnected', (data) => {
          console.log('participantConnected');
          roomChanged();

          const { participant } = data as { participant: RemoteParticipant };
          subscribeToRemoteParticipant(participant);
        });
        connectedRoom.on('participantDisconnected', () => {
          console.log('participantDisconnected');
          roomChanged();
        });
        connectedRoom.on('recordingStarted', () => {
          console.log('recordingStarted');
          roomChanged();
        });
        connectedRoom.on('recordingStopped', () => {
          console.log('recordingStopped');
          roomChanged();
        });
        connectedRoom.on('dominantSpeakerChanged', () => {
          console.log('dominantSpeakerChanged');
          roomChanged();
        });

        setRoom(connectedRoom);
        roomResolver(connectedRoom);
      } catch (exception) {
        console.log('connect exception');
        console.log(exception);
      }
    };

    connectAsync();

    return () => {
      const cleanupAsync = async () => {
        const connectedRoom = (await roomPromise) as any;
        await connectedRoom.disconnect();
        console.log('disconnect');
      };
      cleanupAsync();
    };
  }, [roomChanged, localAudioTrack, localVideoTrack]);

  if (!permissionsGranted) {
    return (
      <SafeAreaView>
        <Text>Please grant access to your microphone and camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text>{roomStateVersion}</Text>
        {localVideoTrack && (
          <LocalVideoTrackView
            localVideoTrack={localVideoTrack}
            scaleType="aspectFit"
            mirror={true}
            style={styles.video}
          />
        )}
        {room ? (
          <React.Fragment>
            <Text>Room:</Text>
            <View style={styles.indent}>
              <Text>sid: {room.sid}</Text>
              <Text>name: {room.name}</Text>
              <Text>state: {room.state}</Text>
              <Text>isRecording: {room.isRecording}</Text>
              <Text>localParticipant:</Text>
              {room.localParticipant ? (
                <React.Fragment>
                  <View style={styles.indent}>
                    <Text>identity: {room.localParticipant.identity}</Text>
                    <Text>sid: {room.localParticipant.sid}</Text>
                    <Text>
                      networkQualityLevel:{' '}
                      {room.localParticipant.networkQualityLevel}
                    </Text>
                    <Text>localAudioTracks:</Text>
                    <View style={styles.indent}>
                      {room.localParticipant.localAudioTracks.map(
                        (localAudioTrackPublication) => (
                          <React.Fragment
                            key={localAudioTrackPublication.trackSid}
                          >
                            <Text>LocalAudioTrackPublication:</Text>
                            <View style={styles.indent}>
                              <Text>
                                trackSid: {localAudioTrackPublication.trackSid}
                              </Text>
                              <Text>
                                trackName:{' '}
                                {localAudioTrackPublication.trackName}
                              </Text>
                              <Text>
                                priority: {localAudioTrackPublication.priority}
                              </Text>
                              <Text>localAudioTrack:</Text>
                              {localAudioTrackPublication.localTrack ? (
                                <React.Fragment>
                                  <Text>LocalAudioTrack</Text>
                                  <View style={styles.indent}>
                                    <Text>
                                      isEnabled:{' '}
                                      {
                                        localAudioTrackPublication.localTrack
                                          .isEnabled
                                      }
                                    </Text>
                                    <Text>
                                      name:{' '}
                                      {
                                        localAudioTrackPublication.localTrack
                                          .name
                                      }
                                    </Text>
                                    <Text>
                                      state:{' '}
                                      {
                                        localAudioTrackPublication.localTrack
                                          .state
                                      }
                                    </Text>
                                  </View>
                                </React.Fragment>
                              ) : (
                                <Text>null</Text>
                              )}
                            </View>
                          </React.Fragment>
                        )
                      )}
                    </View>
                    <Text>localVideoTracks:</Text>
                    <View style={styles.indent}>
                      {room.localParticipant.localVideoTracks.map(
                        (localVideoTrackPublication) => (
                          <React.Fragment
                            key={localVideoTrackPublication.trackSid}
                          >
                            <Text>LocalVideoTrackPublication:</Text>
                            <View style={styles.indent}>
                              <Text>
                                trackSid: {localVideoTrackPublication.trackSid}
                              </Text>
                              <Text>
                                trackName:{' '}
                                {localVideoTrackPublication.trackName}
                              </Text>
                              <Text>
                                priority: {localVideoTrackPublication.priority}
                              </Text>
                              <Text>localVideoTrack:</Text>
                              {localVideoTrackPublication.localTrack ? (
                                <React.Fragment>
                                  <Text>LocalVideoTrack</Text>
                                  <View style={styles.indent}>
                                    <Text>
                                      isEnabled:{' '}
                                      {
                                        localVideoTrackPublication.localTrack
                                          .isEnabled
                                      }
                                    </Text>
                                    <Text>
                                      name:{' '}
                                      {
                                        localVideoTrackPublication.localTrack
                                          .name
                                      }
                                    </Text>
                                    <Text>
                                      state:{' '}
                                      {
                                        localVideoTrackPublication.localTrack
                                          .state
                                      }
                                    </Text>
                                  </View>
                                </React.Fragment>
                              ) : (
                                <Text>null</Text>
                              )}
                            </View>
                          </React.Fragment>
                        )
                      )}
                    </View>
                    <Text>localDataTracks:</Text>
                    <View style={styles.indent}>
                      {room.localParticipant.localDataTracks.map(
                        (localDataTrackPublication) => (
                          <React.Fragment
                            key={localDataTrackPublication.trackSid}
                          >
                            <Text>LocalDataTrackPublication:</Text>
                            <View style={styles.indent}>
                              <Text>
                                trackSid: {localDataTrackPublication.trackSid}
                              </Text>
                              <Text>
                                trackName: {localDataTrackPublication.trackName}
                              </Text>
                              <Text>
                                priority: {localDataTrackPublication.priority}
                              </Text>
                              <Text>localDataTrack:</Text>
                              {localDataTrackPublication.localTrack ? (
                                <React.Fragment>
                                  <Text>LocalDataTrack</Text>
                                  <View style={styles.indent}>
                                    <Text>
                                      isEnabled:{' '}
                                      {
                                        localDataTrackPublication.localTrack
                                          .isEnabled
                                      }
                                    </Text>
                                    <Text>
                                      name:{' '}
                                      {
                                        localDataTrackPublication.localTrack
                                          .name
                                      }
                                    </Text>
                                    <Text>
                                      state:{' '}
                                      {
                                        localDataTrackPublication.localTrack
                                          .state
                                      }
                                    </Text>
                                  </View>
                                </React.Fragment>
                              ) : (
                                <Text>null</Text>
                              )}
                            </View>
                          </React.Fragment>
                        )
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ) : (
                <Text>null</Text>
              )}
              <Text>remoteParticipants:</Text>
              <View style={styles.indent}>
                {room.remoteParticipants.map((remoteParticipant) => (
                  <React.Fragment key={remoteParticipant.sid}>
                    <Text>RemoteParticipant</Text>
                    <View style={styles.indent}>
                      <Text>connected: {remoteParticipant.connected}</Text>
                      <Text>identity: {remoteParticipant.identity}</Text>
                      <Text>sid: {remoteParticipant.sid}</Text>
                      <Text>
                        networkQualityLevel:{' '}
                        {remoteParticipant.networkQualityLevel}
                      </Text>
                      <Text>remoteAudioTracks:</Text>
                      <View style={styles.indent}>
                        {remoteParticipant.remoteAudioTracks.map(
                          (remoteAudioTrackPublication) => (
                            <React.Fragment
                              key={remoteAudioTrackPublication.trackSid}
                            >
                              <Text>RemoteAudioTrackPublication</Text>
                              <View style={styles.indent}>
                                <Text>
                                  isTrackSubscribed:{' '}
                                  {
                                    remoteAudioTrackPublication.isTrackSubscribed
                                  }
                                </Text>
                                <Text>remoteTrack:</Text>
                                <View style={styles.indent}>
                                  {remoteAudioTrackPublication.remoteTrack ? (
                                    <React.Fragment>
                                      <Text>RemoteAudioTrack</Text>
                                      <View style={styles.indent}>
                                        <Text>
                                          sid:{' '}
                                          {
                                            remoteAudioTrackPublication
                                              .remoteTrack.sid
                                          }
                                        </Text>
                                        <Text>
                                          isPlaybackEnabled:{' '}
                                          {
                                            remoteAudioTrackPublication
                                              .remoteTrack.isPlaybackEnabled
                                          }
                                        </Text>
                                        <Text>
                                          isEnabled:{' '}
                                          {
                                            remoteAudioTrackPublication
                                              .remoteTrack.isEnabled
                                          }
                                        </Text>
                                        <Text>
                                          name:{' '}
                                          {
                                            remoteAudioTrackPublication
                                              .remoteTrack.name
                                          }
                                        </Text>
                                        <Text>
                                          state:{' '}
                                          {
                                            remoteAudioTrackPublication
                                              .remoteTrack.state
                                          }
                                        </Text>
                                      </View>
                                    </React.Fragment>
                                  ) : (
                                    <Text>null</Text>
                                  )}
                                </View>
                                <Text>
                                  publishPriority:{' '}
                                  {remoteAudioTrackPublication.publishPriority}
                                </Text>
                                <Text>
                                  isTrackEnabled:{' '}
                                  {remoteAudioTrackPublication.isTrackEnabled}
                                </Text>
                                <Text>
                                  trackName:{' '}
                                  {remoteAudioTrackPublication.trackName}
                                </Text>
                                <Text>
                                  trackSid:{' '}
                                  {remoteAudioTrackPublication.trackSid}
                                </Text>
                              </View>
                            </React.Fragment>
                          )
                        )}
                      </View>
                      <Text>remoteVideoTracks:</Text>
                      <View style={styles.indent}>
                        {remoteParticipant.remoteVideoTracks.map(
                          (remoteVideoTrackPublication) => (
                            <React.Fragment
                              key={remoteVideoTrackPublication.trackSid}
                            >
                              <Text>RemoteVideoTrackPublication</Text>
                              <View style={styles.indent}>
                                <Text>
                                  isTrackSubscribed:{' '}
                                  {
                                    remoteVideoTrackPublication.isTrackSubscribed
                                  }
                                </Text>
                                <Text>remoteTrack:</Text>
                                <View style={styles.indent}>
                                  {remoteVideoTrackPublication.remoteTrack ? (
                                    <React.Fragment>
                                      <Text>RemoteVideoTrack</Text>
                                      <View style={styles.indent}>
                                        <RemoteVideoTrackView
                                          remoteVideoTrack={
                                            remoteVideoTrackPublication.remoteTrack
                                          }
                                          mirror={true}
                                          scaleType="aspectFit"
                                          style={styles.video}
                                        />
                                        <Text>
                                          sid:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.sid
                                          }
                                        </Text>
                                        <Text>
                                          isSwitchedOff:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.isSwitchedOff
                                          }
                                        </Text>
                                        <Text>
                                          priority:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.priority
                                          }
                                        </Text>
                                        <Text>
                                          isEnabled:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.isEnabled
                                          }
                                        </Text>
                                        <Text>
                                          name:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.name
                                          }
                                        </Text>
                                        <Text>
                                          state:{' '}
                                          {
                                            remoteVideoTrackPublication
                                              .remoteTrack.state
                                          }
                                        </Text>
                                      </View>
                                    </React.Fragment>
                                  ) : (
                                    <Text>null</Text>
                                  )}
                                </View>
                                <Text>
                                  publishPriority:{' '}
                                  {remoteVideoTrackPublication.publishPriority}
                                </Text>
                                <Text>
                                  isTrackEnabled:{' '}
                                  {remoteVideoTrackPublication.isTrackEnabled}
                                </Text>
                                <Text>
                                  trackName:{' '}
                                  {remoteVideoTrackPublication.trackName}
                                </Text>
                                <Text>
                                  trackSid:{' '}
                                  {remoteVideoTrackPublication.trackSid}
                                </Text>
                              </View>
                            </React.Fragment>
                          )
                        )}
                      </View>
                      <Text>remoteDataTracks:</Text>
                      <View style={styles.indent}>
                        {remoteParticipant.remoteDataTracks.map(
                          (remoteDataTrackPublication) => (
                            <React.Fragment
                              key={remoteDataTrackPublication.trackSid}
                            >
                              <Text>RemoteDataTrackPublication</Text>
                              <View style={styles.indent}>
                                <Text>
                                  isTrackSubscribed:{' '}
                                  {remoteDataTrackPublication.isTrackSubscribed}
                                </Text>
                                <Text>remoteTrack:</Text>
                                <View style={styles.indent}>
                                  {remoteDataTrackPublication.remoteTrack ? (
                                    <React.Fragment>
                                      <Text>RemoteDataTrack</Text>
                                      <View style={styles.indent}>
                                        <Text>
                                          sid:{' '}
                                          {
                                            remoteDataTrackPublication
                                              .remoteTrack.sid
                                          }
                                        </Text>
                                        <Text>
                                          isEnabled:{' '}
                                          {
                                            remoteDataTrackPublication
                                              .remoteTrack.isEnabled
                                          }
                                        </Text>
                                        <Text>
                                          name:{' '}
                                          {
                                            remoteDataTrackPublication
                                              .remoteTrack.name
                                          }
                                        </Text>
                                        <Text>
                                          state:{' '}
                                          {
                                            remoteDataTrackPublication
                                              .remoteTrack.state
                                          }
                                        </Text>
                                      </View>
                                    </React.Fragment>
                                  ) : (
                                    <Text>null</Text>
                                  )}
                                </View>
                                <Text>
                                  publishPriority:{' '}
                                  {remoteDataTrackPublication.publishPriority}
                                </Text>
                                <Text>
                                  isTrackEnabled:{' '}
                                  {remoteDataTrackPublication.isTrackEnabled}
                                </Text>
                                <Text>
                                  trackName:{' '}
                                  {remoteDataTrackPublication.trackName}
                                </Text>
                                <Text>
                                  trackSid:{' '}
                                  {remoteDataTrackPublication.trackSid}
                                </Text>
                              </View>
                            </React.Fragment>
                          )
                        )}
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </React.Fragment>
        ) : (
          <Text>Not connected</Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indent: {
    marginLeft: 10,
  },
  video: {
    height: 100,
    width: 100,
  },
});
