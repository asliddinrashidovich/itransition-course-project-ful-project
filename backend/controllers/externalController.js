const { User, Template, Question, Answer } = require('../models');

exports.getAggregatedTemplates = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Missing token' });

  try {
    const user = await User.findOne({ where: { api_token: token } });
    if (!user) return res.status(403).json({ message: 'Invalid token' });

    const templates = await Template.findAll({
      where: { authorId: user.id },
      include: [{
        model: Question,
        as: 'questions',
        include: [{ model: Answer, as: 'answers' }]
      }]
    });

    const result = templates.map(template => {
      const questions = template.questions.map(question => {
        const answers = question.answers.map(a => a.value);
        let stats = {};

        if (question.type === 'number') {
          const numbers = answers.map(Number).filter(n => !isNaN(n));
          const total = numbers.reduce((sum, n) => sum + n, 0);
          stats = {
            count: numbers.length,
            average: total / (numbers.length || 1),
            min: Math.min(...numbers),
            max: Math.max(...numbers),
          };
        } else {
          const freq = {};
          answers.forEach(val => {
            freq[val] = (freq[val] || 0) + 1;
          });
          const top = Object.entries(freq).sort((a, b) => b[1] - a[1]);
          stats = {
            top_answers: top.slice(0, 3).map(([value]) => value),
          };
        }

        return {
          id: question.id,
          text: question.text,
          type: question.type,
          stats
        };
      });

      return {
        template_id: template.id,
        title: template.title,
        author_email: user.email,
        questions
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
