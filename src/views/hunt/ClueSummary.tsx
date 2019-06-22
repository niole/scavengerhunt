import React from 'react';
import { LatLng } from '../../domain/LatLng';
import { ClueUpdate } from '../../domain/Clue';
import withToggle from '../../containers/withToggle';
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
)(({ onClick, children }) => <span onClick={onClick}>{children}</span>, { children: 'edit' });

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
        <div>
            <div>
                {name} <EditClueModal
                    defaultLocation={location}
                    onConfirm={handleUpdateClue(handleClueUpdate, clueId)}
                    defaultText={text}
                />
            </div>
            <div>
                location {JSON.stringify(location)}
            </div>
            <div>
                {text}
            </div>
        </div>
    );
};

export default ClueSummary;
