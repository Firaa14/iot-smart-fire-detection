import FireEvent from '../models/FireEvent.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await FireEvent.getAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeviceEvents = async (req, res) => {
  try {
    const { device_id } = req.params;
    const events = await FireEvent.getByDevice(device_id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFireEvent = async (req, res) => {
  try {
    const { device_id } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id required' });
    }

    const event = await FireEvent.create({ device_id });

    // Broadcast alert ke semua client
    req.app.io.emit('fire_alert', {
      device_id,
      timestamp: new Date(),
      message: `🔥 Fire detected at ${device_id}!`
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearFireEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    await FireEvent.clear(event_id);

    req.app.io.emit('fire_cleared', {
      event_id,
      timestamp: new Date(),
      message: '✅ Fire event cleared'
    });

    res.json({
      success: true,
      message: 'Fire event cleared'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};