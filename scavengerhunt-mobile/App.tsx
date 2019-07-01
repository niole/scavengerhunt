import * as React from "react";
import './src/secrets/env';
import './src/style/typography';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './src/views/home';
import Hunt from './src/views/hunt';
import Invite from './src/views/invite';
import Play from './src/views/play';
import Success from './src/views/success';
import Invitations from './src/views/invitations';

const Routes = createAppContainer(createStackNavigator({
    invitations: { screen: Invitations },
    home: { screen: Home },
    hunt: { screen: Hunt },
    invite: { screen: Invite },
    play: { screen: Play },
    success: { screen: Success },
  },
  { initialRouteName: "home" }
));

export default (props: any) => <Routes {...props} />;
