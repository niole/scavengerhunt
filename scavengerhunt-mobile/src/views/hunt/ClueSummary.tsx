import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { LatLng } from '../../domain/LatLng';
import { ClueUpdate } from '../../domain/Clue';
import withToggle from '../../containers/withToggle';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CreateEditClueModal, { Props as ClueModalProps} from './CreateEditClueModal';

const handleUpdateClue = (
        handleClueUpdate: (update: ClueUpdate) => void,
        clueId: string
    ) => (text: string, location: LatLng, clueNumber: number) => {
    handleClueUpdate({
        number: clueNumber,
        text,
        location,
        clueId
    });
};

type OuterProps = {
    buttonProps?: any;
    defaultNumber?: number;
    defaultLocation: LatLng;
    defaultText: string;
    onConfirm: ClueModalProps['onConfirm'];
};

const EditClueModal = withToggle<OuterProps>(props =>
    <CreateEditClueModal
        {...props}
        editing={true}
    />
)(undefined, { children: 'edit' });

type Props = {
    text: string;
    clueId: string;
    handleClueUpdate: (update: ClueUpdate) => void;
    location: LatLng;
    handleDelete: () => void;
    clueNumber: number;
};

const ClueSummary = ({
        location,
        text,
        clueId,
        handleClueUpdate,
        handleDelete,
        clueNumber,
    }: Props) => {
    return (
        <Card
            title={`#${clueNumber}`}
            footer={
                <>
                    <EditClueModal
                        buttonProps={{ fullWidth: true }}
                        defaultLocation={location}
                        onConfirm={handleUpdateClue(handleClueUpdate, clueId)}
                        defaultText={text}
                        defaultNumber={clueNumber}
                    />
                    <Button onClick={handleDelete} fullWidth={true}>
                        Delete
                    </Button>
                </>
            }
        >
            <View>
                <View>
                    <Text>
                        location {JSON.stringify(location)}
                    </Text>
                </View>
                <View>
                    <Text>
                        {text}
                    </Text>
                </View>
            </View>
        </Card>
    );
};

export default ClueSummary;
