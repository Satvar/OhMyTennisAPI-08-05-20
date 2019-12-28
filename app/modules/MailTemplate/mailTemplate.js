const db_library = require('../_helpers/db_library');

exports.getMailTemplate = async function(id) {
    return await new Promise((resolve, reject) => {
        
         db_library.execute("SELECT template from email_template where id ="+id+"").then((value) => {
                resolve(value);
            }).catch(err => {
                reject(err)
            });
    });
}