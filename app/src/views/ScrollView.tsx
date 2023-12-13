import { cn } from "../utils/react";
import { View, ViewProps } from "./View";
import { ViewDirection } from "./ViewDirection";

import "./styles/scroll-view.scss";

export const ScrollView = ({ scroll, ...rest }: ScrollViewProps) =>
{
	return (
		<View className={cn("scroll-view", { scroll })} {...rest} />
	);
};

export type ScrollViewProps = ViewProps<"div"> & {
	scroll: ViewDirection | "both";
};
