import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camera-capture',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css'],
})
export class CameraCaptureComponent {
  @ViewChild('fileInput') fileInput: any;

  constructor() {}

  selectedImagesBase64: string[] = [];
  selectedImagesUrlBase64: string[] = [];
  isReaderBusy: boolean = false;
  selectedBase64Url: string = ''; // Variable para almacenar la URL en base64 seleccionada

  openCamera() {
    this.fileInput.nativeElement.click();
  }

  handleCameraInput(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      if (this.isReaderBusy) {
        console.log('FileReader está ocupado. Espere a que termine de leer el archivo actual.');
        return;
      }

      const file = selectedFiles[0];
      // Verificamos que el archivo sea una imagen
      if (file.type.startsWith('image/')) {
        this.isReaderBusy = true;
        const reader = new FileReader();
        reader.onloadend = () => {
          this.isReaderBusy = false;
          if (reader.readyState === FileReader.DONE) {
            const imageBase64 = reader.result as string;
            if (imageBase64) {
              if (this.selectedImagesBase64.length === 2) {
                // Si ya hay dos imágenes seleccionadas, eliminamos la última
                this.selectedImagesBase64.pop();
                this.selectedImagesUrlBase64.pop();
              }
              // Redimensionamos la imagen si su altura es mayor a 3000px
              const img = new Image();
              img.onload = () => {
                const MAX_HEIGHT = 1900;
                if (img.width > MAX_HEIGHT) {
                  const scaleFactor = MAX_HEIGHT / img.height;
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width * scaleFactor;
                  canvas.height = MAX_HEIGHT;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                  const resizedBase64 = canvas.toDataURL('image/jpeg');
                  this.selectedImagesBase64.push(resizedBase64);
                  this.selectedImagesUrlBase64.push(resizedBase64);
                } else {
                  this.selectedImagesBase64.push(imageBase64);
                  this.selectedImagesUrlBase64.push(imageBase64);
                }
              };
              img.src = imageBase64;
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.error('El archivo seleccionado no es una imagen.');
      }
    }
  }

  showBase64(base64Url: string) {
    this.selectedBase64Url = base64Url; // Actualiza la variable con la URL en base64 seleccionada
  }

  copyToClipboard() {
    if (this.selectedBase64Url) {
      navigator.clipboard.writeText(this.selectedBase64Url)
        .then(() => {
          console.log('URL en base64 copiada al portapapeles con éxito.');
        })
        .catch((error) => {
          console.error('Error al copiar la URL en base64 al portapapeles:', error);
        });
    }
  }
}
