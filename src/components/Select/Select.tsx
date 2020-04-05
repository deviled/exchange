import React, {ChangeEvent} from 'react';

interface SelectOption {
	value: any;
	label: string;
}

interface SelectProps {
	dataQa?: string;
	value: any;
	options: Array<SelectOption>;
	onChange: (value: string) => void;
}

export const handleChangeEvent = (callback: SelectProps['onChange']) => {
	return ({target}: ChangeEvent<any>) => {
		callback && callback(target.value);
	};
};

export function Select(props: SelectProps) {
	return (
        <select
			data-qa={props.dataQa || null}
            value={props.value}
            onChange={handleChangeEvent(props.onChange)}
        >
			{
				props.options.map(o => (
					<option
						key={o.value}
						value={o.value}
					>
						{o.label}
					</option>
				))
			}
        </select>
	);
}