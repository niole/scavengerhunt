import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { RouteComponentProps } from 'react-router';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import withDataGetter from '../../containers/withDataGetter';

const getProps = (huntId: string, teamId: string): Props => {
    const hunt = HuntService.getHunt(huntId);
    const team = TeamService.getTeamById(teamId);
    if (!!hunt && !!team && team.done) {
        return {
            huntName: hunt.name,
            teamName: team.name,
        };
    } else {
        throw new Error(`Team or hunt data is missing or hunt is not over. hunt: ${hunt}, team: ${team}.`);
    }
};

type OuterProps = RouteComponentProps<{ teamId: string; huntId: string }>;

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
    async (props: OuterProps) => getProps(props.match.params.huntId, props.match.params.teamId),
)(SuccessView);
