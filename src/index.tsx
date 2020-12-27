import LocalVideoTrackView from './components/LocalVideoTrackView';
import RemoteVideoTrackView from './components/RemoteVideoTrackView';
import LocalAudioTrack from './models/LocalAudioTrack';
import LocalAudioTrackPublication from './models/LocalAudioTrackPublication';
import LocalDataTrack from './models/LocalDataTrack';
import LocalDataTrackPublication from './models/LocalDataTrackPublication';
import LocalParticipant from './models/LocalParticipant';
import LocalVideoTrack from './models/LocalVideoTrack';
import LocalVideoTrackPublication from './models/LocalVideoTrackPublication';
import RemoteAudioTrack from './models/RemoteAudioTrack';
import RemoteAudioTrackPublication from './models/RemoteAudioTrackPublication';
import RemoteDataTrack from './models/RemoteDataTrack';
import RemoteDataTrackPublication from './models/RemoteDataTrackPublication';
import RemoteParticipant from './models/RemoteParticipant';
import RemoteVideoTrack from './models/RemoteVideoTrack';
import RemoteVideoTrackPublication from './models/RemoteVideoTrackPublication';
import Room from './models/Room';
import { Camera, TwilioVideo } from './TwilioVideo';

export {
  Camera,
  LocalAudioTrack,
  LocalAudioTrackPublication,
  LocalDataTrack,
  LocalDataTrackPublication,
  LocalParticipant,
  LocalVideoTrack,
  LocalVideoTrackPublication,
  LocalVideoTrackView,
  RemoteAudioTrack,
  RemoteAudioTrackPublication,
  RemoteDataTrack,
  RemoteDataTrackPublication,
  RemoteParticipant,
  RemoteVideoTrack,
  RemoteVideoTrackPublication,
  RemoteVideoTrackView,
  Room,
};

const { connect } = Room;
const { listCameras } = TwilioVideo;

export default { connect, listCameras };
