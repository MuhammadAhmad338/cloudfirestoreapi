const express = require('express');
const router = express.Router();
const Firestore = require("@google-cloud/firestore");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const uuid = require("uuid");

const bucketName = "bucket_dog";
// Creates a client using Application Default Credentials
const db = new Firestore({
    projectId: 'famous-rhythm-362419',
    keyFilename: path.join(__dirname, '../creds.json')
});
// Creates a client using Application Default Credentials
const storage = new Storage( {
    projectId: 'famous-rhythm-362419',
    keyFilename: path.join(__dirname, '../creds.json')
});
// It is very important and to get the signed url from the cloud storage google cloud
const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 30 * 60 * 1000, // 15 minutes
};

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
              res.json(dogs);       
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
        type: req.body.type,
        imageUrl: req.body.imageUrl
    }
    console.log(data);
    console.log(uuid.v4());
    const uniqueFilename = `${uuid.v4()}${data.imageUrl}`;
    const file = storage.bucket(bucketName).file(uniqueFilename);

    await file.save('Hello, World!')
    console.log(`File ${uniqueFilename} uploaded.`)
    //var downloadUrl = await storage.bucket(bucketName).file(`${uuid.v4()}-${data.imageUrl}`).getSignedUrl(options);
   //  data.imageUrl = downloadUrl;
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