import { FlexBox, FlexItem } from "../../views";
import React from "react";

export const InputGroup = ({ children }: InputGroupProps) =>
{
	return (
		<FlexBox horizontal style={{ gap: "15px" }}>
			{React.Children.toArray(children).map((child, i) => (
				<FlexItem key={i}>
					{child}
				</FlexItem>
			))}
		</FlexBox>
	)
};

type InputGroupProps = React.PropsWithChildren;
