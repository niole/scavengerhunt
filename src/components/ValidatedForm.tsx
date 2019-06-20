import React from 'react';
import Button from '@material-ui/core/Button';

const Error = ({ message }: { message?: string }) => (
    message ? <span>{message}</span> : null
);

export type PluggableProps<C, V> = {
    onChange: (event: C) => void;
    value: V;
};

export type Validator<V> = {
    validator: (value: V) => boolean;
    error: (value: V) => string;
} | undefined;

export type PluggableInput<C, V> = (props: PluggableProps<C, V>) => JSX.Element;

export type ValidatedInput<A, C, V> = {
    key: string;
    validator: Validator<A>;
    Input: PluggableInput<C, V>;
};

type Props<V> = {
    inputs: ValidatedInput<any, any, any>[][];
    onSubmit: (values: V) => Promise<void>;
    onCancel: () => void;
    SubmitButton?: (props: { disabled: boolean; onClick: (event: any) => void; }) => JSX.Element;
    CancelButton?: (props: { onClick: (event: any) => void; }) => JSX.Element;
    defaultValues: V;
};

type State<V> = {
    values: V
    errors: { [key: string]: string | undefined };
    disableSubmit: boolean;
    submitError?: string;
};

class ValidatedForm<V extends { [key: string]: any }> extends React.PureComponent<Props<V>, State<V>> {
    constructor(props: Props<V>) {
        super(props);
        this.state = {
            values: props.defaultValues,
            errors: {},
            disableSubmit: false,
        };
    }

    onSubmit = () => {
        const { onSubmit } = this.props;
        const { values } = this.state;
        onSubmit(values).catch((error: any) => {
            this.setState({ disableSubmit: true, submitError: `there was an error: ${error}` });
        });
    }

    handleInputChange = (key: string, validation: Validator<any>) => (event: any) => {
        this.setState({ submitError: undefined });
        if (validation) {
            const { errors, values } = this.state;
            const { validator, error } = validation;
            const invalid = !validator(event);
            if (invalid) {
                this.setState({ disableSubmit: true, errors: { ...errors, [key]: error(values[key]) } });
            } else {
                const newErrors = { ...errors, [key]: undefined };
                const shouldEnableSubmit = !!Object.values(newErrors).find((error: any) => !!error);
                this.setState({ errors: newErrors, disableSubmit: !shouldEnableSubmit });
            }
        }
    }

    render() {
        const { inputs, onCancel } = this.props;
        const { submitError, disableSubmit, errors, values } = this.state;
        return (
            <form>
                {inputs.map((inputRow: ValidatedInput<any, any, any>[]) => (
                    <div>
                        {inputRow.map(({ key, Input, validator }: ValidatedInput<any, any, any>) => (
                            <span>
                                <Input
                                    onChange={this.handleInputChange(key, validator)}
                                    value={values[key]}
                                />
                                <Error message={errors[key]} />
                            </span>
                        ))}
                    </div>
                ))}
                <div>
                    <Error message={submitError} />
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button disabled={disableSubmit} onClick={this.onSubmit} type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
}

export default ValidatedForm;
