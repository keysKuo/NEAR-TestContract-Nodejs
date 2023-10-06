require('dotenv').config();
const PORT = process.env.PORT || 8080;
const router = require('./resources/routes');
const { load_contract } = require('../../contract/index.js');
const app = require('./config/server').init();

router(app);

app.get('/', async (req, res, next) => {
    const contract = await load_contract();
    let result = await contract.view_all_jobs(
        
    );
    return res.json(result);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})