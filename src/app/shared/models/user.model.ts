export class User {
    id: string;
    fullname: string;
    username: string;
    email: string;
    roles: Array<string>;

    /**
     *
     */
    constructor() {
        this.username = 'main';
    }
}
