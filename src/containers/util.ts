export type ChildComponent<O> = (outerProps: O) => JSX.Element;

export type HigherOrderComponent<OuterProps, InnerProps> =
    (Component: ChildComponent<InnerProps & OuterProps>) => ChildComponent<OuterProps>
