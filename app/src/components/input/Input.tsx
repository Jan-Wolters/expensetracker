import React, { forwardRef, useEffect, useRef } from "react";
import { FlexBox, FlexItem, View, ViewProps } from "../../views";
import { cn } from "../../utils";

import "./styles/input.scss";

export const Input = forwardRef(({ type, name, onChange, placeholder = name, className, value = "", disabled, ...rest }: InputProps, ref: React.Ref<HTMLInputElement>) =>
{
	const [state, setState] = React.useState(value);

	const [hasFocus, setFocus] = React.useState(false);

	const placeholderRef = useRef<HTMLInputElement | null>(null);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		onChange && onChange(e);

		if (e.isDefaultPrevented())
			return;

		setState(e.target.value);
	};

	useEffect(() => 
	{
		if(value !== state)
			setState(value);
	}, [value]);

	return (
		<View className={cn("input", { className, focus: hasFocus })} {...rest}>
			<FlexBox absolute className="top" horizontal>
				<FlexItem className="border-top-left" base={15} />
				<FlexItem ref={placeholderRef} className={cn("placeholder", { focus: state.toString().length > 0 || hasFocus })} shrink={hasFocus ? 0 : 1} grow={0}>
					{placeholder || name}
				</FlexItem>
				<FlexItem className="border-top-right" />
			</FlexBox>
			<input ref={ref} onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} disabled={disabled} type={type} onChange={changeHandler} value={state.toString()} />
		</View>
	);
});

export type InputProps = {
	name: string;
	type?: "text" | "email" | "password" | "tel";
	placeholder?: string;
	value?: string | number;
	disabled?: boolean;
} & Omit<ViewProps<"input">, "type">;
