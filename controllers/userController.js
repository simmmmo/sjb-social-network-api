const { User, Thought } = require('../models');

module.exports = {

  // Get all users
  getUsers(req, res) {
    User.find()
    .select('-__v')
    .populate('thoughts')
    .populate('friends')
      .then(user => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Get user by ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.id })
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user)
          )
    .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user))
      .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
      }
    );
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((user) =>
      !user
      ? res.status(404).json({ message: 'No user with this id' })
      : res.json(user)
    )
    .catch(err => res.status(500).json(err));
  },

  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No User with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
    .then(() => res.status(200).json({ message: 'User and thoughts deleted!' }))
    .catch((err) => res.status(500).json(err));
  },

    // Add a friend to a user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((user) =>
      !user
        ? res
          .status(404)
          .json({ message: 'No friend found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },

  // Delete a friend from a user
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((user) =>
      !user
        ? res
          .status(404)
          .json({ user: 'No friend found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
};
