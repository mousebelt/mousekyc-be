const moment = require('moment');
const Queue = require('bee-queue');


const express = require('express');

const app = express();

const identityDocumentQueue = new Queue('identityDocument');


app.get('/', (req, res) => {
  const documentJob = identityDocumentQueue.createJob({ userId: '1342132154132', documentKey: 'passport1.jpg' }).save();
  documentJob.on('succeeded', (/* result */) => {
    console.log(`Received result for job ${documentJob.id}: result`);
  });
  return res.send('Job added!');
});

app.listen(8888, () => console.log('Passport worker listening on port 8888!'));


identityDocumentQueue.process((job, done) => {
  console.log(`[CV] Processing job ${job.id} - Processing file ${job.data.documentKey} for ${job.data.userId}.`);

  // Here is where we would fetch the data for the file from the database.
  // I am passing in a documentKey of a file locally for now.
  // We should either read the file in from gridFS directly, or save to a tmp file in the directory.
  // I am mocking with the filePath parameter.
  const filePath = job.data.documentKey;

  const stdout = require('child_process').execSync(`mrz --json ${filePath}`); // eslint-disable-line
  console.log('[CV] Processing Task Completed.');
  try {
    const matchedPassport = JSON.parse(stdout);
    if(matchedPassport.valid_score > 50) {
      console.log('[CV] Valid document detected.');
      console.log(matchedPassport);
      const match = {};
      match.processed = new Date();
      match.firstname = matchedPassport.names;
      match.lastname = matchedPassport.surname;
      // match.gender = matchedPassport.sex;
      if(matchedPassport.valid_date_of_birth) match.dob = moment(matchedPassport.date_of_birth, 'YYMMDD').toDate();
      if(matchedPassport.valid_expiration_date) match.documentExpireDate = moment(matchedPassport.expiration_date, 'YYMMDD').toDate();
      match.documentId = matchedPassport.number;
      console.log(match);

      // We should update MongoDB and add a record match with the match object
      // Expose this via API to the frontend and allow users to compare based on matched fields.
      // Our Schema is:
      // processed (timestamp of process) - Date
      // firstname (first name of user) - String
      // lastname (last name of user) - String
      // documentId (id on document) - String
      // Date of Birth -- String
      // Date of expiration  -- String
      // Gender (not supported now, leave out. Kept in object for option of future support.)
      return done();
    }
    console.log('[CV] No valid document detected.');
    return done();

  } catch(error) {
    console.log(error);
    return done();
  }
});
