import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import withToggle, { InnerProps as ModalBaseProps } from '../../containers/withToggle';

const Modal = withToggle<{}>((props: ModalBaseProps) => (
    <Dialog open={props.visible} onClose={props.onClose}>
        <DialogTitle>
            Create A Hunt
        </DialogTitle>
        <div>
            name: <input />
        </div>
        <Button onClick={props.onClose}>
            submit
        </Button>
    </Dialog>
))();

const Home = () => (
    <div>
        <Modal />
    </div>
);

export default Home;
