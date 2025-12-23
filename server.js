const app = require('./api/index');
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
});
