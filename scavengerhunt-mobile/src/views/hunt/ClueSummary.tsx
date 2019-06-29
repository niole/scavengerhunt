import React from 'react';
import { Text, View } from 'react-native';
import { LatLng } from '../../domain/LatLng';
import { ClueUpdate } from '../../domain/Clue';
import withToggle from '../../containers/withToggle';
import Card from '../../components/Card';
import CreateEditClueModal, { Props as ClueModalProps} from './CreateEditClueModal';

const handleUpdateClue = (
        handleClueUpdate: (update: ClueUpdate) => void,
        clueId: string
    ) => (text: string, location: LatLng) => {
    handleClueUpdate({
        text,
        location,
        clueId
    });
};

const EditClueModal = withToggle<{ defaultLocation: LatLng; defaultText: string; onConfirm: ClueModalProps['onConfirm'] }>(props =>
    <CreateEditClueModal
        {...props}
        editing={true}
    />
)(undefined, { children: 'edit' });

type Props = {
    name: string;
    text: string;
    clueId: string;
    handleClueUpdate: (update: ClueUpdate) => void;
    location: LatLng;
};

const ClueSummary = ({
        location,
        name,
        text,
        clueId,
        handleClueUpdate,
    }: Props) => {
    return (
        <Card>
            <View>
                <View>
                    <Text>{name}</Text>
                    <EditClueModal
                        defaultLocation={location}
                        onConfirm={handleUpdateClue(handleClueUpdate, clueId)}
                        defaultText={text}
                    />
                </View>
                <Text>
                    <Text>
                        location {JSON.stringify(location)}
                    </Text>
                    <Text>
                        {text}
                    </Text>
                </Text>
            </View>
        </Card>
    );
};

export default ClueSummary;
