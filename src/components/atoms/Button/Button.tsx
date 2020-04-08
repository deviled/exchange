import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
	dataQa?: string;
	type?: 'button' | 'submit' | 'reset' | undefined;
	isDisabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	buttonStyles?: string;
	tabIndex?: number;
}

export const Button: React.FunctionComponent<ButtonProps> = props => (
	<button
		data-qa={props.dataQa}
		className={[
			styles.button,
			props.buttonStyles,
		].filter(Boolean).join(' ')}
		type={props.type || 'button'}
		disabled={props.isDisabled}
		onClick={e => props.onClick && props.onClick(e)}
		tabIndex={props.tabIndex}
	>
		{props?.children}
	</button>
);
