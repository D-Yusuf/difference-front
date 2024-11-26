import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LivePitchList from "../../screens/LivePitch/LivePitchList";
import LivePitchRoom from "../../screens/LivePitch/LivePitchRoom";
import NAVIGATION from "../index";

const Stack = createNativeStackNavigator();

const LivePitchNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.LIVE_PITCH.LIST}
        component={LivePitchList}
        options={{
          headerTitle: "Live Pitches",
        }}
      />
      <Stack.Screen
        name={NAVIGATION.LIVE_PITCH.ROOM}
        component={LivePitchRoom}
        options={({ route }) => ({
          headerTitle: route.params?.title || "Live Pitch",
        })}
      />
    </Stack.Navigator>
  );
};

export default LivePitchNavigation;
