const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const os = require('os');
const path = require('path');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const storage = 'C:\\Users\\yaakov\\Documents\\GitHub\\hyperautomation\\temp';

const randomString = () => {
   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.post('/', (req, res) => {
   console.log(req.body);

   const fileText = Object.keys(req.body).join(',') + os.EOL + Object.values(req.body).join(',');
   fs.writeFileSync(path.join(storage, randomString() + '.csv'), fileText);
   res.send('received');

});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));