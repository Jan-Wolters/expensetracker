import type { Payment, Income, User } from "@server/tabels"

export type UserData = Pick<User, "id" | "username"> & {
    payment: Payment[];
    income: Income[];
};

const createFetcher = (method: "POST" | "PUT" | "DELETE") => async <T>(endpoint: string, data: object = {}): Promise<T> => {
    const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const api = {
    get: async <T>(endpoint: string, data: Record<string, string> = {}): Promise<T> => {
        const response = await fetch(`/api${endpoint}?${new URLSearchParams(data).toString()}`);
        return await response.json();
    },
    post: createFetcher("POST"),
    put: createFetcher("PUT"),
    delete: createFetcher("DELETE")

}

export const login = (username: string, password: string) => api.post<boolean>("/auth/login", { username, password });
export const checkLogin = () => api.get<boolean>("/auth/login");
export const requestLogout = () => api.post<boolean>("/auth/logout");
