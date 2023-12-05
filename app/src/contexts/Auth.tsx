import React, { useState } from "react";

export namespace Auth
{
	const Context = React.createContext<Type>({
		isLoggedIn: false,
		setIsLoggedIn: () => {}
	});

	export const use = () => React.useContext(Context);

	export type Type = {
		isLoggedIn: boolean;
		setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; 
	};

	export const Provider = ({ children, isLoggedIn = false }: React.PropsWithChildren<{ isLoggedIn?: boolean }>) =>
	{
		const [_isLoggedIn, setIsLoggedIn] = useState(isLoggedIn);

		return (
			<Context.Provider value={{ isLoggedIn: _isLoggedIn, setIsLoggedIn }}>
				{children}
			</Context.Provider>
		);
	};
}