export interface IOrganization {
  id?: number;
  name: string;
}

export class Organization implements IOrganization {
  name: string;
  id?: number;

  constructor(name: string) {
    this.name = name || '';
  }
}
