const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout({
        //we must specify enctype as multipart/form-data 
        //to allow uploading image using multer middleware
        content: `
            <form method="POST" enctype="multipart/form-data">
                <input placeholder="Title" name="title" />
                ${getError(errors, 'title')}
                <input placeholder="Price" name="price" />
                ${getError(errors, 'price')}
                <input type="file" name="image" />
                <button>Submit</button>
            </form>
        `
    });
};