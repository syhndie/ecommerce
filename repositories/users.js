//fs is library that inteacts with the file system
const fs = require('fs');
const crypto =  require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt= util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
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
}

//export an instance of the user repository because you only 
//ever want one and this ensures that is the case
module.exports = new UsersRepository('users.json');