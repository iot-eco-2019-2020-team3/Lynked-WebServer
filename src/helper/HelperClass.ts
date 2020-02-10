class Helper {
    constructor() {
        
    }

    static MakeStringSlackConform(name: string): string {
        name = name.substring(0, 80);
        name = name.replace(" ", "_");
        name = name.replace(/[^a-zA-Z0-9]/g, '_');
        name = name.toLocaleLowerCase();
        return name;
    }
}

export default Helper;