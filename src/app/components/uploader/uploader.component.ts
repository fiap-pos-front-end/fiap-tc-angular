import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface ArchiveItem {
  source: SafeHtml;
  ctdocume: string;
  name: string;
  type: string;
  tpdocume: number;
}

@Component({
  selector: 'app-uploader',
  imports: [CommonModule, Toast],
  providers: [MessageService, Toast],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
})
export class UploaderComponent {
  typeAccepted = ['application/pdf', 'image/jpeg', 'image/png'];
  arrObjArchive: ArchiveItem[] = [];
  maxItems: number = 3;
  imageVisible = false;
  selectedImage: SafeHtml | null = null;
  private messageService = inject(MessageService);

  @Input() context: any;

  constructor(private sanitizer: DomSanitizer) {}

  async onSelectFile(data: FileList | any) {
    let dados = data.target?.files ? data.target.files : data.length > 0 ? data : null;
    let arrArchivesError = [];
    let cont = 0;

    if (dados) {
      for (let file of dados) {
        let nameArchive = file.name;
        try {
          const result = await this.readFileAsDataURL(file);
          if (!this.typeAccepted.find((f) => file.type.includes(f.substring(1)))) {
            arrArchivesError.push(file.name);
          } else if (this.arrObjArchive.find((i) => i.source === result)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Arquivo ${nameArchive} já inserido!`,
              life: 2500,
            });
          } else {
            let bufferLimpo = result ? result.split('base64,') : '';
            this.arrObjArchive.push({
              source: this.formatTypes(file.type).string == 'pdf' ? this.getSafeHtml(result) : result,
              ctdocume: bufferLimpo[1],
              name: file.name,
              type: file.type,
              tpdocume: this.formatTypes(file.type).id_type,
            });
          }
          cont++;
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao ler o arquivo ${nameArchive}`,
            life: 2500,
          });
        }
      }

      if (arrArchivesError.length == 1) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `O arquivo ${arrArchivesError[0]} possui um tipo não permitido`,
          life: 2500,
        });
      }
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    this.onSelectFile(files);
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  toFileList(files: any): FileList {
    const dt = new DataTransfer();
    files.forEach((f: any) => dt.items.add(f));
    return dt.files;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }

  removeImg(index: number) {
    this.arrObjArchive.splice(index, 1);
  }

  formatTypes(type: string) {
    if (['png', 'jpg', 'jpeg'].includes(type.split('/')[1])) {
      return { string: 'imagem', id_type: 1 };
    } else if (['pdf'].includes(type.split('/')[1])) {
      return { string: 'pdf', id_type: 2 };
    } else {
      return { string: 'Não Identificado', id_type: 0 };
    }
  }
}
