import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TwilioVideo, {
  RemoteAudioTrackPublication,
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
        const connectedRoom = await TwilioVideo.connect(
          'token',
          {
            roomName: 'room name',
          }
        );

        connectedRoom.on('connected', () => {
          console.log('connected');
        });
        connectedRoom.on('failedToConnect', () => {
          console.log('failedToConnect');
        });
        connectedRoom.on('disconnected', () => {
          console.log('disconnected');
        });
        connectedRoom.on('reconnecting', () => {
          console.log('reconnecting');
        });
        connectedRoom.on('reconnected', () => {
          console.log('reconnected');
        });
        connectedRoom.on('participantConnected', (data) => {
          console.log('participantConnected');

          const { participant } = data as { participant: RemoteParticipant };

          participant.on('audioTrackDisabled', () => {
            console.log('audioTrackDisabled');
          });

          participant.on('audioTrackEnabled', () => {
            console.log('audioTrackEnabled');
          });

          participant.on('audioTrackPublished', () => {
            console.log('audioTrackPublished');
          });

          participant.on('audioTrackPublishPriorityChanged', () => {
            console.log('audioTrackPublishPriorityChanged');
          });

          participant.on('audioTrackSubscribed', (participantEventData) => {
            console.log('audioTrackSubscribed');
            const { publication } = participantEventData as {
              publication: RemoteAudioTrackPublication;
            };
            const { remoteTrack } = publication;

            remoteTrack!.setIsPlaybackEnabled(false).catch((reason) => {
              console.log('remoteTrack.setIsPlaybackEnabled error');
              console.log(reason);
            });
          });

          participant.on('audioTrackSubscriptionFailed', () => {
            console.log('audioTrackSubscriptionFailed');
          });

          participant.on('audioTrackUnpublished', () => {
            console.log('audioTrackUnpublished');
          });

          participant.on('audioTrackUnsubscribed', () => {
            console.log('audioTrackUnsubscribed');
          });

          participant.on('dataTrackPublished', () => {
            console.log('dataTrackPublished');
          });

          participant.on('dataTrackPublishPriorityChanged', () => {
            console.log('dataTrackPublishPriorityChanged');
          });

          participant.on('dataTrackSubscribed', () => {
            console.log('dataTrackSubscribed');
          });

          participant.on('dataTrackSubscriptionFailed', () => {
            console.log('dataTrackSubscriptionFailed');
          });

          participant.on('dataTrackUnpublished', () => {
            console.log('dataTrackUnpublished');
          });

          participant.on('dataTrackUnsubscribed', () => {
            console.log('dataTrackUnsubscribed');
          });

          participant.on('networkQualityLevelChanged', () => {
            console.log('networkQualityLevelChanged');
          });

          participant.on('videoTrackDisabled', () => {
            console.log('videoTrackDisabled');
          });

          participant.on('videoTrackEnabled', () => {
            console.log('videoTrackEnabled');
          });

          participant.on('videoTrackPublished', () => {
            console.log('videoTrackPublished');
          });

          participant.on('videoTrackPublishPriorityChanged', () => {
            console.log('videoTrackPublishPriorityChanged');
          });

          participant.on('videoTrackSubscribed', () => {
            console.log('videoTrackSubscribed');
          });

          participant.on('videoTrackSubscriptionFailed', () => {
            console.log('videoTrackSubscriptionFailed');
          });

          participant.on('videoTrackSwitchedOff', () => {
            console.log('videoTrackSwitchedOff');
          });

          participant.on('videoTrackSwitchedOn', () => {
            console.log('videoTrackSwitchedOn');
          });

          participant.on('videoTrackUnpublished', () => {
            console.log('videoTrackUnpublished');
          });

          participant.on('videoTrackUnsubscribed', () => {
            console.log('videoTrackUnsubscribed');
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
        await connectedRoom.disconnect();
        console.log('disconnect');
      };
      cleanupAsync();
    };
  }, []);

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
