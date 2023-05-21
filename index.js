const express = require("express");
const cors = require("cors");
const path = require('path');
const Firestore = require("@google-cloud/firestore");

const app = express();
const db = new Firestore({
    projectId: 'famous-rhythm-362419',
    keyFilename: path.join(__dirname, './creds.json')
});

app.use(express.json());
// Enable CORS for all routes
app.use(cors());
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Barkbark rest api is listening at the: ${port}`);
});

app.get("/", async (req, res) => {
    res.json({ status: 'Bark Bark ready to roll' });
});

app.get("/ahmad", async (req, res) => {
    res.json({status: 'Ahmad hello world is the best app'});
});

app.get("/waleed", async (req, res) => {
    res.json({status: 'Hello Waleed is the good boy!'});
});

app.get("/:breed", async (req, res) => {
    const breed = req.params.breed;
    const query = db.collection('dogs').where('name', '==', breed);
    const querySnapshot = await query.get();

    if (querySnapshot.size > 0) {
        res.json(querySnapshot.docs[0].data());
    } else {
        res.json({ status: 'Not Found' });
    }
}); 

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = db.collection('dogs').where('id', '==', id);
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        res.json(querySnapshot.docs[0].data());
    } else {
       res.json({status: 'Not Found!'});
    }
});

app.post("/", async (req, res) => {
    const data = {
        id: req.body.id,
        lifeExpectancy: req.body.lifeExpectancy,
        name: req.body.name,
        origin: req.body.origin,
        type: req.body.type
    }
    await db.collection('dogs').doc(`${req.body.id}`).set(data);
    res.json({ status: 'success', data: { dog: data } });
});

app.put('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            lifeExpectancy: req.body.lifeExpectancy,
            name: req.body.name,
            origin: req.body.origin,
            type: req.body.type
        }
        await db.collection('dogs').doc(id).update(data);

        res.json({status: 'Success updated', data: {updateDog: data}});
    } catch(error) {
      res.json({status: `Some error occured ${error}`});
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('dogs').doc(id).delete();
        res.json({status: "Got Deleted"});
    } catch(error) {
        res.json({status: `Some error occured ${error}`});
    }
});

