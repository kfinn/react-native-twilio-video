import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TwilioVideo, {
  RemoteParticipant,
  Room,
} from 'react-native-twilio-video';

export default function App() {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    let roomResolver: any;
    const roomPromise = new Promise((resolve) => (roomResolver = resolve));

    const connectAsync = async () => {
      try {
        const connectedRoom = await TwilioVideo.connect('token', {
          roomName: 'room name',
        });

        connectedRoom.on('connected', (data) => {
          console.log('connected');
          console.log(data);
        });
        connectedRoom.on('failedToConnect', (data) => {
          console.log('failedToConnect');
          console.log(data);
        });
        connectedRoom.on('disconnected', (data) => {
          console.log('disconnected');
          console.log(data);
        });
        connectedRoom.on('reconnecting', (data) => {
          console.log('reconnecting');
          console.log(data);
        });
        connectedRoom.on('reconnected', (data) => {
          console.log('reconnected');
          console.log(data);
        });
        connectedRoom.on('participantConnected', (data) => {
          console.log('participantConnected');
          console.log(data);

          const { participant } = data as { participant: RemoteParticipant };

          participant.on('audioTrackDisabled', (participantEventData) => {
            console.log('audioTrackDisabled');
            console.log(participantEventData);
          });

          participant.on('audioTrackEnabled', (participantEventData) => {
            console.log('audioTrackEnabled');
            console.log(participantEventData);
          });

          participant.on('audioTrackPublished', (participantEventData) => {
            console.log('audioTrackPublished');
            console.log(participantEventData);
          });

          participant.on(
            'audioTrackPublishPriorityChanged',
            (participantEventData) => {
              console.log('audioTrackPublishPriorityChanged');
              console.log(participantEventData);
            }
          );

          participant.on('audioTrackSubscribed', (participantEventData) => {
            console.log('audioTrackSubscribed');
            console.log(participantEventData);
          });

          participant.on(
            'audioTrackSubscriptionFailed',
            (participantEventData) => {
              console.log('audioTrackSubscriptionFailed');
              console.log(participantEventData);
            }
          );

          participant.on('audioTrackUnpublished', (participantEventData) => {
            console.log('audioTrackUnpublished');
            console.log(participantEventData);
          });

          participant.on('audioTrackUnsubscribed', (participantEventData) => {
            console.log('audioTrackUnsubscribed');
            console.log(participantEventData);
          });

          participant.on('dataTrackPublished', (participantEventData) => {
            console.log('dataTrackPublished');
            console.log(participantEventData);
          });

          participant.on(
            'dataTrackPublishPriorityChanged',
            (participantEventData) => {
              console.log('dataTrackPublishPriorityChanged');
              console.log(participantEventData);
            }
          );

          participant.on('dataTrackSubscribed', (participantEventData) => {
            console.log('dataTrackSubscribed');
            console.log(participantEventData);
          });

          participant.on(
            'dataTrackSubscriptionFailed',
            (participantEventData) => {
              console.log('dataTrackSubscriptionFailed');
              console.log(participantEventData);
            }
          );

          participant.on('dataTrackUnpublished', (participantEventData) => {
            console.log('dataTrackUnpublished');
            console.log(participantEventData);
          });

          participant.on('dataTrackUnsubscribed', (participantEventData) => {
            console.log('dataTrackUnsubscribed');
            console.log(participantEventData);
          });

          participant.on(
            'networkQualityLevelChanged',
            (participantEventData) => {
              console.log('networkQualityLevelChanged');
              console.log(participantEventData);
            }
          );

          participant.on('videoTrackDisabled', (participantEventData) => {
            console.log('videoTrackDisabled');
            console.log(participantEventData);
          });

          participant.on('videoTrackEnabled', (participantEventData) => {
            console.log('videoTrackEnabled');
            console.log(participantEventData);
          });

          participant.on('videoTrackPublished', (participantEventData) => {
            console.log('videoTrackPublished');
            console.log(participantEventData);
          });

          participant.on(
            'videoTrackPublishPriorityChanged',
            (participantEventData) => {
              console.log('videoTrackPublishPriorityChanged');
              console.log(participantEventData);
            }
          );

          participant.on('videoTrackSubscribed', (participantEventData) => {
            console.log('videoTrackSubscribed');
            console.log(participantEventData);
          });

          participant.on(
            'videoTrackSubscriptionFailed',
            (participantEventData) => {
              console.log('videoTrackSubscriptionFailed');
              console.log(participantEventData);
            }
          );

          participant.on('videoTrackSwitchedOff', (participantEventData) => {
            console.log('videoTrackSwitchedOff');
            console.log(participantEventData);
          });

          participant.on('videoTrackSwitchedOn', (participantEventData) => {
            console.log('videoTrackSwitchedOn');
            console.log(participantEventData);
          });

          participant.on('videoTrackUnpublished', (participantEventData) => {
            console.log('videoTrackUnpublished');
            console.log(participantEventData);
          });

          participant.on('videoTrackUnsubscribed', (participantEventData) => {
            console.log('videoTrackUnsubscribed');
            console.log(participantEventData);
          });
        });
        connectedRoom.on('participantDisconnected', (data) => {
          console.log('participantDisconnected');
          console.log(data);
        });
        connectedRoom.on('recordingStarted', (data) => {
          console.log('recordingStarted');
          console.log(data);
        });
        connectedRoom.on('recordingStopped', (data) => {
          console.log('recordingStopped');
          console.log(data);
        });
        connectedRoom.on('dominantSpeakerChanged', (data) => {
          console.log('dominantSpeakerChanged');
          console.log(data);
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
        const result = await connectedRoom.disconnect();
        console.log('disconnect');
        console.log(result);
      };
      cleanupAsync();
    };
  }, []);

  console.log('render room');
  console.log(room);

  return (
    <View style={styles.container}>
      <Text>Room: {room?.sid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
