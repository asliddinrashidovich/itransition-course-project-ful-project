const fs = require('fs');
const path = require('path');
const os = require('os');
const { Dropbox } = require('dropbox');
require('dotenv').config();

exports.createSupportTicket = async (req, res) => {
  try {
    const { summary, priority, template, link } = req.body;
    const user = req.user;

    if (!summary || !priority || !link) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const jsonData = {
      "Reported by": user.email,
      "Template": template || 'N/A',
      "Link": link,
      "Priority": priority,
      "Summary": summary,
    };

    const fileName = `ticket_${Date.now()}.json`;
    const tempPath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(tempPath, JSON.stringify(jsonData, null, 2));
    const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
    const dropboxPath = `${process.env.SUPPORT_UPLOAD_PATH}/${fileName}`;
    const fileContent = fs.readFileSync(tempPath);
    const uploadResult = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileContent,
      mode: { '.tag': 'add' },
      autorename: true,
      mute: false,
    });

    console.log('Uploaded to Dropbox:', uploadResult?.result?.path_display);

    fs.unlinkSync(tempPath);

    return res.status(200).json({ message: 'Ticket created and uploaded', file: uploadResult.result.path_display });

  } catch (error) {
    console.error('❌ createSupportTicket error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
