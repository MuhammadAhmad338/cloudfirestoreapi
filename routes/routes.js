const express = require('express');
const router = express.Router();
const Firestore = require("@google-cloud/firestore");
const useMiddleware = require('../middlewares/middlewares');
const path = require("path");

const db = new Firestore({
    projectId: 'famous-rhythm-362419',
    keyFilename: path.join(__dirname, '../creds.json')
});
router.use(useMiddleware);

router.get('/:breed', async (req, res) => {
    const breed = req.params.breed;
    const query = db.collection('dogs').where('name', '==', breed);
    const querySnapshot = await query.get();

    if (querySnapshot.size > 0) {
        res.json(querySnapshot.docs[0].data());
    } else {
        res.json({ status: 'Not Found' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = db.collection('dogs').where('id', '==', id);
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        res.json(querySnapshot.docs[0].data());
    } else {
        res.json({ status: 'Not Found!' });
    }
});

router.get("/", async (req, res) => {
    try {
        let collectionQuery = db.collection('dogs');
        collectionQuery.get().then((snapshot) => {
            const dogs = snapshot.docs.map((doc) => {
                return {
                  lifeExpectancy: doc.data().lifeExpectancy,
                  origin: doc.data().origin,
                  name: doc.data().name,
                  id: doc.data().id,
                  type: doc.data().type,
                };
              });
              res.json(collectionQuery);       
          });
    } catch (error) {
        res.json({ status: 'Not Found!' });
    }
});

router.post("/", async (req, res) => {
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

router.put('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            lifeExpectancy: req.body.lifeExpectancy,
            name: req.body.name,
            origin: req.body.origin,
            type: req.body.type
        }
        await db.collection('dogs').doc(id).update(data);

        res.json({ status: 'Success updated', data: { updateDog: data } });
    } catch (error) {
        res.json({ status: `Some error occured ${error}` });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('dogs').doc(id).delete();
        res.json({ status: "Got Deleted" });
    } catch (error) {
        res.json({ status: `Some error Occured ${error}` });
    }
});

module.exports = router;