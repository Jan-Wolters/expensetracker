import React, { createContext, forwardRef, useContext, useMemo } from "react";
import { react } from "../utils";
import { ViewDirection } from "./ViewDirection";
import { View, ViewPosition, ViewProps } from "./View";

import "./styles/flex.scss";

const FlexContext = createContext<{ direction: ViewDirection | "none" }>({
	direction: "none"
});

const useParentDirection = () =>
{
	const ctx = useContext(FlexContext);
	if (ctx.direction === "none")
		throw new Error("No FlexBox parent found!");
	return ctx.direction;
};

export const FlexBox = forwardRef<HTMLElement, FlexBoxProps>(({ className, vertical, horizontal, children, ...rest }, ref) =>
{
	const dir = React.useMemo(() => !vertical ? "horizontal" : "vertical", [vertical, horizontal]);

	return (
		<View ref={ref} className={react.cn("flex-box", { className, [dir]: true })} {...rest}>
			<FlexContext.Provider value={{ direction: dir }}>
				{children}
			</FlexContext.Provider>
		</View>
	);
});

export type FlexBoxProps = HtmlProps<HTMLDivElement, ViewProps<"div"> & ({
	vertical: true;
	horizontal?: never;
} | {
	vertical?: never;
	horizontal: true;
})>;

export const FlexItem = forwardRef(({ className, children, base, grow, shrink, style = {}, ...rest }: FlexItemProps, ref: React.ForwardedRef<HTMLElement>) =>
{
	const parentDir = useParentDirection();

	const memoStyle = useMemo(() => 
	{
		if (base !== undefined && grow === undefined && shrink === undefined)
		{
			const px = typeof base === "string" ? base : `${base}px`;
			
			return {
				...style,
				[parentDir === "horizontal" ? "width" : "height"]: base,
				flexBasis: px,
			};
		}
		else
		{
			const flexBase = base || "";
			return {
				...style,
				flex: `${grow === undefined || grow === true ? 1 : grow} ${shrink === undefined ? 0 : shrink === true ? 1 : shrink} ${typeof flexBase === "string" ? flexBase : `${flexBase}px`}`,
			};
		}
	}, [base, style]);

	return (
		<View ref={ref} className={react.cn("flex-item", { className })} style={memoStyle} {...rest}>
			{children}
		</View>
	);
});

export type FlexItemProps = HtmlProps<HTMLDivElement, {
	position?: ViewPosition;
	base?: number | string;
	grow?: number | string | boolean;
	shrink?: number | string | boolean;
} & ViewPosition>;
