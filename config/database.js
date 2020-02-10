if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://Brian:brian@jobber-prod-tmspq.mongodb.net/test?retryWrites=true&w=majority'}
}
else{
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/Jobber'
    }
}