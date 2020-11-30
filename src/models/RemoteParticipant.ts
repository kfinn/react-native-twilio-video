export interface RemoteParticipantAttributes {
  connected: boolean;
  identity: string;
  sid: string;
  networkQualityLevel: string;
}

export default class RemoteParticipant implements RemoteParticipantAttributes {
  connected: boolean;
  identity: string;
  sid: string;
  networkQualityLevel: string;

  constructor({
    connected,
    identity,
    sid,
    networkQualityLevel,
  }: RemoteParticipantAttributes) {
    this.connected = connected;
    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;
  }

  mergeRemoteParticipantAttributes = ({
    connected,
    identity,
    sid,
    networkQualityLevel,
  }: RemoteParticipantAttributes) => {
    this.connected = connected;
    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;
  };

  destroy = () => {};
}
