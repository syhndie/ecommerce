module.exports = ({ content }) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Admin Only</title>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;
};