const fs = require('fs');
const path = require('path');
const { Template, Question } = require('../models');
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch'); 
require('dotenv').config();

const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch});

exports.exportTemplateAsJSON = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findByPk(id, {
      include: [{ model: Question, as: 'questions' }]
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const jsonData = {
      id: template.id,
      title: template.title,
      authorId: template.authorId,
      createdAt: template.createdAt,
      questions: template.questions.map(q => ({
        id: q.id,
        title: q.title,
        type: q.type,
        options: q.options
      })),
    };

    const fileName = `${template.title.replace(/\s+/g, '_')}_${Date.now()}.json`;

    const exportPath = path.join(__dirname, '..', 'exports', fileName);
    fs.writeFileSync(exportPath, JSON.stringify(jsonData, null, 2));

    const dropboxUploadPath = `/form-uploads/${fileName}`;

    await dropbox.filesUpload({
      path: dropboxUploadPath,
      contents: JSON.stringify(jsonData, null, 2),
      mode: { '.tag': 'add' }
    });

    return res.status(200).json({
      message: 'Template exported and uploaded to Dropbox',
      fileName,
      dropboxPath: dropboxUploadPath
    });
  } catch (error) {
    console.error('exportTemplateAsJSON error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
