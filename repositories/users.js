//fs is library that inteacts with the file system
const fs = require('fs');

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
}

const repo = new UsersRepository('users.json');