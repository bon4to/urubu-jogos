import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CardScannerService {
  constructor() { }

  /**
   * Abre a câmera do dispositivo para escanear um cartão
   * @returns Promise com a imagem capturada em formato base64
   */
  async scanCard(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      // retorna a imagem em formato base64
      return `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
      throw error;
    }
  }
} 