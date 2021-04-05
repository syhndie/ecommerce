//fs is library that inteacts with the file system
const fs = require('fs');
const crypto =  require('crypto');
const util = require('util');

const scrypt= util.promisify(crypto.scrypt);

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

    //we are assuming that the attrs object always has an 
    //email property and a password property, both are strings
    async create(attrs) {
        attrs.id = this.randomId();
        
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);

        return record;
    }

    //saved === password saved in users.json
    //supplied === password user typed in
    async comparePasswords(saved, supplied) {
        debugger;
        //take saved password, and split it into the salted & hashed
        //password, and the salt that was used
        const[hashed, salt] = saved.split('.');

        //salt and hash the supplied password - this is saved as a buffer
        const buf = await scrypt(supplied, salt, 64);

        return hashed === buf.toString('hex');
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

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found.`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    //returns the FIRST record that meets the filter criteria
    async getOneBy(filters) {
        const records = await this.getAll();

        //use for of to iterate through an array
        for (let record of records ) {
            let found = true;

            //use for in to iterate through an object
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}

//export an instance of the user repository because you only 
//ever want one and this ensures that is the case
module.exports = new UsersRepository('users.json');