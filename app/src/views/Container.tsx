import { cn } from "../utils/react";
import { View, ViewProps } from "./View";

import "./styles/container.scss";

export const Container = ({ className, ...rest }: ViewProps<"div">) => (
	<View className={cn("container", { className })} {...rest} />
);
