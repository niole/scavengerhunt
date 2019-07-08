import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { NavigationScreenProp } from 'react-navigation';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import withDataGetter from '../../containers/withDataGetter';

const getProps = async (huntId: string, teamId: string): Promise<Props> => {
    try {
        const hunt = await HuntService.getHunt(huntId);
        const team = await TeamService.getTeamById(teamId);
        if (!!hunt && !!team && team.done) {
            return {
                huntName: hunt.name,
                teamName: team.name,
            };
        } else {
            throw new Error(`Team or hunt data is missing or hunt is not over. hunt: ${hunt}, team: ${team}.`);
        }
    } catch (error) {
        console.log('ERROR', error);
    }
};

type OuterProps = {
    navigation: NavigationScreenProp<{}, { teamId: string; huntId: string }>;
};

type Props = {
    huntName: string;
    teamName: string;
};

const SuccessView = ({ huntName, teamName }: Props) => (
    <View>
        <Text h1>Congratulations {teamName}!</Text>
        <Text>
            You solved {huntName}!
        </Text>
    </View>
);

export default withDataGetter<OuterProps, Props>(
    (props: OuterProps) => getProps(props.navigation.getParam('huntId'), props.navigation.getParam('teamId')),
)(SuccessView);
