//fs is library that inteacts with the file system
const fs = require('fs');
const crypto =  require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;

        //constructors are not able to be async - can't use promise-based fs.access 
        //if we use vanilla fs.access we would have to put it in a seperate method to be able to make it async
        //so, we will use fs.accessSync to check to see if the file exists already
        //this is ok because we will only ever run the constructor once
        //the try block checks to see if the file already exists
        //if the file doesn't exist the catch block creates it
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {    
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
            })
        );
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
    }
    
    async writeAll(records) {
        await fs.promises.writeFile(
            this.filename, 
            //the third argument to json.stringify designates the level of indentation to use
            JSON.stringify(records, null, 2)
        );
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
}
const test = async () => {
    const repo = new UsersRepository('users.json');

    const user = await repo.getOne('51077923a');
    
    console.log(user);
};

test();
