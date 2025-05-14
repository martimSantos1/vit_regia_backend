import { io } from '../loaders/socket';

interface SensorData {
  temp: number;
  ph: number;
}

export class DataService {
  public processSensorData(data: SensorData): void {
    console.log('Processando dados no serviço:', data);

    // Emitir para todos os clientes conectados
    io.emit('data', data);

    // Futuro: Guardar no InfluxDB aqui
  }
}
