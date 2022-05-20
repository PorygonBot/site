interface RadioProps {
    rule: string;
    currentRule: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CheckboxProps {
    rule: string;
    currentRule: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Radio(props: RadioProps) {
    return (
        <div>
            <input
                type="radio"
                id="D"
                name={props.rule}
                value="D"
                checked={props.currentRule === "D"}
                onChange={props.onChange}
            />
            <label>Direct</label>
            <input
                type="radio"
                id="P"
                name={props.rule}
                value="P"
                checked={props.currentRule === "P"}
                onChange={props.onChange}
            />
            <label>Passive</label>
            <input
                type="radio"
                id="N"
                name={props.rule}
                value="N"
                checked={props.currentRule === "N"}
                onChange={props.onChange}
            />
            <label>None</label>
        </div>
    );
};

export function Checkbox(props: CheckboxProps) {
    return (
        <input
            type="checkbox"
            name={props.rule}
            checked={props.currentRule}
            onChange={props.onChange}
        />
    );
};
