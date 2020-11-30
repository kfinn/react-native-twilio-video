export type Listener = (data: any) => void;

export default class ListenersByEventType<EventType> {
  map = new Map<EventType, Listener[]>();

  add = (eventType: EventType, listener: Listener) => {
    const existingListeners = this.map.get(eventType);
    if (existingListeners) {
      existingListeners.push(listener);
    } else {
      this.map.set(eventType, [listener]);
    }
  };

  remove = (eventType: EventType, listener: Listener) => {
    const existingListeners = this.map.get(eventType);
    if (!existingListeners) {
      throw `Unable to remove listener, no current listeners for ${eventType}`;
    } else {
      const index = existingListeners.indexOf(listener);
      if (index === -1) {
        throw `Unable to remove listener, not found among current listeners for ${eventType}`;
      } else {
        existingListeners.splice(index, 1);
      }
    }
  };

  isListeningTo = (eventType: EventType) => {
    const existingListeners = this.map.get(eventType);
    if (existingListeners) {
      return existingListeners.length > 0;
    } else {
      return false;
    }
  };

  get = (eventType: EventType) => {
    return this.map.get(eventType) || [];
  };
}
