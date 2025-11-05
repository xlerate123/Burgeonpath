import { addSubscriber, getSubscribers } from "./subscriberFiresstore.js";

export const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await addSubscriber(email);
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//list all subscribers (admin use)
export const listSubscribers = async (req, res) => {
  try {
    const subscribers = await getSubscribers();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
