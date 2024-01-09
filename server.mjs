import express from 'express';
import axios from 'axios';
import cors from "cors"

const app = express();
const port = 3001;



app.use(express.json());
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Function to check DID
const checkDid = (did) => {
  // implement logic to ensure we trust the person asking for the VC
  return true;
}

app.get('/issue', async (req, res) => {
  try {
    const { userDid, Email, SharedSecret } = req.query;
    const isDidValid = checkDid(userDid);

    if (isDidValid) {
      const response = await axios.put('http://localhost:8080/v1/credentials', {
        issuer: "did:key:z6Mkkpa1qPcstLPCV8xmzTc849eqmHRSQSBfP333q8gHkLDx",
        verificationMethodId: "did:key:z6Mkkpa1qPcstLPCV8xmzTc849eqmHRSQSBfP333q8gHkLDx#z6Mkkpa1qPcstLPCV8xmzTc849eqmHRSQSBfP333q8gHkLDx",
        subject: userDid,
        schemaId: "125e03d8-e3ee-4edc-aba4-48b1bd86e89d",
        expiry: "2024-09-09T14:48:00.000Z",
        data: {
          Email: Email,
          SharedSecret: SharedSecret
        }
      },
      );
      res.json(response.data);
    } else {
      res.status(400).send('Invalid DID');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('There was an error processing your request');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
})
