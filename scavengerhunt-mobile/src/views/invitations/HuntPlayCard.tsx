import * as React from "react";
import Card from '../../components/Card';
import Button from '../../components/Button';

type Props = {
    huntName: string;
    onPlay: () => void;
};

const HuntPlayCard = (props: Props) => (
    <Card title={props.huntName}>
        <Button fullWidth={true} onClick={props.onPlay}>
            Play
        </Button>
    </Card>
);

export default HuntPlayCard;
