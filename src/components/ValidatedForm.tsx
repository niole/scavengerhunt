import React from 'react';

export type PluggableProps<C, V> = {
    onChange: (event: C) => void;
    value: V;
};

export type PluggableInput<C, V> = (props: PluggableProps<C, V>) => JSX.Element;

type Props<V> = {
    onSubmit: (values: V) => Promise<void>;
    onCancel: () => void;
    SubmitButton?: (props: { disabled: boolean; onClick: (event: any) => void; }) => JSX.Element;
    CancelButton?: (props: { onClick: (event: any) => void; }) => JSX.Element;
    defaultValues: V;
};

type State<V> = {
    values: V
};

class ValidatedForm<V extends {}> extends React.PureComponent<Props<V>, State<V>> {
    constructor(props: Props<V>) {
        super(props);
        this.state = {
            values: props.defaultValues,
        };
    }

    onSubmit = () => {
        const { onSubmit } = this.props;
        const { values } = this.state;
        onSubmit(values).catch((error: any) => {
            console.log(error);
        });
    }

    render() {
        return (
            <form>
            </form>
        );
    }
}

export default ValidatedForm;
