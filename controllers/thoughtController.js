const { Thought, User } = require('../models');

module.exports = {

  /// Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then(thought => res.json(thought))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  },

  // Get thought by ID
  getSingleThought(req, res) {
  Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought with this ID'  })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
    .then((thought) => {
        return User.findOneAndUpdate(
          {_id: req.body.userId},
          {$push: { thoughts: thought._id}},
          { runValidators: true, new: true }
        )
    })
    .then((user) =>
    !user
      ? res
        .status(404)
        .json({ message: 'No user found with that ID' })
      : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
    },
    
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'Thought has been deleted!' })
      )
    .catch((err) => res.status(500).json(err));
  },
  
  // Create a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((thought) =>
      !thought
        ? res
          .status(404)
          .json({ message: 'No reaction found with that ID' })
        : res.json(thought)
      )
    .catch((err) => res.status(500).json(err));
  },

  // Delete a reaction
  deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
}
