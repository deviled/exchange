import React, {ChangeEvent} from 'react';
import styles from './Select.module.scss';

interface SelectOption {
	value: any;
	label: string;
}

interface SelectProps {
	dataQa?: string;
	value: any;
	options: Array<SelectOption>;
	onChange?: (value: string) => void;
	styles?: string;
}

export const handleChangeEvent = (callback: SelectProps['onChange']) => {
	return ({target}: ChangeEvent<any>) => {
		callback && callback(target.value);
	};
};

export function Select(props: SelectProps) {
	return (
		<div className={styles['select']}>
			<select
				className={[styles['select__input'], props.styles].filter(Boolean).join(' ')}
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
		</div>
	);
}