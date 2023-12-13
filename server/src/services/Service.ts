export abstract class Service {

    public static readonly start = async (...services: ServiceClass<any>[]): Promise<void> => {
        try {
            await Promise.all(services.map(Class => {
                const service = new Class();
                return service.initialize.bind(service)();
            }));
        }
        catch (e) {
            console.log("SERVICE ERROR:", e);
        }
    };

    protected abstract initialize(): Promise<void> | void;
}

interface ServiceClass<T extends Service> {
    new(): T;
}