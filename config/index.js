module.exports = {
    APP: {
        port: process.env.FRIENDLIST_PORT || 8080,
        public_dir: __dirname + '/../public' 
    },
    VK: {
        version: '5.53'
    }, 
    DB: {
        dir: process.env.FRIENDLIST_DB_DIR || __dirname + '/../db', 
        file: process.env.FRIENDLIST_DB_FILE || 'requests.db'
    }
}; 