import { IOrganization } from '@entities';


export interface IOrganizationDao {
    getOne: (email: string) => Promise<IOrganization | null>;
    getAll: () => Promise<IOrganization[]>;
    add: (Organization: IOrganization) => Promise<void>;
    update: (Organization: IOrganization) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export class OrganizationDao implements IOrganizationDao  {


    /**
     * @param email
     */
    public async getOne(email: string): Promise<IOrganization | null> {
        // TODO
        return [] as any;
    }


    /**
     *
     */
    public async getAll(): Promise<IOrganization[]> {
        // TODO
        return [] as any;
    }


    /**
     *
     * @param Organization
     */
    public async add(Organization: IOrganization): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param Organization
     */
    public async update(Organization: IOrganization): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }
}
