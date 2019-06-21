import React from 'react';
import { ClueUpdate } from '../../domain/Clue';
import withToggle from '../../containers/withToggle';
import CreateEditClueModal from './CreateEditClueModal';

const handleUpdateClue = (handleClueUpdate: (update: ClueUpdate) => void, clueId: string) => (text: string) => {
    handleClueUpdate({
        text,
        clueId
    });
};

const EditClueModal = withToggle<{ defaultText: string; onConfirm: (text: string) => void}>(props =>
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
};

const ClueSummary = ({
        name,
        text,
        clueId,
        handleClueUpdate,
    }: Props) => {
    return (
        <div>
            <div>
                {name} <EditClueModal onConfirm={handleUpdateClue(handleClueUpdate, clueId)} defaultText={text} />
            </div>
            <div>
                {text}
            </div>
        </div>
    );
};

export default ClueSummary;
