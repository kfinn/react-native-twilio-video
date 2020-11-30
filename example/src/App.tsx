import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TwilioVideo, { Room } from 'react-native-twilio-video';

export default function App() {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    let roomResolver: any;
    const roomPromise = new Promise((resolve) => (roomResolver = resolve));

    const connectAsync = async () => {
      try {
        const connectedRoom = await TwilioVideo.connect(
          'eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJqdGkiOiJTSzA1YjViNThhODk3M2YyZjljNDE0MDQzYmU3MGYxZDYxLTE2MDY3Njk3NDciLCJncmFudHMiOnsiaWRlbnRpdHkiOiIwZTRkNTIwOC0zMWQ4LTRjNDMtOWVjNy03NmU0ZWFmNjY1OTQiLCJ2aWRlbyI6eyJyb29tIjoiUk1jMDA2N2UyNzJkNWFlNDBjMjQwMGZjNDQ0YTk3MTg4YSJ9fSwiaXNzIjoiU0swNWI1YjU4YTg5NzNmMmY5YzQxNDA0M2JlNzBmMWQ2MSIsIm5iZiI6MTYwNjc2OTc0NywiZXhwIjoxNjA2NzczMzQ3LCJzdWIiOiJBQzI2ZTA3NzU3NjQ0MWExMjBkYmUxZmVkNzlhYzNjODM0In0.PqIMYD2qu9qeziUB_EzEyJ3Ep6LbZcqLtCsgCuwIts8',
          {
            roomName: 'RMc0067e272d5ae40c2400fc444a97188a',
          }
        );

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
        console.log(exception);
      }
    };

    connectAsync();

    return () => {
      const cleanupAsync = async () => {
        const connectedRoom = (await roomPromise) as any;
        const result = await connectedRoom.disconnect();
        console.log(result);
      };
      cleanupAsync();
    };
  }, []);

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
