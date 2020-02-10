import { ISlackInfo } from '@entities';
import { pool } from '@dbConnection';


export interface ISlackInfoDao {
    getById: (id: number) => Promise<ISlackInfo | null>;
    getAll: () => Promise<ISlackInfo[]>;
    add: (SlackInfo: ISlackInfo) => Promise<number | void>;
    update: (SlackInfo: ISlackInfo) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export class SlackInfoDao implements ISlackInfoDao {


    /**
     * @param id
     */
    public async getById(id: number): Promise<ISlackInfo | null> {
        if (id == undefined) {
            return null;
        }

        const res = await pool<ISlackInfo>('slack')
            .select()
            .where({
                id: id
            })
            .then(resp => {
                let res = resp[0];
                return res;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
        return res;
    }


    /**
     *
     */
    public async getAll(): Promise<ISlackInfo[]> {
        // TODO
        return [] as any;
    }


    /**
     *
     * @param SlackInfo
     */
    public async add(SlackInfo: ISlackInfo): Promise<number> {
        try {
            const res = pool<ISlackInfo>('slack')
                .insert(SlackInfo)
                .then(response => {
                    return response[0];
                })
                .catch(error => {
                    console.log(error);
                    return 0;
                });

            return res;
        } catch (error) {
            throw error;
        }
    }


    /**
     *
     * @param SlackInfo
     */
    public async update(SlackInfo: ISlackInfo): Promise<void> {
        try {
            pool<ISlackInfo>('slack')
                .where({ id: SlackInfo.id })
                .update(SlackInfo)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        try {
            pool<ISlackInfo>('slack')
                .where({
                    id: id
                })
                .del()
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    }

}
