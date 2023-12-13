import { cn } from "../utils";
import React from "react";
import { View, ViewProps } from "./View";

const getClassName = (props: IconType) => React.useMemo(() => 
{
	for(const key in props)
	{
		const k = key as keyof typeof props; 
		
		if(props[k])
			return `fa-${k}`;
	}
	return "fa-solid";
}, [props.duotone, props.light, props.regular, props.solid, props.thin]);

export const Icon = ({ icon, sharp, duotone, light, regular, solid, thin, ...rest }: IconProps) =>
{
	return <View type="i" className={cn(`fa-${icon}`, { [`fa-sharp`]: sharp }, getClassName({ duotone, light, regular, solid, thin }))} {...rest} />;
};

export type IconType = Partial<{
	solid: true | undefined;
	regular: true | undefined;
	light: true | undefined;
	duotone: true | undefined;
	thin: true | undefined;
}>;

export type IconProps = ViewProps<"i"> & IconType & {
	sharp?: boolean;
	icon: string;
};
