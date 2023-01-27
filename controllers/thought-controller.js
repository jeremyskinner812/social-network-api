const { Thought, User } = require('../models');
const { db } = require('../models/User');

const thoughtController = {

    getThoughts(req, res) {
        Thought.find()
            .then((dbThoughtData) => {
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404)
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404)
                }
                res.json({ message: "Thought added to db"});
            })
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                return res.status(404);
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                return res.status(404);
                }
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                return res.status(404);
                }
                res.json({ message: "Thought was deleted" });
            })
            .catch((err) => res.status(500).json(err));

    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404);
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404);
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtController;