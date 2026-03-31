import Device from '../models/Device.js';

export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.getAll();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const device = await Device.getByDeviceId(device_id);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerDevice = async (req, res) => {
  try {
    const { device_id, api_key, location } = req.body;

    if (!device_id || !api_key) {
      return res.status(400).json({ error: 'device_id and api_key required' });
    }

    const device = await Device.create({
      device_id,
      api_key,
      location: location || 'Unknown',
      status: 'alert'
    });

    res.status(201).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const activatePump = async (req, res) => {
  try {
    const { device_id } = req.params;

    // Broadcast command ke device via socket
    req.app.io.emit('pump_command', {
      device_id,
      action: 'activate'
    });

    res.json({
      success: true,
      message: 'Pump activation command sent'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deactivatePump = async (req, res) => {
  try {
    const { device_id } = req.params;

    req.app.io.emit('pump_command', {
      device_id,
      action: 'deactivate'
    });

    res.json({
      success: true,
      message: 'Pump deactivation command sent'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};