const axios = require('axios');
const qs = require('qs');

const { SF_CLIENT_ID, SF_CLIENT_SECRET} = process.env;

async function getSalesforceToken() {
  const tokenData = {
    grant_type: 'client_credentials',
    client_id: SF_CLIENT_ID,
    client_secret: SF_CLIENT_SECRET,
  };

  const res = await axios.post(
    `${process.env.SF_DOMAIN}/services/oauth2/token`,
    qs.stringify(tokenData),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
  );

  return res.data;
}

exports.syncUserToSalesforce = async (req, res) => {
  try {
    const { firstName, lastName, email, company } = req.body;
    const { access_token, instance_url } = await getSalesforceToken();

    const accountRes = await axios.post(
      `${instance_url}/services/data/v60.0/sobjects/Account`,
      { Name: company },
      { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json'}}
    );

    const accountId = accountRes.data.id;

    const contactRes = await axios.post(
      `${instance_url}/services/data/v60.0/sobjects/Contact`,
      {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        AccountId: accountId,
      },
      { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json'}}
    );

    res.json({
      message: 'Successfully sent to salesforce',
      accountId,
      contactId: contactRes.data.id,
    });

  } catch (err) {
    console.error('Salesforce error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Salesforce error' });
  }
};
