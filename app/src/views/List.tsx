import React from "react";

export const List = <P extends any, R = P>({ Component, items, adapter }: ListProps<P, R>) =>
{
	const list = adapter ? items.map(adapter) : items;

	return (
		<>
			{list.map((item, i) => <Component key={i} item={item as R} />)}
		</>
	);
};

export type ListProps<P, R = P> = {
	Component: React.FC<{ item: R }>;
	items: P[];
	adapter?: ListAdapter<P, R>;
};

export type ListAdapter<P, R = P> = (item: P) => R;
