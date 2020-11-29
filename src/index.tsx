import { NativeModules } from 'react-native';

type TwilioVideoType = {
  multiply(a: number, b: number): Promise<number>;
};

const { TwilioVideo } = NativeModules;

export default TwilioVideo as TwilioVideoType;
