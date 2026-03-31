import SensorLog from '../models/SensorLog.js';
import Device from '../models/Device.js';

export const storeSensorData = async (req, res) => {
  try {
    const { device_id, temperature, humidity, pump_state, total_runtime, status } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    // Simpan data sensor
    const sensorData = await SensorLog.create({
      device_id,
      temperature: temperature || null,
      humidity: humidity || null,
      pump_state: pump_state || 'idle',
      total_runtime: total_runtime || 0,
      status: status || 'normal'
    });

    // Update device status
    await Device.updateStatus(device_id, status || 'normal');

    // Broadcast real-time
    req.app.io.emit('sensor_update', sensorData);

    res.status(201).json({
      success: true,
      data: sensorData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLatestData = async (req, res) => {
  try {
    const { device_id } = req.params;
    const data = await SensorLog.getLatest(device_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const { device_id } = req.params;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    const data = await SensorLog.getByDateRange(device_id, startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};