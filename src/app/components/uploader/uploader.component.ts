import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, Output, Input, EventEmitter, OnInit, inject, DestroyRef } from '@angular/core';
import { UploaderService } from '@fiap-tc-angular/infrastructure';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ArchiveItem {
  source: SafeHtml;
  name: string;
  type: string;
  tpdocume: number;
  original: File | undefined;
}

@Component({
  selector: 'app-uploader',
  imports: [CommonModule, Toast, ProgressSpinnerModule],
  providers: [MessageService, Toast],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
})
export class UploaderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly uploaderService = inject(UploaderService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly messageService = inject(MessageService);

  typeAccepted = ['application/pdf', 'image/jpeg', 'image/png'];
  arrObjArchive: ArchiveItem[] = [];
  maxItems: number = 3;
  loading: boolean = false;
  selectedImage: SafeHtml | null = null;
  usedGetFiles: boolean = false;

  @Input() transaction?: Transaction;
  @Output() returnFiles = new EventEmitter();
  @Output() downloaded = new EventEmitter();

  ngOnInit(): void {
    this.getFiles();
  }

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
            this.arrObjArchive.push({
              source: this.formatTypes(file.type).string == 'pdf' ? this.getSafeHtml(result) : result,
              name: file.name,
              type: file.type,
              original: file,
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

      this.returnFiles.emit(this.arrObjArchive.map((arquivo) => arquivo.original));
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
    this.returnFiles.emit(this.arrObjArchive);
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

  getFiles() {
    this.loading = true;
    this.uploaderService
      .getFiles(this.transaction!.id)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        let arquivos = res;
        for (let file of arquivos) {
          if (file.data) {
            this.arrObjArchive.push({
              source:
                this.formatTypes(file.contentType).id_type == 2
                  ? this.sanitizer.bypassSecurityTrustResourceUrl(`data:${file.contentType};base64,${file.data}`)
                  : `data:${file.contentType};base64,${file.data}`,
              name: file.filename,
              type: file.contentType,
              original: this.base64ToFile(file.data, file.filename, file.contentType),
              tpdocume: this.formatTypes(file.contentType).id_type,
            });
          }
        }

        this.usedGetFiles = arquivos.every((item) => Object.keys(item).length == 0) ? false : true;
        this.downloaded.emit(this.usedGetFiles);
      });
  }

  //Converte para FILE -> salvar na S3
  base64ToFile(base64: string, filename: string, contentType: string): File {
    const base64Data = base64.split(',')[1] || base64;
    // Decodifica a base64 em bytes
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Cria um Blob com o tipo de conteúdo correto
    const blob = new Blob([byteArray], { type: contentType });

    // Cria o File a partir do Blob
    return new File([blob], filename, { type: contentType });
  }

  downloadFile(archive: File) {
    const fileDownload = archive;
    const url = URL.createObjectURL(fileDownload);

    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileDownload.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
