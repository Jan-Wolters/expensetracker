import React from "react"

export const cn = <T extends { [key: string]: any }>(defaultClassName: string, { className = "", ...props }: T, ...classNames: string[]): string =>
{
	const classes = [defaultClassName, className, ...classNames].filter(s => !!s);

	for (const k in props)
	{
		if (props[k] === true)
			classes.push(k);
		else if (typeof props[k] === "string")
			classes.push(`${k}-${props[k]}`);
	}

	return classes.join(" ");
};

export const Null: React.FC = () => null;

export const match = <T extends string | number | symbol | undefined>(value: T, match: { [K in NonNullable<T>]: React.FC }) =>
{
	const Component = React.useMemo(() => 
	{
		if (value === undefined)
			return Null;

		const found = match[value];

		if (!found)
			return Null;
		return found;
	}, [value]);

	return React.createElement(Component);
};

export const preventDefault = <T extends React.UIEvent>(callback?: (e: T) => any) => (e: T) =>
{
	e.stopPropagation();
	e.preventDefault();
	callback && callback(e);
};
