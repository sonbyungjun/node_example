const { Good, Auction, User, sequelize } = require('./models');
const schedule = require('node-schedule');

module.exports = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    const targets = await Good.findAll({
      where: { soldId: null },
    });
    for (const target of targets) {
      const end = new Date(target.cratedAt);
      end.setHours(end.getHours() + target.end);
      if (new Date() > end) {
        const success = await Auction.findOne({
          where: { goodId: target.id },
          order: [['bid', 'DESC']],
        });
        if (success) {
          await Good.update({soldId: success.userId}, {where: {id: target.id}});
          await User.update({
            money: sequelize.literal(`money - ${success.bid}`),
          }, {
            where: {id: success.userId},
          });
        } else {
          await Good.update({ soldId: target.ownerId }, { where: { id: target.id } });
        }
      } else {
        schedule.scheduledJobs(end, async () => {
          const success = await Auction.findOne({
            where: { goodId: target.id },
            order: [['bid', 'DESC']],
          });
          if (success) {
            await Good.update({soldId: success.userId}, {where: {id: target.id}});
            await User.update({
              money: sequelize.literal(`money - ${success.bid}`),
            }, {
              where: {id: success.userId},
            });
          } else {
            await Good.update({ soldId: target.ownerId }, { where: { id: target.id } });
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
