
import { Service } from "./Service";
import { TelefoonCentraal } from "../tabels"; { }
import fetch from 'node-fetch'; // Assuming you're using Node.js environment for this code

export class Telefoon extends Service {
    protected async initialize() {
        await this.execute();
        setInterval(this.execute, 15000);
    }

    public readonly getDataFromDB = async () => {
        const rows = await TelefoonCentraal.select(['companyId', 'host']);
        if (rows.length === 0) return [];
        return rows.map(row => ({
            companyId: row.companyId,
            host: row.host,
        }));
    };

    private readonly execute = async () => {
        try {
            console.log('start ping');
            const dataList = await this.getDataFromDB();

            //console.log('Data fetched from the database:', dataList);

            for (const { host } of dataList) {

                const alive = await this.isAlive(host);
                if (!alive)
                    console.log(`${host} is offline!`);
            }
        } catch (error) {
            console.error('Error during ping:', error);
        }
    };



    public readonly isAlive = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url);
            //console.log(`Status for ${url}: ${response.status}`);
            return response.status === 200;
        } catch (error) {
            console.error(`Error while checking status for ${url}:`, error);
            return false;
        }
    };
}
