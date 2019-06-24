import * as React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './src/views/home';
import Hunt from './src/views/hunt';
import Invite from './src/views/invite';
import Play from './src/views/play';
import Success from './src/views/success';

const Routes = createAppContainer(createStackNavigator({
    home: { screen: Home },
    hunt: { screen: Hunt },
    invite: { screen: Invite },
    play: { screen: Play },
    success: { screen: Success },
  },
  { initialRouteName: "home" }
));

export default () => <Routes />;
