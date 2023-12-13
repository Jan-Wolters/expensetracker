import { react } from "../utils";
import { ViewDirection } from "./ViewDirection";
import React, { forwardRef, useMemo } from "react";

import "./styles/view.scss";

export const View = forwardRef(<T extends ViewType>({ fill, type, centered, fixed, absolute, relative, inline, float, className, children, ...rest }: ViewProps<T>, ref: React.ForwardedRef<InferElementType<T>>) =>
{
	const position = useMemo(() => 
	{
		const targets = { fixed, absolute };

		for (const k in targets)
			if ((targets as any)[k])
				return k;

		return "relative";
	}, [fixed, absolute, relative]);

	const cn = react.cn("view", { className, fill, centered, inline, float }, position);

	return React.createElement(type || "div", {
		className: cn,
		ref,
		...rest
	}, children);
});

export type ViewType = keyof React.ReactHTML;

type InferElementType<T extends ViewType> = React.ReactHTML[T] extends React.DetailedHTMLFactory<any, infer HtmlType> ? HtmlType : never;

export type ViewProps<T extends ViewType> = HtmlProps<InferElementType<T>, {
	fill?: ViewDirection | boolean;
	centered?: ViewDirection | boolean;
	position?: ViewPosition;
	inline?: boolean | "block";
	type?: T;
	float?: "left" | "right";
} & ViewPosition>;

export type ViewPosition = {
	absolute: true;
	relative?: never;
	fixed?: never;
} | {
	absolute?: never;
	relative: true;
	fixed?: never;
} | {
	absolute?: never;
	relative?: never;
	fixed: true;
};
